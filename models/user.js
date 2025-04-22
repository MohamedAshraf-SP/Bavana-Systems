

import { Schema, model } from 'mongoose';
import { last } from 'pdf-lib';

const userSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    password: {
        type: String, required: true,
    },


    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },

    nationality: {
        type: String,
        required: true,
        // enum: [
        //     'Jordanian',
        //     'Syrian',
        //     'Palestinian',
        //     'Iraqi',
        //     'Egyptian',
        //     'Saudi',
        //     'Emirati',
        //     'Kuwaiti',
        //     'Omani',
        //     'Qatari',
        //     'Bahraini',
        //     'Lebanese',
        //     'Libyan',
        //     'Sudanese',
        //     'Yemeni'
        // ]
    },
    nationalId: {
        type: String,
        required: true,
        unique: true,
    },

    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function (date) {
                return date < new Date();
            },
            message: 'Date of birth must be in the past'
        },

        address: {
            city: { type: String, required: true },
            street: { type: String, required: true },
            buildingNumber: { type: String, required: true },
            floorNumber: { type: String, required: true },
            apartmentNumber: { type: String, required: true },
        },
        phone: {
            type: String,
            required: true,
            unique: true,

        },
        mobile: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (email) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                },
                message: 'Invalid email format'
            }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        isOnline: {
            type: Boolean,
            default: false
        },

        userRole: {
            type: String,
            enum: [
                'admin',
                'user',
                'client'
            ],
            required: true
        },
        userType: {
            type: String,
            enum: [
                'individual',
                'company'
            ],
            required: true
        }
    }
}, { timestamps: true });


userSchema.methods.generatePassword = function () {
    // Generate a 3-digit number (e.g., between 1000 and 9999)
    return Math.floor(Math.random() * 9087028200);
};

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default model('User', userSchema);

