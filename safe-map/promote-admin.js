const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const promoteUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`Successfully promoted ${email} to admin`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.log('Usage: node promote-admin.js <email>');
    process.exit(1);
}

promoteUser(email);
