const express = require('express');
var ObjectId = require('mongodb').ObjectId
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the records.
recordRoutes.route('/tasks').get(async function (_req, resp) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('tasks')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        resp.status(400).send('Error fetching listings!');
      } else {
        resp.json(result);
      }
    });
});
// This section will help you create a new user record.
recordRoutes.route('/auth/register').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const reqDb = {
    password: req.body.password,
    user_type: req.body.user_type,
  
    email: req.body.email,
  };
	dbConnect.collection('users')
	.insertOne(reqDb, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200).json({'msg':"ok"});
      }
    });
  
});
recordRoutes.route('/auth/login').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const reqDb = {
    password: req.body.password, 
    email: req.body.email,
  };
 console.log(reqDb)
	dbConnect.collection('users')
	.findOne(reqDb, function (err, result) {
      if (err) {
        res.status(400).send('login failed');
      } else {
    
        res.status(200).json(result);
      }
    }); 
  
});
recordRoutes.route('/task/applyTaskList').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const user_id = req.body.user_id;
 console.log(user_id)

  dbConnect
    .collection('tasks')
    .find({ belong: user_id })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
		
        res.json(result);
      }
    });
	
  
});
recordRoutes.route('/user/userinfo').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const user_id = req.body.user_id;
 console.log(user_id)

  dbConnect
    .collection('tasks')
    .find({ user_id: user_id })
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
		  var total = 0;
		  var unfinished = 0;
		for(var i=0;i<result.length;i++){
			if(result[i].state == 1){
				unfinished+=1;
			}
			total+=1;
		}
        res.json({total:total,unfinished:unfinished,result:result});
      }
    });
	
  
});

// This section will help you create a new record.
recordRoutes.route('/tasks/post').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const matchDocument = {
    title: req.body.title,
    last_modified: new Date(),
    detail: req.body.detail,
    money: req.body.money,
    spend_time: req.body.spend_time,
	state:0,
    phone: req.body.phone,
	user_id:req.body.user_id,
  };

  dbConnect
    .collection('tasks')
    .insertOne(matchDocument, function (err, result) {
      if (err) {
        res.status(400).send('Error inserting matches!');
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200).send();
      }
    });
});
recordRoutes.route('/tasks/applyTask').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const taskQuery = { _id: new ObjectId(req.body.taskid) };
  const updates = {
    $set: {
      state:1,
	  belong:req.body.user_id
    }, 
  };

  dbConnect
    .collection('tasks')
    .updateOne(taskQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
		res.status(200).send();
      }
    });
});

recordRoutes.route('/tasks/declineTask').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const taskQuery = { _id: new ObjectId(req.body.taskid) };
  const updates = {
    $set: {
      belong:'',
    }, 
  };
	console.log(req.body.state);
  dbConnect
    .collection('tasks')
    .updateOne(taskQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
		res.status(200).send();
      }
    });
});
recordRoutes.route('/tasks/doneTask').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const taskQuery = { _id: new ObjectId(req.body.taskid) };
  const updates = {
    $set: {
      state:req.body.state,
    }, 
  };
	console.log(req.body.state);
  dbConnect
    .collection('tasks')
    .updateOne(taskQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
		res.status(200).send();
      }
    });
});

recordRoutes.route('/tasks/updateTask').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const taskQuery = { _id: new ObjectId(req.body.taskid) };
  const updates = {
    $set: {
      state:2,
    }, 
  };

  dbConnect
    .collection('tasks')
    .updateOne(taskQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
		res.status(200).send();
      }
    });
});
recordRoutes.route('/tasks/deleteTask').post(function (req, res) {
  const dbConnect = dbo.getDb();
 const taskQuery = { _id:  new ObjectId(req.body.taskid) };

  dbConnect
    .collection('tasks')
    .deleteOne(taskQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
		res.status(200).send();
      }
    });
});
// This section will help you update a record by id.
recordRoutes.route('/listings/updateLike').post(function (req, res) {
  const dbConnect = dbo.getDb();
  const listingQuery = { _id: req.body.id };
  const updates = {
    $inc: {
      likes: 1,
    },
  };

  dbConnect
    .collection('listingsAndReviews')
    .updateOne(listingQuery, updates, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error updating likes on listing with id ${listingQuery.id}!`);
      } else {
        console.log('1 document updated');
      }
    });
});

// This section will help you delete a record.
recordRoutes.route('/listings/delete/:id').delete((req, res) => {
  const dbConnect = dbo.getDb();
  const listingQuery = { listing_id: req.body.id };

  dbConnect
    .collection('listingsAndReviews')
    .deleteOne(listingQuery, function (err, _result) {
      if (err) {
        res
          .status(400)
          .send(`Error deleting listing with id ${listingQuery.listing_id}!`);
      } else {
        console.log('1 document deleted');
      }
    });
});

module.exports = recordRoutes;
