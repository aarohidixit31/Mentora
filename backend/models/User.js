const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // Role and Status
  role: {
    type: String,
    enum: ['student', 'tutor', 'freelancer', 'admin'],
    default: 'student'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true // Students are auto-approved, tutors/freelancers need approval
  },
  
  // Profile Information
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  college: {
    type: String,
    maxlength: [100, 'College name cannot exceed 100 characters']
  },
  year: {
    type: String,
    enum: ['1st', '2nd', '3rd', '4th', 'Graduate', 'Other']
  },
  branch: {
    type: String,
    maxlength: [50, 'Branch cannot exceed 50 characters']
  },
  
  // Skills and Interests
  skills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  
  // Reputation System
  xp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  badges: [{
    name: String,
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Statistics
  stats: {
    doubtsAsked: {
      type: Number,
      default: 0
    },
    doubtsAnswered: {
      type: Number,
      default: 0
    },
    mentoringSessions: {
      type: Number,
      default: 0
    },
    freelanceProjects: {
      type: Number,
      default: 0
    },
    helpfulAnswers: {
      type: Number,
      default: 0
    }
  },
  
  // Tutor/Mentor Specific Fields
  tutorProfile: {
    expertise: [{
      type: String,
      trim: true
    }],
    experience: {
      type: String,
      maxlength: [1000, 'Experience cannot exceed 1000 characters']
    },
    hourlyRate: {
      type: Number,
      min: [0, 'Hourly rate cannot be negative']
    },
    availability: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      slots: [{
        startTime: String,
        endTime: String
      }]
    }],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Freelancer Specific Fields
  freelancerProfile: {
    portfolio: [{
      title: String,
      description: String,
      imageUrl: String,
      projectUrl: String,
      technologies: [String]
    }],
    services: [{
      title: String,
      description: String,
      price: Number,
      deliveryTime: String
    }],
    completedProjects: {
      type: Number,
      default: 0
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Social Links
  socialLinks: {
    github: String,
    linkedin: String,
    portfolio: String,
    twitter: String
  },
  
  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    mentorshipRequests: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Index for search optimization
userSchema.index({ name: 'text', email: 'text', skills: 'text' });
userSchema.index({ role: 1, isApproved: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate level based on XP
userSchema.methods.calculateLevel = function() {
  this.level = Math.floor(this.xp / 100) + 1;
  return this.level;
};

// Method to add XP and check for level up
userSchema.methods.addXP = function(points) {
  const oldLevel = this.level;
  this.xp += points;
  this.calculateLevel();
  
  return {
    xpGained: points,
    totalXP: this.xp,
    leveledUp: this.level > oldLevel,
    newLevel: this.level
  };
};

// Virtual for full profile completion percentage
userSchema.virtual('profileCompletion').get(function() {
  let completion = 0;
  const fields = ['name', 'email', 'bio', 'college', 'year', 'branch'];
  
  fields.forEach(field => {
    if (this[field]) completion += 16.67; // 100/6 fields
  });
  
  if (this.skills && this.skills.length > 0) completion += 16.67;
  
  return Math.round(completion);
});

module.exports = mongoose.model('User', userSchema);