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

require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
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
      version: '1.0.0',
      desctiption: 'Awesome project API desctiption',
      contact: {
        name : "Syimyk Zhantoroev",
        email: 's.m.zhantoroev@gmail.com',
      }
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
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required: true
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
 *      summary: register user
 *      description: register a new user
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                name:
 *                  type: string
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              example:
 *                name: Your name
 *                email: your@email.com
 *                password: "123"
 *      responses: 
 *        200:
 *          description: User created succesfully
 *        400:
 *          description: Bad Request. What are you doing?
 *        500:
 *          description: Failure in creating user
 */


 app.post('/signin', signin.handleSignin(db, bcrypt));
/**
 * @swagger
 * /signin: 
 *    post:
 *      description: sign in
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *              example:
 *                email: your@email.com
 *                password: "123"
 *      responses: 
 *        200:
 *          description: succes
 *        400:
 *          description: wrong credentials
 *        500:
 *          description: failure
 */

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db)})
/**
 * @swagger
 * /profile/{id}: 
 *    get:
 *      description: get user profile by id
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            required: true
 *      responses: 
 *        200: 
 *          description: Success
 */

app.put('/score', (req, res) => {score.handleScore(req, res, db)})

/**
 * @swagger
 * /score: 
 *    put:
 *      description: update user score
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  type: number
 *                score:
 *                  type: number
 *              example:
 *                id: 17
 *                score: 100
 *      responses: 
 *        200: 
 *          description: Success
 */

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is working`)
})