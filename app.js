const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('morgan');

const app = express();
const port = 4000;
app.use(logger('combined'));

// Token Verifucations middleware
const verifyToken = (req, res, next) => {
  // get auth header value 
  const bearerHeader = req.headers['authorization'];
  // bearerHeader check
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // Unauthorized
    res.sendStatus(403);
  }
};

app.get('/users', (req, resp) => {
  resp.json({
    id: 'unknown',
    typ: 'JWT',
  });
});

app.post('/users/post', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        id: 'n95babu',
        typ: 'test',
        message: 'users has been created',
        authData,
      });
    }
  });
});

app.post('/users/login', (req, res) => {
  const user = {
    id: 1,
    userName: 'nbabu',
    email: 'nbabu@email.com',
  };
  jwt.sign({ user }, 'secretkey', { expiresIn: '2 days' }, (err, token) => {
    res.json({
      token,
    });
  });
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server is listening on port ${port}`));
