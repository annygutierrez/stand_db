const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../auth');
const rjwt = require('restify-jwt-community');
const config = require('../config');

module.exports = server => {
  // Register User
  server.post('/register', (req, res, next) => {
    const { email, password, username } = req.body;

    const user = new User({
      email,
      password,
      username
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash password
        user.password = hash;
        // Save User
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // Get user
  server.get('/users/:id', rjwt({ secret: config.JWT_SECRET }), async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '15m'
      });

      const { iat, exp } = jwt.decode(token);
      // Respond with token
      res.send({ user, iat, exp, token });
      next();
    } catch (err) {
       return next(new errors.ResourceNotFoundError(`There is no customer with the id of ${req.params.id}`));
    }
  });

  // Auth user
  server.post('/auth', async (req, res, next) => {
      const { email, password, username } = req.body;

      try {
        // Authenticate user
        const user = await auth.authenticate(email, password, username);
        // Create JWT
        const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
          expiresIn: '15m'
        });

        const { iat, exp } = jwt.decode(token);
        // Respond with token
        res.send({ iat, exp, token });
        
        next();
      } catch (err) {
           // User unauthorized
           return next(new errors.UnauthorizedError(err));
      }
  })
}