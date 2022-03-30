const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    },
    token: {
        type: String,
        required: true,
    },
});

const SALT_WORK_FACTOR = 10;

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
    next();
});

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    },
});

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

UserSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', UserSchema);
module.exports = User;
