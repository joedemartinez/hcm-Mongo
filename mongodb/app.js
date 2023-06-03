const express = require('express')
const { connectToDb, getDb } = require('./db')
const bodyParser = require('body-parser');
const cors = require('cors') //CORS policy: No 'Access-Control-Allow-Origin' h 
const bcrypt = require('bcryptjs');
const {ObjectId, MongoClient} = require('mongodb')


//init app
const app = express()
app.use(bodyParser.json()) 
app.use(cors()) //CORS policy: No 'Access-Control-Allow-Origin' 
app.use(express.json())

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
//using aggregate to join users and emp table
app.get('/userEmp', (req, res) => {
        const agg = [
        {
        '$lookup': {
            'from': 'emp_table', 
            'localField': 'emp_id', 
            'foreignField': 'emp_id', 
            'as': 'result'
        }
        }
    ];
    const coll = db.collection('users').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
})

//employes
app.get('/employees', (req, res) => {
    const agg = [
        {
          '$lookup': {
            'from': 'units', 
            'localField': 'unit_id', 
            'foreignField': '_id', 
            'as': 'result'
          }
        }
      ];
    const coll = db.collection('emp_table').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
})

//units
app.get('/units', (req, res) => {
    const agg = [
        {
          '$lookup': {
            'from': 'emp_table', 
            'localField': '_id', 
            'foreignField': 'unit_id', 
            'as': 'result'
          }
        }
      ];
    const coll = db.collection('units').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
})

//postings
app.get('/postings', (req, res) => {
    const agg = [
        {
          '$lookup': {
            'from': 'emp_table', 
            'localField': 'emp_id', 
            'foreignField': 'emp_id', 
            'as': 'result'
          }
        }
      ];
    const coll = db.collection('postings_table').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
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
    const agg = [
        {
          '$count': 'count'
        }
      ];
    const coll = db.collection('emp_table').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
})
//units
app.get('/count/units', (req, res) => {
    const agg = [
        {
          '$count': 'count'
        }
      ];
    const coll = db.collection('units').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
})
//users
app.get('/count/users', (req, res) => {
    const agg = [
        {
          '$count': 'count'
        }
      ];
    const coll = db.collection('users').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
})
//exits
app.get('/count/exits', (req, res) => {
    const agg = [
        {
          '$count': 'count'
        }
      ];
    const coll = db.collection('exits').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
    // let exits = []
    // db.collection('exits')
    // .find()
    // .sort({emp_id: 1})
    // .forEach(exit => exits.push(exit))
    // .then(() => {
    //     res.status(200).json({status: true, data: exits.length})
    // }).catch(()=> {
    //     res.status(200).json({error: "Could not fetch"})
    // })
})

//trial
app.get('/trial', (req, res) => {
    // db.collection('units')
    // .find({Name: 'Internal Audit'})
    // .then(() => {
    //     res.status(200).json({status: true, data: exits})
    // }).catch(()=> {
    //     res.status(200).json({error: "Could not fetch"})
    // })
    const agg = [
        {
          '$count': 'count'
        }
      ];
    const coll = db.collection('users').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
})
// if (ObjectId.isValid(req.params.id))
// app.get('/trial/:id', (req, res) => {
//   if (ObjectId.isValid(req.params.id)){
//     db.collection('units')
//     .findOne({Name: 'Internal Audit'})
//     .then((doc) => {
//         res.status(200).json({status: true, data: doc})
//     }).catch(()=> {
//         res.status(200).json({error: "Could not fetch"})
//     }}
// })

// //post
// app.post('/trial', (req, res) => {
//     const exits = req.body
//     db.collection('units')
//     .insertOne(exits)
//     .then((result) => {
//         res.status(200).json({status: true, data: result})
//     }).catch(()=> {
//         res.status(200).json({error: "Could not fetch"})
//     })
// })

// //delete
// app.delete('/trial:id', (req, res) => {
//   if (ObjectId.isValid(req.params.id)){
//     db.collection('units')
//     .deleteOne({Name: 'Internal Audit'})
//     .then((doc) => {
//         res.status(200).json({status: true, data: doc})
//     }).catch(()=> {
//         res.status(200).json({error: "Could not fetch"})
//     })
// }
// })

// //update
// app.patch('/trial:id', (req, res) => {
//     const lupdate = req.body
//     if (ObjectId.isValid(req.params.id)){
//       db.collection('units')
//       .updateOne({Name: 'Internal Audit'}, {$set: lupdate})
//       .then((doc) => {
//           res.status(200).json({status: true, data: doc})
//       }).catch(()=> {
//           res.status(200).json({error: "Could not fetch"})
//       })
//   }
//   })