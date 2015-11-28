var Lazy = require('lazy'),
    fs  = require("fs"),
    MongoClient = require('mongodb').MongoClient;


//Connection URL
var url = 'mongodb://localhost:27017/songProject';

MongoClient.connect(url, function (err, db){

    new Lazy(fs.createReadStream('./trajectories-0515-0530.txt'))
        .lines
        .forEach(function(line){

            var fields = line.toString().trim().split(/\s+/, 18);
            var data = {
                vehicleID       : fields[0],
                FrameID         : fields[1],
                TotalFrames     : fields[2],
                GlobalTime      : fields[3],
                LocalX          : fields[4],
                LocalY          : fields[5],
                GlobalX         : fields[6],
                GlobalY         : fields[7],
                VehicleLength   : fields[8],
                VehicleWidth    : fields[9],
                VehicleClass    : fields[10],
                VehicleVelocity : fields[11],
                VehicleAcceleration : fields[12],
                LaneIdentification  : fields[13],
                PrecedingVecicle    : fields[14],
                FollowingVechicle   : fields[15],
                Spacing             : fields[16],
                Headway             : fields[17]
            };

            insertDocuments(db, data, function (result) {
                console.log('ok');
                //console.log(result);
                //db.close();
            })

        });//end foreach

    //db.close();  지우면 안됨. foreach는 blocking은데 왜 그런지는 알아봐야겠

});


var insertDocuments = function(db, jsonMsg, callback) {
    // Get the documents collection

     var collection = db.collection('documents');

    collection.insertOne(
            jsonMsg
        , function(err, result) {
            if(err){
                console.error(err);
            }

             callback(result);
         });
};


