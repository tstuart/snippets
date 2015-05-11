
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost/snippets', function(err, db) {
  if (err) {
    console.error(err);
    db.close();
    return;
  }

  var collection = db.collection('snippets');

  var create = function(name, content) {
    var snippet = {
      name: name,
      content: content
    };
    
    collection.insert(snippet, function(err, result) {
      if (err) {
        console.error("Could not create snippet", name);
        db.close();
        return;
      }
      console.log("Created Snippet", name);
      db.close();
    });
    
  };

  var read = function(name) {
    var query = {
      name: name
    };
    collection.findOne(query, function(err, snippet) {
      if (!snippet || err) {
        console.error("Could Not Read Snippet", name);
        db.close();
        return;
      }
      console.log("Read Snippet", snippet.name);
      console.log(snippet.content);
      db.close();
    });
  };

  var update = function(name, content) {
    var query = {
      name: name
    };
    
    var update = {
      $set: {content: content}
    };
    
    collection.findAndModify(query, null, update, function(err, result){
      var snippet = result.value;
      if (!snippet || err) {
        console.error("Could Not Update Snippet", name);
        db.close();
        return;
      }
      console.log("Updated Snippet", snippet.name);
      db.close();
    });
    
  };

  var del = function(name) {
    var query = {
      name: name
    };
    
    collection.findAndRemove(query, function(err, result) {
      var snippet = result.value;
      if (!snippet || err) {
        console.error("Could not delete snippet", name);
        db.close();
        return;
      }
      console.log("Snippet Deleted", snippet.name);
      db.close();
    });
    
  };

  var main = function() {
    if (process.argv[2] == 'create') {
      create(process.argv[3], process.argv[4]);
    }
    else if (process.argv[2] == 'read') {
      read(process.argv[3]);
    }
    else if (process.argv[2] == 'update') {
      update(process.argv[3], process.argv[4]);
    }
    else if (process.argv[2] == 'delete') {
      del(process.argv[3]);
    }
    else {
      console.error('Command not recognized');
      db.close();
    }
  }
  
  main();
  
});