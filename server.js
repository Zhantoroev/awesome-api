const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors');
const knex = require('knex');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require("swagger-jsdoc");

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const score = require('./controllers/score');
const profile = require('./controllers/profile');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
app.use(express.json())
app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Awesome",
      version: '1.0',
      desctiption: 'Awesome project API desctiption',
      contact: {
        name : "Syimyk Zhantoroev",
        email: 's.m.zhantoroev@gmail.com',
        website: 'https://github.com/Zhantoroev/'
      },
      servers:['https://peaceful-retreat-54716.herokuapp.com/']
    }
  },
  apis: ['server.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.get('/', (req, res) => {
  res.send('it is working')
})
app.get('/all', (req, res) => {
  db.select('*').from('users')
  .then(user => {
    if(user.length) {
      res.json(user);
    } else {
      res.status(400).json('user not found');
    }
  })
  .catch(err => res.status(404).json('something wrong'))
}  
)
app.get('/all/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
  .then(user => {
    if(user.length) {
      res.json(user[0]);
    } else {
      res.status(400).json('user not found');
    }
  })
  .catch(err => res.status(404).json('something wrong'))
})

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)})
app.put('/score', (req, res) => {score.handleScore(req, res, db)})

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is working`)
})