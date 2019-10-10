// This JS requires express
let express = require('express');
let mongodb = require('mongodb');

// Creating an express object.
let app = express();

// Create database connection variable. Assigned later using connect method.
let db;

// password: BnAaOw8h7CSiTTJM   user: shoppingListUser
// Create the connection string from our online database. Where or what to connect to.
let connectionString = 'mongodb+srv://ShoppingListUser:BnAaOw8h7CSiTTJM@cluster0-emfyf.mongodb.net/ShoppingListApp?retryWrites=true&w=majority';
// Establish a connection to our database with .connect(ConnectionString, mongoDB configuration object , CB Function to call once connection is opened)
mongodb.connect(connectionString, {{useNewUrlParser: true, useUnifiedTopology: true}

}, (err, client) => {
    // Assign our global db variable access to our online database
    db = client.db()
    // When node server is running, listen on this port and listen for requests.
    // When accessing a database, make sure your database connection is established before requests can happen.
    app.listen(3000);
})

// Adds a body object to the req object. So you can get user form data. No enabled by default.
app.use(express.urlencoded({extended: false}));

// When getting this page run this CB function with the express request and response objects as params.
app.get('/', (req, res) => {
    // Access response object and send this to the browser.
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
            <body>
            <div class="container">
                <h1 class="display-4 text-center py-1">To-Do App</h1>
                
                <div class="jumbotron p-3 shadow-sm">
                <form action="/create-item" method="POST">
                    <div class="d-flex align-items-center">
                    <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                    <button class="btn btn-primary">Add New Item</button>
                    </div>
                </form>
                </div>
                
                <ul class="list-group pb-5">
                <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                    <span class="item-text">Fake example item #1111</span>
                    <div>
                    <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                    <button class="delete-me btn btn-danger btn-sm">Delete</button>
                    </div>
                </li>
                <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                    <span class="item-text">Fake example item #2</span>
                    <div>
                    <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                    <button class="delete-me btn btn-danger btn-sm">Delete</button>
                    </div>
                </li>
                <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                    <span class="item-text">Fake example item #3</span>
                    <div>
                    <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                    <button class="delete-me btn btn-danger btn-sm">Delete</button>
                    </div>
                </li>
                </ul>
                
            </div>
        
        </body>
        </html>
    `);
});

// When a post is made to (URL, CB Function) run code.
app.post('/create-item', (req, res) => {
    // Get user input data with req.body.nameOfHTMLInput
    console.log(req.body.item);
    // Select this collection in the database. Then perform basic CRUD operations.
    // .insertOne inserts a new document into the DB (objectToCreate, CB Function after it's document is created)
    db.collection('items').insertOne({text: req.body.item}, () => {
        res.send('Submitted.');
    });
    // Send response for completion
    res.send('Submitted');
});

