import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  walletBalances: {
    BTC: { type: Number, default: 0 },
    MAJOR: { type: Number, default: 0 },
    USDT: { type: Number, default: 0 },
    USDC: { type: Number, default: 0 },
    STAR: { type: Number, default: 0 },
    GBD: { type: Number, default: 0 },
    NOT: { type: Number, default: 0 }
  },
  spinsLeft: {
    type: Number,
    default: 10
  },
  lastSpinTime: {
    type: Date,
    default: Date.now
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateReferralCode = function() {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.referralCode = code;
  return code;
};

export default mongoose.model('User', userSchema);