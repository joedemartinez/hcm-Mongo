const express = require('express')
const { connectToDb, getDb } = require('./db')
const bodyParser = require('body-parser');
const cors = require('cors') //CORS policy: No 'Access-Control-Allow-Origin' h 
const bcrypt = require('bcryptjs');

//init app
const app = express()
app.use(bodyParser.json()) 
app.use(cors()) //CORS policy: No 'Access-Control-Allow-Origin' 


//db conn
let db
connectToDb( (fn) => {
    if (!fn) {
        //port number
        app.listen(8089, () => {
            console.log('App listening on Port 8089')
        })
        db = getDb()
    }
})



// ROUTES

//DOCUMENTS FROM THE VARIOUS COLLECTIONS
//users
app.get('/users', (req, res) => {
    let users = []
    db.collection('users')
    .find()
    .sort({emp_id: 1})
    .forEach(user => users.push(user))
    .then(() => {
        res.status(200).json({status: true, data: users})
        // res.send({status: true, data: results})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})

//employes
app.get('/employees', (req, res) => {
    let employees = []
    db.collection('emp_table')
    .find()
    .sort({emp_id: 1})
    .forEach(employee => employees.push(employee))
    .then(() => {
        res.status(200).json({status: true, data: employees})
        // res.send({status: true, data: results})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})

//units
app.get('/units', (req, res) => {
    let units = []
    db.collection('units')
    .find()
    .sort({Name: 1})
    .forEach(unit => units.push(unit))
    .then(() => {
        res.status(200).json({status: true, data: units})
        // res.send({status: true, data: results})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})

//postings
app.get('/postings', (req, res) => {
    let postings = []
    db.collection('postings_table')
    .find()
    .sort({emp_id: 1})
    .forEach(posting => employees.push(posting))
    .then(() => {
        res.status(200).json({status: true, data: employees})
        // res.send({status: true, data: results})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})

//promotion
app.get('/promotions', (req, res) => {
    let promotions = []
    db.collection('promotions')
    .find()
    .sort({emp_id: 1})
    .forEach(promotion => promotions.push(promotion))
    .then(() => {
        res.status(200).json({status: true, data: promotions})
        // res.send({status: true, data: results})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})

//promotionHistory
app.get('/promotionHistory', (req, res) => {
    let promotions = []
    db.collection('promotion_history')
    .find()
    .sort({emp_id: 1})
    .forEach(promotion => promotions.push(promotion))
    .then(() => {
        res.status(200).json({status: true, data: promotions})
        // res.send({status: true, data: results})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})

//exits
app.get('/exits', (req, res) => {
    let exits = []
    db.collection('exits')
    .find()
    .sort({emp_id: 1})
    .forEach(exit => exits.push(exit))
    .then(() => {
        res.status(200).json({status: true, data: exits})
        // res.send({status: true, data: results})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})




//DASHBOARD COUNTS FOR CARD
//employee
app.get('/count/employees', (req, res) => {
    let employees = []
    db.collection('emp_table')
    .find()
    .sort({emp_id: 1})
    .forEach(employee => employees.push(employee))
    .then(() => {
        res.status(200).json({status: true, data: employees.length})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})
//units
app.get('/count/units', (req, res) => {
    let units = []
    db.collection('units')
    .find()
    .sort({Name: 1})
    .forEach(unit => units.push(unit))
    .then(() => {
        res.status(200).json({status: true, data: units.length})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})
//users
app.get('/count/users', (req, res) => {
    let users = []
    db.collection('users')
    .find()
    .sort({emp_id: 1})
    .forEach(user => users.push(user))
    .then(() => {
        res.status(200).json({status: true, data: users.length})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})
//exits
app.get('/count/exits', (req, res) => {
    let exits = []
    db.collection('exits')
    .find()
    .sort({emp_id: 1})
    .forEach(exit => exits.push(exit))
    .then(() => {
        res.status(200).json({status: true, data: exits.length})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})