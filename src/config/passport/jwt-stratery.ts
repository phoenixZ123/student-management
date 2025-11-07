import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport, { PassportStatic } from 'passport';
import { User } from 'src/features/auth/entity/user.entity';
import { AppDataSource } from '../db.config';
import { AppConfig } from '../app.config';

const secret = AppConfig.secrets.jwtSecret || 'your_jwt_secret';

export const setupJwtStrategy = (passport: PassportStatic) => {
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
      },
      async (payload, done) => {
        try {
          const userRepo = AppDataSource.getRepository(User);
          const user = await userRepo.findOne({ where: { id: payload.id } });

          if (!user) {
            return done(null, false); // ❌ no user found = Unauthorized
          }

          return done(null, user); // ✅ attach full user entity to req.user
        } catch (err) {
          console.error("JWT Strategy Error:", err);
          return done(err, false);
        }
      }
    )
  );

  console.log('✅ JWT strategy registered');
};
