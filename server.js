// This JS requires express
let express = require('express');
let mongodb = require('mongodb');
let sanitizeHTML = require('sanitize-html');

// Creating an express object.
let app = express();

// Create database connection variable. Assigned later using connect method.
let db;

// Makes content of folder public and available from root of our server
app.use(express.static('public'));

// password: BnAaOw8h7CSiTTJM   user: shoppingListUser
// Create the connection string from our online database. Where or what to connect to.
let connectionString = 'mongodb+srv://ShoppingListUser:BnAaOw8h7CSiTTJM@cluster0-emfyf.mongodb.net/ShoppingListApp?retryWrites=true&w=majority';
// Establish a connection to our database with 
// .connect(ConnectionString, mongoDB configuration object , CB Function to call once connection is opened)
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    // Assign our global db variable access to our online database
    db = client.db();
    // When node server is running, listen on this port and listen for requests.
    // When accessing a database, make sure your database connection is established before requests can happen.
    // Good idea to place listen within db connect code block.
    app.listen(3000);
})

// Adds a body object to the req object. So you can get user form data. No enabled by default.
app.use(express.urlencoded({extended: false}));
app.use(express.json());

function passwordProtected(req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="Shopping List APP"');
    console.log(req.headers.authorization);
    if (req.headers.authorization == 'Basic Y2h1YmVyOmNodWJlcg==') {
        next();
    } else {
        res.status(401).send('Authentication required');
    };
    
};

// Tells express to use this function for all our routes. 
app.use(passwordProtected);

// When getting this page run this CB function with the express request and response objects as params.
// You can pass multiple functions in express. Runs in order.
app.get('/', (req, res) => {
    // Access data base, look for items, find all items, send to array, run this function with err params and the items param.
    db.collection('items').find().toArray( (err, items) => {
        
        // Access response object and send this to the browser.
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
            <script src="./js.js"></script>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Simple To-Do App</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
            </head>
                <body>
                <div class="container">
                    <h1 class="display-4 text-center py-1">To-Do App</h1>
                    
                    <div class="jumbotron p-3 shadow-sm">
                        <form id="create-form" action="/create-item" method="POST">
                            <div class="d-flex align-items-center">
                            <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                            <button class="btn btn-primary">Add New Item</button>
                            </div>
                        </form>
                    </div>
                    
                    <ul id="item-list" class="list-group pb-5">
                </div>
                <script>
                let items = ${JSON.stringify(items)}
                </script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>
                <script src="/browser.js"></script>
            </body>
            </html>
        `);
    });

});
    
    
    

// When a post is made to (URL, CB Function) run code.
app.post('/create-item', (req, res) => {
    // Use sanitizeHTML module to not allow malicious code to be submitted. HTML or ATTR tags.
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {} });
    // Select this collection in the database. Then perform basic CRUD operations.
    // .insertOne inserts a new document into the DB (objectToCreate, CB Function after it's document is created)
    db.collection('items').insertOne({text: safeText}, (err, info) => {
        res.json(info.ops[0]);
    });
    // Send response for completion
  
});



app.post('/update-item', (req, res) => {
    // Use sanitizeHTML module to not allow malicious code to be submitted. HTML or ATTR tags.
    let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} });
    // To update doc, use findOneAndUpdate('The Doc to update', What we want to update on that doc , CB Function once action has completed)
    db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, () => {
        res.send('Update Complete');
    })
});

// When a post is made to (URL, CB Function) run code.
app.post('/delete-item', (req, res) => {
    // Get user input data with req.body.nameOfHTMLInput
    console.log(req.body.item);
    // Select this collection in the database. Then perform basic CRUD operations.
    // .insertOne inserts a new document into the DB (objectToCreate, CB Function after it's document is created)
    db.collection('items').deleteOne( {_id: new mongodb.ObjectId(req.body.id)}, () => {
        res.redirect('/');
    });
    // Send response for completion
  
});