import dotenv from 'dotenv';

dotenv.config();

export const AppConfig = {
    // PostgreSQL Database configuration
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5433,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'admin',
        name: process.env.DB_NAME || 'student-management',
        synchronize: true,
        logging: true,
    },
    secrets: {
        jwtSecret: process.env.JWT_SECRET || 'supersecret',
    },

};
