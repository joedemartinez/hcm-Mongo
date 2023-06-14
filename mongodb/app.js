const express = require('express')
const { connectToDb, getDb } = require('./db') 
const bodyParser = require('body-parser');
const cors = require('cors') //CORS policy: No 'Access-Control-Allow-Origin' h 
const bcrypt = require('bcryptjs');
const {ObjectId} = require('mongodb')

// //JSON WEB TOKEN
const jwt = require('jsonwebtoken');
const expiresIn = '1d'; // Set the expiration time (e.g., 1 hour)
//jwt request auth
function authenticate(req, res, next) {
  if (!req.headers || !req.headers.authorization) {
    res.status(401).json({ error: 'Authorization header missing' });
    return;
  }
  
  const token = req.headers.authorization.split(' ')[1];

  try {
      const decoded = jwt.verify(token, 'secretKey');
      req.emp_id = decoded.emp_id; // Store the user ID in the request object for future use
      next(); // Proceed to the next middleware or route handler
  } catch (error) {
      res.status(401).json({ error: 'Invalid token' }); // or redirect to login page
  }
}

//FILE UPLOAD
const multer  = require('multer')
// Configure the storage destination for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../hcmApp/src/assets/img'); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


//INIT APP
const app = express()
app.use(bodyParser.json()) 
app.use(cors()) //CORS policy: No 'Access-Control-Allow-Origin' 
app.use(express.json())

// Handle the file upload request
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully.');
});

//DB CONN
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

//LOGIN
//checking for authN
app.post("/login", (req, res) => {
  let {emp_id, password} = req.body
  
  const agg = [
    {
      $match: {
        emp_id: emp_id
      }
    },
    {
      $lookup: {
        from: "emp_table",
        let: { empId: "$emp_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$emp_id", "$$empId"] }
            }
          },
          {
            $project: {
              name: {
                $concat: ["$emp_firstname", " ", "$emp_middlename", " ", "$emp_surname"]
              },
              photo: "$photo"
            }
          }
        ],
        as: "employee"
      }
    },
    {
      $limit: 1 // Optional: If you only want to retrieve a single document
    }
  ];
  const coll = db.collection('users').aggregate(agg);
  coll.toArray().then((doc) => {
    if (doc.length > 0){
      result = doc[0].password
      const verified = bcrypt.compareSync(password, result);
      if (verified) {
          const token = jwt.sign({ user: doc[0].emp_id, user_type: doc[0].user_type, photo: doc[0].employee[0].photo, name: doc[0].employee[0].name  }, 'secretKey', { expiresIn });
          // const token = jwt.sign({ userId: doc.emp_id }, 'secretKey');
          res.send({status: true, token: token})
      } else {
          res.send({status: false, message: "Oops! Error occured, Wrong Staff ID or Password"})
      }   
    }else{
        res.send({status: false, message: "Oops! User do not exist"})
    }
  })
})

// //change password 
app.patch('/password/update/:id', authenticate, (req, res) => {
  const {newPassword, confirmPassword}  = req.body
  const emp_id = req.params.id
  password = bcrypt.hashSync(newPassword, 10) //encode password
  const lupdate = {
    password: password
  }
    db.collection('users')
    .updateOne({emp_id: emp_id}, {$set: lupdate})
    .then((doc) => {
        res.status(200).json({status: true, data: doc})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})


//DOCUMENTS FROM THE VARIOUS COLLECTIONS
//USERS
app.get('/users',authenticate, (req, res) => {
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
app.get('/userEmp',authenticate, (req, res) => {
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
//insert user
app.post("/users/add",authenticate, (req, res) => {
  let {emp_id, password, user_type} = req.body
  password = bcrypt.hashSync(password, 10)

  user = {
    emp_id: emp_id,
    password: password,
    user_type: user_type,
    status: 0
  }

  db.collection('users')
  .insertOne(user)
  .then((result) => {
      res.status(200).json({status: true,  message: "User Created Successfully"})
  }).catch(()=> {
      res.status(200).json({error: "Could not fetch", message: "Oops! Error occured, user not created"})
  })

})
//employees but not users
app.get('/usersList',authenticate, (req, res) => {
 
    
  const agg = [
    {
      $lookup: {
        from: "users",
        localField: "emp_id",
        foreignField: "emp_id",
        as: "user"
      }
    },
    {
      $match: {
        $expr: {
          $not: {
            $gt: [{ $size: "$user" }, 0]
          }
        }
      }
    }
  ];
  const coll = db.collection('emp_table').aggregate(agg);
  coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
  })
})
//search records
app.get("/users/:id",authenticate,(req, res) => {
  let emp_id = req.params.id;
  const agg = [
    {
      '$match': {
          '$expr': {
              '$eq': [
                  '$emp_id', emp_id
              ]
          }
      }
  }, {
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
// //reset password 
app.patch('/users/reset/:id',authenticate, (req, res) => {
    const {emp_id}  = req.body
    password = bcrypt.hashSync('password', 10) //encode password
    const lupdate = {
      password: password
    }
      db.collection('users')
      .updateOne({emp_id: emp_id}, {$set: lupdate})
      .then((doc) => {
          res.status(200).json({status: true, data: doc})
      }).catch(()=> {
          res.status(200).json({error: "Could not fetch"})
      })
  })
// //delete
app.delete('/users/delete/:id',authenticate, (req, res) => {
    const emp_id  = req.params.id
    db.collection('users')
    .deleteOne({emp_id: emp_id})
    .then((doc) => {
        res.status(200).json({status: true, data: doc})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})
// //update
app.patch('/users/update/:id',authenticate, (req, res) => {
  const {emp_id}  = req.body
  const lupdate = req.body
    db.collection('users')
    .updateOne({emp_id: emp_id}, {$set: lupdate})
    .then((doc) => {
        res.status(200).json({status: true, data: doc})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})




// EMPLOYEES
app.get('/employees', authenticate, (req, res) => {
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
//insert employee
app.post("/employees/add",authenticate, (req, res) => {
  let employee = req.body

  db.collection('emp_table')
  .insertOne(employee)
  .then((result) => {
      res.status(200).json({status: true,  message: "Employee Created Successfully"})
  }).catch(()=> {
      res.status(200).json({error: "Could not fetch", message: "Oops! Error occured, employee not created"})
  })

})
//search records
app.get("/employees/:id",authenticate, (req, res) => {
  let emp_id = req.params.id;
  const agg = [
    {
      '$match': {
          '$expr': {
              '$eq': [
                  '$_id', new ObjectId(emp_id)
              ]
          }
      }
  }
  ];
  const coll = db.collection('emp_table').aggregate(agg);
  coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
  })
})
// //update
app.patch('/employees/update/:id',authenticate, (req, res) => {
  const emp_id  = req.params.id
  const lupdate = req.body
    db.collection('emp_table')
    .updateOne({_id: new ObjectId(emp_id)}, {$set: lupdate})
    .then((doc) => {
        res.status(200).json({status: true, data: doc})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})
// //delete
app.delete('/employees/delete/:id',authenticate, (req, res) => {
  const emp_id  = req.params.id
  db.collection('emp_table')
  .deleteOne({_id: new ObjectId(emp_id)})
  .then((doc) => {
      res.status(200).json({status: true, data: doc})
  }).catch(()=> {
      res.status(200).json({error: "Could not fetch"})
  })
})



//UNITS
app.get('/units',authenticate, (req, res) => {
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
//insert unit
app.post("/units/add",authenticate, (req, res) => {
  let unit = req.body

  db.collection('units')
  .insertOne(unit)
  .then((result) => {
      res.status(200).json({status: true,  message: "Unit Created Successfully"})
  }).catch(()=> {
      res.status(200).json({error: "Could not fetch", message: "Oops! Error occured, unit not created"})
  })

})
//search unit
app.get("/units/:id",authenticate, (req, res) => {
  let _id = req.params.id;
  const agg = [
    {
      '$match': {
          '$expr': {
              '$eq': [
                  '$_id', new ObjectId(_id)
              ]
          }
      }
  }
  ];
  const coll = db.collection('units').aggregate(agg);
  coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
  })
})
// //update
app.patch('/units/update/:id',authenticate, (req, res) => {
  const unit  = req.body
  const unit_id = req.params.id
    db.collection('units')
    .updateOne({_id: new ObjectId(unit_id)}, {$set: unit})
    .then((doc) => {
        res.status(200).json({status: true, data: doc})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})
// //delete
app.delete('/units/delete/:id',authenticate, (req, res) => {
  const unit_id = req.params.id
  db.collection('units')
  .deleteOne({_id: new ObjectId(unit_id)})
  .then((doc) => {
      res.status(200).json({status: true, data: doc})
  }).catch(()=> {
      res.status(200).json({error: "Could not fetch"})
  })
})







//POSTINGS
app.get('/postings',authenticate, (req, res) => {
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
//insert unit
app.post("/postings/add",authenticate, (req, res) => {
  let posting = req.body

  db.collection('postings_table')
  .insertOne(posting)
  .then((result) => {
      res.status(200).json({status: true,  message: "Posting Created Successfully"})
  }).catch(()=> {
      res.status(200).json({error: "Could not fetch", message: "Oops! Error occured, posting not created"})
  })

})
//search records
app.get("/postings/:id",authenticate, (req, res) => {
  let emp_id = req.params.id;
  const agg = [
    {
      '$match': {
          '$expr': {
              '$eq': [
                  '$emp_id', emp_id
              ]
          }
      }
  }, {
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
// //update
app.patch('/postings/update/:id',authenticate, (req, res) => {
  const posting  = req.body
  const posting_id = req.params.id
    db.collection('postings_table')
    .updateOne({emp_id: posting_id}, {$set: posting})
    .then((doc) => {
        res.status(200).json({status: true, data: doc})
    }).catch(()=> {
        res.status(200).json({error: "Could not fetch"})
    })
})
// //delete
app.delete('/postings/delete/:id',authenticate, (req, res) => {
  const posting_id = req.params.id
  db.collection('postings_table')
  .deleteOne({_id: new ObjectId(posting_id)})
  .then((doc) => {
      res.status(200).json({status: true, data: doc})
  }).catch(()=> {
      res.status(200).json({error: "Could not fetch"})
  })
})




//PROMOTION
app.get('/promotions',authenticate, (req, res) => {
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





//PROMOTION HISTORY 
app.get('/promotionHistory',authenticate, (req, res) => {
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





//EXITS
app.get('/exits',authenticate, (req, res) => {
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
app.get('/count/employees',authenticate, (req, res) => {
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
app.get('/count/units',authenticate, (req, res) => {
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
app.get('/count/users',authenticate, (req, res) => {
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
app.get('/count/exits',authenticate, (req, res) => {
    const agg = [
        {
          '$count': 'count'
        }
      ];
    const coll = db.collection('exits').aggregate(agg);
    coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
    })
})
//Bar Chart
app.get("/chartVal",authenticate, (req, res) => {
  const agg = [
    {
      $lookup: {
        from: "emp_table",
        localField: "_id",
        foreignField: "unit_id",
        as: "employees"
      }
    }, {
      '$match': {
          'employees': {
              '$ne': []
          }
      }
  }
    ];
  const coll = db.collection('units').aggregate(agg);
  coll.toArray().then((doc) => {
    res.status(200).json({status: true, data: doc})
  })
})

