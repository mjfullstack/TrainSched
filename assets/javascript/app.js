$(document).ready(function(){

    // VARS
    var DEBUG = false;
    var CURR_DEBUG = true;

    var trainRowEntry;
    // Create a variable to reference the database
    var database = firebase.database();

    // At the initial load and on subsequent data value changes, get a snapshot of the current data. (I.E FIREBASE HERE)
    // This callback keeps the page updated when a value changes in firebase.
    // database.ref().on("child_added", function(snapshot) {  // Returns a different object so must do display code DIFFERENTLY    // DATABASE LISTENER!!!
    database.ref().on('value', function(snapshot) {  // DATABASE LISTENER!!!
    // We are now inside our .on function...

        // Console.log the "snapshot" value (a point-in-time representation of the database)
        // This "snapshot" allows the page to get the most current values in firebase.
        if (DEBUG) {
            console.log(snapshot.val());
        };

        // UPDATE the value of our object parameters to match the value in the database
        trainRowEntry = snapshot.val();

        // Console log the value of the object
        if (CURR_DEBUG) {
            console.log("----------- Start trainRowEntry -----------");
            console.log(trainRowEntry);
            console.log("------------  End trainRowEntry -----------");
        }

        // Do Calculations for these vars...
        // TBD: ADD moment.today(); // TBD
        var tNextArrival = 0; // TBD
        // Current Time
        var currTime = moment();
        console.log("CURRENT TIME: " + currTime.format("hh:mm"));
        console.log("CURRENT TIME: " + currTime.format("LLLL"));
        console.log("CURRENT TIME: " + currTime);

        // Difference between the times: Now - tFirstTimeConv
        console.log("---------------------------------------------------")
        console.log("Object.values(trainRowEntry = " , Object.values(trainRowEntry) );
        console.log("Object.values(trainRowEntry) -> trainRowEntry[0].tNameDB = " , Object.values(trainRowEntry)[0].tNameDB ); 
        console.log("Object.values(trainRowEntry) -> trainRowEntry[0].tDestDB = " , Object.values(trainRowEntry)[0].tDestDB ); 
        console.log("Object.values(trainRowEntry) -> trainRowEntry[0].tFirstTimeConvDB = " , moment(Object.values(trainRowEntry)[0].tFirstTimeConvDB) ); 
        console.log("Object.values(trainRowEntry) -> trainRowEntry[0].tFreqDB = " , Object.values(trainRowEntry)[0].tFreqDB ); 
        var diffTime = currTime.diff(moment(Object.values(trainRowEntry)[0].tFirstTimeConvDB), "minutes");
        // console.log("DIFFERENCE IN TIME currTime.diff(moment(Object.values(trainRowEntry)[0].tFirstTimeConvDB), 'minutes') is: " , moment(diffTime));
        console.log("DIFFERENCE IN TIME currTime.diff(moment(Object.values(trainRowEntry)[0].tFirstTimeConvDB), 'minutes') is: " , diffTime);
        console.log("---------------------------------------------------")

        // Time apart (remainder)
        var tFreqFromObj = Object.values(trainRowEntry)[0].tFreqDB;
        console.log("tFreqFromObj = ", tFreqFromObj);
        var tRemainder = diffTime % Object.values(trainRowEntry)[0].tFreqDB;
        console.log("tRemainder = " + tRemainder);

        // Minute Until Train
        var tMinAway = Object.values(trainRowEntry)[0].tFreqDB - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinAway);

        // Next Train
        var tNextArrival = moment().add(tMinAway, "minutes");
        console.log("ARRIVAL TIME: " + moment(tNextArrival).format("hh:mm"));

        // Clear out existing table, to allow for re-writing entire table without duplicating!
        $("#train-sched-table-body").html("");
        // Loop through database objects to present data to the screen.
        snapshot.forEach(function(trainSnapshot) {
            var trainKey = trainSnapshot.key;
            var trainData = trainSnapshot.val();
            console.log("trainKey =" + trainKey + "--- trainData = "+ trainData);
            console.log("trainData.tNameDB = " + trainData.tNameDB );
            console.log("trainData.tDestDB = " + trainData.tDestDB );
            console.log("trainData.tFirstTimeDB = " + trainData.tFirstTimeConvDB );
            console.log("trainData.tFreqDB = " + trainData.tFreqDB );
            // Calculations for next arrival and minutes away

            console.log("tMinAway = " + tMinAway);
            console.log("tNextArrival = " + moment(tNextArrival).format("hh:mm"));
    // Change the HTML using jQuery to reflect the updated objeect values
            $("#train-sched-table-body").append("<tr>");
            $("#train-sched-table-body").append("<td>" + trainData.tNameDB + "</td>");
            $("#train-sched-table-body").append("<td>" + trainData.tDestDB + "</td>");
            $("#train-sched-table-body").append("<td>" + trainData.tFreqDB + "</td>");
            $("#train-sched-table-body").append("<td>" + moment(tNextArrival).format("hh:mm") + "</td>");
            $("#train-sched-table-body").append("<td>" + tMinAway + "</td>");
            $("#train-sched-table-body").append("</tr>");
            ;

        });



    },
    // Then include Firebase error logging
    function(errorObject) {
        throw err;
        console.log("The read failed: " + errorObject.code);
    });


    // Whenever a user clicks the click button...
    // Get inputs on button submit
    $("#add-train-btn").on("click", function(event) {
        event.preventDefault();
    
        var tName = $("#train-name-input").val().trim();
        var tDest = $("#train-dest-input").val().trim();
        var tFirstTime = $("#train-first-input").val().trim();
        var tFreq = $("#train-freq-input").val().trim();
        
        // First Time (pushed back 1 year to make sure it comes before current time)
        // var tFirstTimeConv = moment(tFirstTime, "HH:mm").subtract(1, "years").format("dddd, MMMM Do YYYY, h:mm:ss a");
        // console.log(tFirstTimeConv);
        //JSON.stringify(obj);
        var tFirstTimeConv = moment(tFirstTime, "HH:mm").subtract(1, "years").format();
        console.log(tFirstTimeConv);
        var myJSONtFirstTimeConv  = JSON.stringify(tFirstTimeConv);
        console.log("myJSONtFirstTimeConv =" + myJSONtFirstTimeConv);
        // var tFirstTimeConv = moment(tFirstTime, "HH:mm").subtract(1, "years").format("HH:mm");
        // console.log(tFirstTimeConv);

        if (CURR_DEBUG) {
            console.log("We detected the button!!!")
            console.log("tName = " + tName);
            console.log("tDest = " + tDest);
            console.log("tFirstTime = " + tFirstTime);
            console.log("tFirstTimeConv = " + moment(tFirstTimeConv).format('LLLL'));
            console.log("myJSONtFirstTimeConv = " + myJSONtFirstTimeConv);
            console.log("tFreq = " + tFreq);
        };
            
          // Save new value to Firebase
        database.ref().push({ // Using PUSH creates child objects, vs SET overwrites data already there
            tNameDB: tName, // Posting this  object to the database in the cloud
            tDestDB: tDest, // Posting this  object to the database in the cloud
            // tFirstTimeConvDB: tFirstTimeConv, // Posting this  object to the database in the cloud
            tFirstTimeConvDB: myJSONtFirstTimeConv, // Posting this STRINGIFIED object to the database in the cloud
            tFreqDB: tFreq // Posting this  object to the database in the cloud
        });

        // Log the value of our object
        if (CURR_DEBUG) {
            console.log("database.ref() = " + database.ref());
        };
    });

    $("#time-date-btn").on("click", function(event) {
        event.preventDefault();
        console.log(moment().format('LLLL'));  // 'Friday, June 24, 2016 1:42 AM'
        $("#time-date-display").append("<h3>" + moment().format('LLLL') + " </h3>"); 

    // Objify
    // var objify = function(objIn) {
    //     var rv = objIn;
            // var objify = function() {
            //     var rv = {};
            //     for (var i = 0; i < arguments.length; ++i)
            //         rv[arguments[i]] = rv[arguments[i+1]];
            //     return rv;
            // }
            // console.log(objify("name", "filler"));



        // New Randomization
/*        
        var myArray = [1, 2, 3, 4, 5, 6, 7 , 8, 9, 10];
        console.log("BEFORE SHUFFLE: myArray = " + myArray);
        $("#array-shuffle").append("<h3>BEFORE SHUFFLE: myArray = " + myArray) + "</h3>";
        Array.prototype.shuffle = function() {
            for (let i=this.length-1; i>0; i--) {
                const j = Math.floor(Math.random() * i+1);
                [this[i], this[j]] = [this[j], this[i]]; // eslint-disable-line no-param-reassign
            };
        };
        myArray.shuffle();
        console.log("AFTER SHUFFLE: myArray = " + myArray);
        $("#array-shuffle").append("<h3>AFTER SHUFFLE: &nbsp;&nbsp;myArray = " + myArray) + "</h3>";
/*/       
    });





// moment.js most widely used one in the world!
// var randomDate = moment(1/1/89);
// var randomFormat = moment().format("MM/DD/YYYY");
        // var diffTime = currTime.diff(moment(myUNJSONtFirstTimeConvDB), "minutes");
        // console.log("DIFFERENCE IN TIME via currTime.diff(moment(myUNJSONtFirstTimeConvDB), 'minutes') is: " + moment(diffTime));
        // console.log("moment(trainRowEntry.tFirstTimeConvDB).format() = " + moment(trainRowEntry.tFirstTimeConvDB).format() );
        // The above line gets Current Time, wanted a year ago which is in the database
        // console.log("trainRowEntry[0].tNameDB = " + moment(trainRowEntry[0].tNameDB)); // Undefined
        // console.log("trainRowEntry[0].tFirstTimeConvDB = " + trainRowEntry[0].tFirstTimeConvDB); // Undefined
        // console.log("trainRowEntry[o].tFreqDB = " + trainRowEntry[0].tFreqDB); // Undefined
        // var myUNJSONtFirstTimeConvDB = JSON.parse(trainRowEntry[0].tFirstTimeConvDB);
        // var myUNJSONtFirstTimeConvDB = JSON.parse(trainRowEntry[0]);
        // console.log("trainRowEntry[0].tFirstTimeConvDB = " + myUNJSONtFirstTimeConvDB );
        // console.log("trainRowEntry[0].tFirstTimeConvDB = " + moment(myUNJSONtFirstTimeConvDB) );
        // var tFirstTimeLessOneYr = moment(trainRowEntry.tFirstTimeConvDB);
        // console.log("tFirstTimeLessOneYr: " + tFirstTimeLessOneYr.format());
        // var reSubtract1Yr =  moment(trainRowEntry.tFirstTimeConvDB).subtract(1, "years").format();
        // console.log("reSubtract1Yr = " + reSubtract1Yr)
        // console.log("reSubtract1Yr = " + reSubtract1Yr);
        // var diffTime = currTime.diff(tFirstTimeLessOneYr, "minutes");

});