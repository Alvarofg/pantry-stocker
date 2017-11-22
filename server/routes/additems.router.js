var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');
var pg = require('pg');


//router to add item
router.post('/additems', function (req, res) {
    if (req.isAuthenticated()) {
        console.log('add item post');
        var userInfo = req.user.id;
        var item = req.body;
        console.log('userid', req.user.id)
        console.log(req.body);
        pool.connect(function (errorConnectingtoDB, db, done) {
            if (errorConnectingtoDB) {
                console.log('Error Connecting to DB', errorConnectingtoDB);
                res.sendStatus(500);
            }
            else {
                db.query('INSERT INTO "Items" ("item_name", "user_id", "default_store_id") VALUES ($1, $2, $3) RETURNING "item_id";',
                    [item.itemName, userInfo, item.itemStore], function (errorMakingQuery, result) {
                        if (errorMakingQuery) {
                            console.log('Error Making Query - Add Item', errorMakingQuery);
                            res.sendStatus(500);
                        }//if query error for item insert in item table
                        else {                            
                            db.query('INSERT INTO "stock" ("item_id", "quantity", "min_quantity", "pantry_location") VALUES ($1, $2, $3, $4);',
                                [result.rows[0].item_id, item.itemQuantity, item.reminderQuantity, item.itemPantry], function (errorMakingQuery, result) {
                                    done();
                                    if (errorMakingQuery) {
                                        console.log('Error Making Query - Add Item to Stock', errorMakingQuery);
                                        res.sendStatus(500);
                                    }//if for item stock insert
                                    else {
                                        res.sendStatus(201);
                                    }//item stock insert
                                })//db.query 
                        }//if query else   
                    })//db.query
            }//end else for pool
        })//end pool
    }//if authenticated
    else {
        console.log('User is not logged in');
        res.send(false);
    }//is authenticated
});//router.post for add item


//route for getting pantries by logged in user
router.get('/mypantries/:id', function(req, res){
    console.log('req params', req.params.id);
    if(req.isAuthenticated) {
        var userId = req.user.id; 
        var pantryId = req.params.id;
        pool.connect(function(errorConnectingtoDB, db, done){
            var queryText = 
            'SELECT "Items"."item_name", "Items"."item_id", "Items"."default_store_id", "stock"."quantity", "stock"."min_quantity", "stock"."pantry_location"' +
            'FROM "stock" JOIN "Items"' +
            'ON "stock"."item_id" = "Items"."item_id"' +
            'WHERE "stock"."pantry_location" = $1;';
            db.query(queryText, [pantryId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                    console.log(result.rows);
                    
                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

//route for getting all items for the logged in user
router.get('/allitems', function (req, res) {
    if (req.isAuthenticated) {
        var userId = req.user.id;

        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'SELECT "Items"."item_id", "Items"."item_name", "Items"."default_store_id" FROM "Items";';
            db.query(queryText, function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                    console.log(result.rows);

                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})

//route to delete an item
router.delete('/removeitem/:id', function(req, res){
    console.log('req params', req.params.id);
    if (req.isAuthenticated) {
        var itemToDelete = req.params.id;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText = 'DELETE FROM "stock" WHERE "item_id" = $1;';
            db.query(queryText, [itemToDelete], function (errorMakingQuery, result) {
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    var queryText = 'DELETE FROM "Items" WHERE "item_id" = $1;';
                    db.query(queryText, [itemToDelete], function(errorMakingQuery, result){
                        done();
                        if(errorMakingQuery) {
                            console.log('Error making query', errorMakingQuery);
                            res.sendStatus(500);
                        }
                        else {
                            res.sendStatus(200);
                        }//end second query else
                    })//end Items table db.query
                }//end else for second query
            })//end db.query for stock table
        })//end pool connect
    }//end if authenticted
    else {
        console.log('User is not logged in');
        res.send(false);
    }//end authenticated else
})

//route to get stock totals
router.get('/itemstock/:id', function (req, res) {
    console.log('req params', req.params.id);
    if (req.isAuthenticated) {
        var itemId = req.params.id;
        pool.connect(function (errorConnectingtoDB, db, done) {
            var queryText =
                'SELECT "stock"."item_id", "stock"."quantity", "stock"."min_quantity", "stock"."pantry_location", "pantry"."label"' +
                'FROM "stock" JOIN "pantry"' +
                'ON "stock"."pantry_location" = "pantry"."pantry_id"' +
                'WHERE "stock"."item_id" = $1;';
            db.query(queryText, [itemId], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                    console.log(result.rows);

                }
            })
        })
    }
    else {
        console.log('User is not logged in');
        res.send(false);
    }
})



module.exports = router;