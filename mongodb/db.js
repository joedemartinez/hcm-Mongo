const { MongoClient } = require('mongodb')

// connection String
// mongodb+srv://user:password@cluster0.9qmc1tt.mongodb.net/dbname?retryWrites=true&w=majority

let conn
module.exports = {
    connectToDb: (fn) => {
        MongoClient.connect('mongodb+srv://dbuser:MvjpuPOT0vOfqJzj@cluster0.9qmc1tt.mongodb.net/Hcm?retryWrites=true&w=majority')
        .then((client) => {
            conn = client.db()
            return fn()
        })
        .catch(err => {
            console.log(err)
            return fn(err)
        })
    },
    getDb: () => conn
}