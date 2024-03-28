import passport from 'passport';
import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import { GraphQLLocalStrategy } from 'graphql-passport';

export const configurePassport = async () => {
  /* https://github.com/passport/todos-express-password/blob/master/routes/auth.js */
  passport.serializeUser((user, done) => {
    console.log('Serializing user');
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user');
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  /* https://github.com/ericmakesapps/graphql-passport */
  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('Invalid username or password');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid username or password');
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
