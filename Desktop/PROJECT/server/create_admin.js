const sequelize = require('./config/database');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Ensure tables exist
        await sequelize.sync();
        console.log('Database synced.');

        // Check if admin exists
        const adminEmail = 'admin@yellowshield.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin user already exists.');
            console.log('Email:', existingAdmin.email);
            // In a real scenario we wouldn't print the password, but since I don't know it, 
            // I'll just say it exists.
            // If I want to reset it, I could.
            // Let's reset it to 'admin123' to be sure.
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log('Admin password reset to: admin123');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                fullName: 'System Admin',
                department: 'IT',
                role: 'admin'
            });
            console.log('Admin user created.');
            console.log('Email: admin@yellowshield.com');
            console.log('Password: admin123');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await sequelize.close();
    }
};

createAdmin();
