import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/db.config';

// Convert PORT to number
const PORT = process.env.PORT ? Number(process.env.PORT) : 7777;

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully.');

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  })
  .catch((error) => {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); // stop app if DB connection fails
  });
