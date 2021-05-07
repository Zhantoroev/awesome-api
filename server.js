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
/**
 * @swagger
 * /: 
 *    get:
 *      description: To check is it working or not
 *      responses:
 *        200:
 *          description: It is working
 *        404:
 *          description: Something wrong
 */

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
})
/**
 * @swagger
 * /all: 
 *    get:
 *      summary: get all users
 *      description: Get all users
 *      responses: 
 *        200:
 *          description: Success
 *        404:
 *          description: Something wrong
 */

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
/**
 * @swagger
 * /all/{id}: 
 *    get:
 *      summary: get single user by id
 *      description: get defined user information
 *      parameters:
 *      -   name: id
 *          in: formData
 *          type: number
 *          example: "5"
 *          required: true
 *      responses: 
 *        200: 
 *          description: Success
 *        404:
 *          description: Something wrong
 */

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});
/**
 * @swagger
 * /register: 
 *    post:
 *      description: Register to create an account
 *      requestBody:
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              name:
 *                type: string
 *            example:
 *              id: 10
 *              name: Jessica Smith
 *      responses: 
 *        200:
 *          description: user created succesfully
 *        400:
 *          description: Bad Request. What are you doing?
 *        500:
 *          description: failure in creating user
 */


 app.post('/signin', signin.handleSignin(db, bcrypt));
/**
 * @swagger
 * /signin: 
 *    post:
 *      description: Signin as user
 *      parameters:
 *      -   name: email
 *          in: formData
 *          type: string
 *          example: "youremail@mail.com"
 *          required: true
 * 
 *      -   name: password
 *          in: formData
 *          type: string
 *          example: "123"
 *          required: true
 *      responses: 
 *        200:
 *          description: succes
 *        400:
 *          description: something went wrong
 *        500:
 *          description: failure
 */

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)})
/**
 * @swagger
 * /profile/{id}: 
 *    get:
 *      description: get signed in user information
 *      parameters:
 *      -   name: id
 *          in: formData
 *          type: number
 *          required: true
 *          example: 5
 *      responses: 
 *        200: 
 *          description: Success
 *        404:
 *          description: Weird...
 */

app.put('/score', (req, res) => {score.handleScore(req, res, db)})

/**
 * @swagger
 * /score: 
 *    put:
 *      description: update user score
 *      parameters:
 *      -   name: id
 *          in: formData
 *          type: number
 *          example: 5
 *          required: true
 *      -   name: score
 *          in: formData
 *          type: number
 *          example: 10
 *          required: true
 *      responses: 
 *        200: 
 *          description: Success
 */

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is working`)
})