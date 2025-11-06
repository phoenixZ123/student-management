import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/db.config';


const PORT = process.env.PORT || 7777;
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  })
  .catch((error) => {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); // stop app if DB connection fails
  });
