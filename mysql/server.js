//constants
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors') //CORS policy: No 'Access-Control-Allow-Origin' h 
const mysql = require('mysql')
const server = express()
server.use(bodyParser.json()) 
server.use(cors()) //CORS policy: No 'Access-Control-Allow-Origin' 
const bcrypt = require('bcryptjs'); //password hashing

//establish db conn
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hcm"
})

//check for conn error
conn.connect(function (err) {
    if(err){
        console.log("Oops!! Error Occured")
    }else{
        console.log("DB connected successfully!!")
    }
})

//port listening
server.listen(8080, function check( err) {
    if(err){
        console.log("Oops!! Error Occured")
    }else{
        console.log("Started...")
    }
})


//LOGIN
//checking for authN
// const password_hash =bcrypt.hashSync('dummy', 10); //hashing
    // console.log(password_hash);
    // const verified = bcrypt.compareSync('dummy', password_hash); // comparing already existing

server.post("/api/login/:id", (req, res) => {
    
    let {emp_id, password} = req.body
    let sql = "SELECT *, (Select concat(emp_firstname, ' ', emp_middlename, ' ', emp_surname) from emp_table where emp_id = ut.emp_id) as name, (Select photo from emp_table where emp_id = ut.emp_id) as photo FROM users_table ut WHERE emp_id = '"+emp_id+"'";
    
    conn.query(sql, function(err, results){
        if(err){
            res.send({status: false, message: "Oops! User do not exist"})
        }else{
            result = results[0].password
            const verified = bcrypt.compareSync(password, result);
            if (verified) {
                res.send({status: true, data: results})
            } else {
                res.send({status: false, message: "Oops! Error occured, Wrong Staff ID or Password"})
            }
            
        }
    })
})



//PROFILE
//ChangePassword
server.put("/api/password/update/:id", (req, res) => {
    let {newPassword} = req.body
    password = bcrypt.hashSync(newPassword, 10) //encode password

    let sql = "UPDATE users_table SET password ='" + password + "' WHERE emp_id ='" +req.params.id +"'";
    // console.log(sql)
    conn.query(sql, (err, results) => {
        if(err) {
            res.send ({ status: false, message: "Password Reset Failed"})
        }else{
            res.send ({ status: true, message: "Password Reset Successful"})
        }
    })
})




//DASHBOARD VALUES
//counting items in tables => emp, user, units, promotions
server.get("/api/count/users", (req, res) => { //users
    let sql = "SELECT count(*) as count FROM users_table"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Users")
        }else{
            res.send({status: true, data: results})
        }
    })
})
server.get("/api/count/emps", (req, res) => { //employees
    let sql = "SELECT count(*) as count FROM emp_table"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Employees")
        }else{
            res.send({status: true, data: results})
        }
    })
})
server.get("/api/count/units", (req, res) => { //units
    let sql = "SELECT count(*) as count FROM units_table"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Units")
        }else{
            res.send({status: true, data: results})
        }
    })
})
server.get("/api/count/exits", (req, res) => { //exits
    let sql = "SELECT count(*) as count FROM exits_table"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Exits")
        }else{
            res.send({status: true, data: results})
        }
    })
})
//chart values
server.get("/api/chartVal", (req, res) => {
    let sql = "SELECT *, (select count(*) from emp_table where unit_id = ut.unit_id) as unitNumber FROM `units_table` ut where ut.unit_id IN (SELECT unit_id from emp_table)"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Units")
        }else{
            res.send({status: true, data: results})
        }
    })
})


//EMPLOYEES
//Employees data table
server.get("/api/employees", (req, res) => {
    let sql = "SELECT `id`,`emp_id`,concat(`emp_firstname`, ' ',`emp_middlename`, ' ',`emp_surname`) as 'name',`emp_gender`,`emp_dob`,`emp_email`,`emp_currentgrade`,`emp_dateoffirstappointment`,`emp_dateofpresentappointment`,`emp_highestqualification`,`emp_staffstatus`,`emp_yearswithministry`,`emp_maritalstatus`,`emp_phoneno`,`photo`, (select name from units_table WHERE unit_id = emp.unit_id) as Unit FROM `emp_table` emp;"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Employees")
        }else{
            res.send({status: true, data: results})
        }
    })
})
//employee record
server.get("/api/employees/:id", (req, res) => {
    let sql = "SELECT `id`,`emp_id`,`emp_firstname`,`emp_middlename`,`emp_surname`,`emp_gender`,`emp_dob`,`emp_email`,`emp_highestqualification`,`emp_staffstatus`,`emp_yearswithministry`,`emp_maritalstatus`,`emp_phoneno`,`photo`, `unit_id`, (select name from units_table WHERE unit_id = emp.unit_id) as Unit FROM `emp_table` emp WHERE emp.emp_id = '"+req.params.id+"'";
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Employee")
        }else{
            res.send({status: true, data: results})
        }
    })
})
//add new employee
server.post("/api/employees/add", (req, res) => {
    let {emp_id, emp_surname, emp_firstname, emp_middlename, emp_gender, emp_dob, emp_email, emp_highestqualification, emp_staffstatus, emp_yearswithministry, emp_maritalstatus, emp_phoneno, photo, unit_id} = req.body

    let sql = "INSERT INTO emp_table (emp_id, emp_surname, emp_firstname, emp_middlename, emp_gender, emp_dob, emp_email, emp_highestqualification, emp_staffstatus, emp_yearswithministry, emp_maritalstatus, emp_phoneno, photo, unit_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) " 
    conn.query(sql, [emp_id, emp_surname, emp_firstname, emp_middlename, emp_gender, emp_dob, emp_email, emp_highestqualification, emp_staffstatus, emp_yearswithministry, emp_maritalstatus, emp_phoneno, photo, unit_id], (err, results) => {
        if(err){
            res.send({status: false, message: "Oops! Error occured, unable to add employee"})
        }else{
            res.send({status: true, message: "New Employee added Successfully"})
        }
    })
})
//update records
server.put("/api/employees/update/:id", (req, res) => {
    let sql = "UPDATE emp_table SET `emp_id`='" + req.body.emp_id + "',`emp_surname`='" + req.body.emp_surname + "',`emp_firstname`='" + req.body.emp_firstname + "',`emp_middlename`='" + req.body.emp_middlename + "',`emp_gender`='" + req.body.emp_gender + "',`emp_dob`='" + req.body.emp_dob + "',`emp_email`='" + req.body.emp_email + "',`emp_highestqualification`='" + req.body.emp_highestqualification + "',`emp_staffstatus`='" + req.body.emp_staffstatus + "',`emp_yearswithministry`='" + req.body.emp_yearswithministry + "',`emp_maritalstatus`='" + req.body.emp_maritalstatus + "',`emp_phoneno`='" + req.body.emp_phoneno + "',`photo`='" + req.body.photo + "',`unit_id`='" + req.body.unit_id + "' WHERE emp_id ='" +req.params.id +"'";

    conn.query(sql, (err, results) => {
        if(err) {
            res.send ({ status: false, message: "Employee Update Failed"})
        }else{
            res.send ({ status: true, message: "Employee Update Successful"})
        }
    })
})
//delete records
server.delete("/api/employees/delete/:id", (req, res) => {
    let sql = "DELETE FROM emp_table WHERE emp_id ='" + req.params.id + "'";
    conn.query(sql, (err) => {
        if(err){
            res.send({ status: false, message: "Employee Deleted Failed"})
        } else {
            let sql = "DELETE FROM users_table WHERE emp_id ='" + req.params.id + "'";
            conn.query(sql, (err) => {
                if(err){
                    res.send({ status: false, message: "Employee Deleted Failed"})
                } else {
                    
                    res.send ({ status: true, message: "Employee Delete Successful"})
                }
            })
            // res.send ({ status: true, message: "Employee Delete Successful"})
        }
    })
})





//UNITS
//get all records
server.get("/api/units", (req, res) => {
    let sql = "SELECT *, (select count(*) from emp_table where unit_id = ut.unit_id) as unitNumber FROM `units_table` ut"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Units")
        }else{
            res.send({status: true, data: results})
        }
    })
})
//get record
server.get("/api/units/:id", (req, res) => {
    let sql = "SELECT * FROM `units_table` WHERE unit_id = '"+req.params.id+"'";
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Unit")
        }else{
            res.send({status: true, data: results})
        }
    })
})
//add new unit
server.post("/api/units/add", (req, res) => {
    let {Name} = req.body

    let sql = "INSERT INTO units_table (Name) VALUES (?) " 
    conn.query(sql, [Name], (err, results) => {
        if(err){
            res.send({status: false, message: "Oops! Error occured, unable to add unit"})
        }else{
            res.send({status: true, message: "New Unit added Successfully"})
        }
    })
})
//update records
server.put("/api/units/update/:id", (req, res) => {
    let sql = "UPDATE units_table SET Name ='" + req.body.Name + "' WHERE unit_id ='" +req.params.id +"'";

    conn.query(sql, (err, results) => {
        if(err) {
            res.send ({ status: false, message: "Unit Update Failed"})
        }else{
            res.send ({ status: true, message: "Unit Update Successful"})
        }
    })
})
//delete records
server.delete("/api/units/delete/:id", (req, res) => {
    let sql = "DELETE FROM units_table WHERE unit_id ='" + req.params.id + "'";
    conn.query(sql, (err) => {
        if(err){
            res.send({ status: false, message: "Unit Deleted Failed"})
        } else {
            res.send ({ status: true, message: "Unit Delete Successful"})
        }
    })
})



//POSTINGS
//view records
server.get("/api/postings", (req, res) => {
    let sql = "SELECT *, (Select concat(emp_firstname, ' ', emp_middlename, ' ', emp_surname) from emp_table  where emp_id = pt.emp_id)as name FROM `postings_table` pt"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Postings")
        }else{
            res.send({status: true, data: results})
        }
    })
})
//view record
server.get("/api/postings/:id", (req, res) => {
    let sql = "SELECT *, (Select concat(emp_firstname, ' ', emp_middlename, ' ', emp_surname) from emp_table  where emp_id = pt.emp_id)as name FROM `postings_table` pt WHERE pt.id ="+req.params.id
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Posting")
        }else{
            res.send({status: true, data: results})
        }
    })
})
//add new posting
server.post("/api/postings/add", (req, res) => {
    let {emp_id, post_from, post_to, region, effectiveDate, releaseDate, assumptionDate} = req.body
    let sql = "INSERT INTO postings_table (emp_id, post_from, post_to, region, effectiveDate, releaseDate, assumptionDate) VALUES (?,?,?,?,?,?,?) " 
    conn.query(sql, [emp_id, post_from, post_to, region, effectiveDate, releaseDate, assumptionDate], (err, results) => {
        if(err){
            res.send({status: false, message: "Oops! Error occured, unable to add posting"})
        }else{
            res.send({status: true, message: "New Posting added Successfully"})
        }
    })
})
//update records
server.put("/api/postings/update/:id", (req, res) => {
    let sql = "UPDATE postings_table SET post_from = '" + req.body.post_from + "',post_to= '" + req.body.post_to + "',region= '" + req.body.region + "',effectiveDate= '" + req.body.effectiveDate + "',releaseDate= '" + req.body.releaseDate + "',assumptionDate= '" + req.body.assumptionDate + "' WHERE id ='" +req.params.id +"'";
    console.log(sql)
    conn.query(sql, (err, results) => {
        if(err) {
            res.send ({ status: false, message: "Posting Update Failed"})
        }else{
            res.send ({ status: true, message: "Posting Update Successful"})
        }
    })
})
//delete records
server.delete("/api/postings/delete/:id", (req, res) => {
    let sql = "DELETE FROM postings_table WHERE id ='" + req.params.id + "'";
    conn.query(sql, (err) => {
        if(err){
            res.send({ status: false, message: "Posting Deleted Failed"})
        } else {
            res.send ({ status: true, message: "Posting Delete Successful"})
        }
    })
})






//PROMOTIONS
//view records
server.get("/api/promotions", (req, res) => {
    let sql = "SELECT *, (Select concat(emp_firstname, ' ', emp_middlename, ' ', emp_surname) from emp_table where emp_id = pt.emp_id) as name FROM promotions_table pt";
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Postings")
        }else{
            res.send({status: true, data: results})
        }
    })
})




//PROMOTION HISTORY
//search Promotion
server.get("/api/promtionsHistory/", (req, res) => {
    let emp_id = req.params.id;
    let sql = "SELECT * FROM promotion_history";
    conn.query(sql, (err, results) => {
        if(err){
            console.log("Oops! Error occured, promotions not found")
        }else{
            res.send({status: true, data: results})
        }
    })
})






//USERS
//view records
server.get("/api/users", (req, res) => {
    let sql = "SELECT *, (Select concat(emp_firstname, ' ', emp_middlename, ' ', emp_surname) from emp_table where emp_id = ut.emp_id) as name FROM users_table ut"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Users")
        }else{
            res.send({status: true, data: results})
        }
    })

    // const password_hash =bcrypt.hashSync('dummy', 10); //hashing
    // console.log(password_hash);
    // const verified = bcrypt.compareSync('dummy', password_hash); // comparing already existing
})

//Users modal employee list
server.get("/api/usersList", (req, res) => {
    let sql = "SELECT emp_id, concat(emp_firstname, ' ', emp_middlename, ' ', emp_surname) as name FROM `emp_table` et where et.emp_id NOT IN (select ut.emp_id from users_table ut)"
    conn.query(sql, function(err, results){
        if(err){
            console.log("Oops! Error Fetching Users")
        }else{
            res.send({status: true, data: results})
        }
    })
})

//insert data
server.post("/api/users/add", (req, res) => {
    let {emp_id, password, user_type} = req.body
    password = bcrypt.hashSync(password, 10)

    let sql = "INSERT INTO users_table (emp_id, password, user_type) VALUES (?,?,?) " 
    conn.query(sql, [emp_id, password, user_type], (err, results) => {
        if(err){
            res.send({status: false, message: "Oops! Error occured, user not created"})
        }else{
            res.send({status: true, message: "User Created Successfully"})
        }
    })
})

//search records
server.get("/api/users/:id", (req, res) => {
    let emp_id = req.params.id;
    let sql = "SELECT *, (Select concat(emp_firstname, ' ', emp_middlename, ' ', emp_surname) from emp_table where emp_id = ut.emp_id) as name FROM users_table ut WHERE emp_id = '" + emp_id +"'";
    conn.query(sql, (err, results) => {
        if(err){
            console.log("Oops! Error occured, user not found")
        }else{
            res.send({status: true, data: results})
        }
    })
})


//update records
server.put("/api/users/update/:id", (req, res) => {
    let sql = "UPDATE users_table SET user_type ='" + req.body.user_type + "' WHERE emp_id ='" +req.body.emp_id +"'";

    conn.query(sql, (err, results) => {
        if(err) {
            res.send ({ status: false, message: "User Update Failed"})
        }else{
            res.send ({ status: true, message: "User Update Successful"})
        }
    })
})

//reset password
server.put("/api/users/reset/:id", (req, res) => {
    password = bcrypt.hashSync('password', 10) //encode password

    let sql = "UPDATE users_table SET password ='" + password + "' WHERE emp_id ='" +req.params.id +"'";
    // console.log(sql)
    conn.query(sql, (err, results) => {
        if(err) {
            res.send ({ status: false, message: "Password Reset Failed"})
        }else{
            res.send ({ status: true, message: "Password Reset Successful"})
        }
    })
})

//delete records
server.delete("/api/users/delete/:id", (req, res) => {
    let sql = "DELETE FROM users_table WHERE emp_id ='" + req.params.id + "'";
    conn.query(sql, (err) => {
        if(err){
            res.send({ status: false, message: "Users Deleted Failed"})
        } else {
            res.send ({ status: true, message: "User Delete Successful"})
        }
    })
})