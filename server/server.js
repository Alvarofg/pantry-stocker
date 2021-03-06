var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('./strategies/sql.localstrategy');
var sessionConfig = require('./modules/session.config');

// Route includes
var indexRouter = require('./routes/index.router');
var userRouter = require('./routes/user.router');
var registerRouter = require('./routes/register.router');
var addItemsRouter = require('./routes/additems.router');
var storesRouter = require('./routes/stores.router');
var pantriesRouter = require('./routes/pantries.router');
var itemUpdateRouter = require('./routes/itemupdate.router');
var removeItemRouter = require('./routes/removeitem.router');
var addOneItemRouter = require('./routes/addoneitem.router');
var shoppingListRouter = require('./routes/shoppinglist.router')

var port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/items', addItemsRouter);
app.use('/stores', storesRouter);
app.use('/pantries', pantriesRouter);
app.use('/itemupdate', itemUpdateRouter);
app.use('/removeitem', removeItemRouter);
app.use('/additem', addOneItemRouter);
app.use('/shoppinglist', shoppingListRouter);

// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //
app.listen(port, function(){
    console.log('Listening on port:', port);
});
