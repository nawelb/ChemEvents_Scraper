require('dotenv').config()
//myGenericMongoClient module (with MongoDB/MongoClient)
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var mongoDbUrl = process.env.DB_URL; //on MongoDB Atlas 
var dbName = process.env.DB_NAME; //by default
var currentDb=null; //current MongoDB connection

var setMongoDbUrl = function(dbUrl){
	mongoDbUrl = dbUrl;
}

var setMongoDbName = function(mongoDbName){
	dbName = mongoDbName;
}

var closeCurrentMongoDBConnection = function(){
	currentDb.close();
	currentDb=null;
	console.log("closed DB")
}

var executeInMongoDbConnection = function(callback_with_db) {
  if(currentDb==null){
    MongoClient.connect(mongoDbUrl, function(err, db) {
	if(err!=null) {
		console.log("mongoDb connection error = " + err + " for dbUrl=" + mongoDbUrl );
	}
	assert.equal(null, err);
	console.log("Connected correctly to mongodb database" );
	//currentDb = db; //with mongodb client v2.x
	currentDb = db.db(dbName);//with mongodb client >= v3.x
	callback_with_db(currentDb);
	db.close();
	});
  }else{
	callback_with_db(currentDb);  
  }
}

var genericUpdateOne = function(collectionName,id,changes,callback_with_err_and_results) {
	executeInMongoDbConnection( function(db) {
		db.collection(collectionName).updateOne( { '_id' : id }, { $set : changes } ,
			function(err, results) {
				if(err!=null) {
					console.log("genericUpdateOne error = " + err);
				}
			callback_with_err_and_results(err,results);
			});
		});
	
};


var genericUpdateOneScrap = function(collectionName,id,changes,callback_with_err_and_results) {
	executeInMongoDbConnection( function(db) {
		db.collection(collectionName).updateOne( { '_id' : id }, { $set : changes } ,{upsert: true}, 
			function(err, results) {
				if(err!=null) {
					console.log("genericUpdateOne error = " + err);
				}
			callback_with_err_and_results(err,results);
			});
		});
};



var genericInsertOne = function(collectionName,newOne,callback_with_err_and_newId) {
	executeInMongoDbConnection( function(db) {
 db.collection(collectionName).insertOne( newOne , function(err, result) {
		if(err!=null) {
			console.log("genericInsertOne error = " + err);
			newId=null;
		}
		else {newId=newOne._id;
		}
		callback_with_err_and_newId(err,newId);
		});
		
	});
};




exports.genericUpdateOne = genericUpdateOne;
exports.genericInsertOne = genericInsertOne;
exports.setMongoDbUrl = setMongoDbUrl;
exports.setMongoDbName =setMongoDbName;
exports.executeInMongoDbConnection = executeInMongoDbConnection;
exports.closeCurrentMongoDBConnection = closeCurrentMongoDBConnection;
exports.genericUpdateOneScrap = genericUpdateOneScrap;
