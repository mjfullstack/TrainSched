$(document).ready(function(){

    // VARS
    var DEBUG = false;
    var CURR_DEBUG = true;

    // Create a variable to reference the database
    var database = firebase.database();

    // At the initial load and on subsequent data value changes, get a snapshot of the current data. (I.E FIREBASE HERE)
    // This callback keeps the page updated when a value changes in firebase.
    // database.ref().on("child_added", function(snapshot) {  // Returns a different object so must do display code DIFFERENTLY
    database.ref().on('value', function(snapshot) {  // DATABASE LISTENER!!!
    // We are now inside our .on function...

        // Console.log the "snapshot" value (a point-in-time representation of the database)
        // This "snapshot" allows the page to get the most current values in firebase.
        if (DEBUG) {
            console.log(snapshot.val());
        };

        // Clear out existing table, to allow for re-writing entire table without duplicating!
        $("#train-sched-table-body").html("");
        // Loop through database objects to present data to the screen.
        // Current Time
        var currTime = moment();
        $("#curr-time").append("<h3>" + moment().format('LLLL') + "</h3>"); // append here displays once per train!

        snapshot.forEach(function(trainSnapshot) {
            var trainKey = trainSnapshot.key;
            var trainData = trainSnapshot.val();

            if (DEBUG) {
                console.log("CURRENT TIME: " + currTime.format("hh:mm"));
                console.log("CURRENT TIME: " + currTime.format("LLLL"));
                console.log("CURRENT TIME: " + currTime);
            }

            // Difference between the times: Now - tFirstTimeConv
            var diffTimeSnap = currTime.diff(moment(trainData.tFirstTimeConvDB), "minutes");
            if (DEBUG) {
                console.log("+++++++++++++++++++++++++ EACH Start  +++++++++++++++++++++++++");
                console.log("trainKey = " + trainKey + " --- trainData = "+ trainData);
                console.log("trainSnapshot -> trainData.tNameDB = " , trainData.tNameDB ); 
                console.log("trainSnapshot -> trainData.tDestDB = " , trainData.tDestDB ); 
                console.log("trainSnapshot -> trainData.moment(tFirstTimeConvDB) = " , moment(trainData.tFirstTimeConvDB) ); 
                console.log("trainSnapshot -> trainData.tFreqDB = " , trainData.tFreqDB ); 
                console.log("DIFFERENCE IN TIME currTime.diff(moment(trainData.tFirstTimeConvDB), 'minutes') is: " , diffTimeSnap);
                console.log("++++++++++++++++++++++++ EACH End  +++++++++++++++++++++++++++");
            }

            // Time apart (remainder)
            var tFreqSnapshot = trainData.tFreqDB;
            var tRemainderSnap = diffTimeSnap % trainData.tFreqDB;
            if (DEBUG) {
                console.log("tFreqSnapshot = ", tFreqSnapshot);
                console.log("tRemainderSnap = " + tRemainderSnap);
            }

            // Minute Until Train
            var tMinAwaySnap = trainData.tFreqDB - tRemainderSnap;
            // Next Train
            var tNextArrivalSnap = moment().add(tMinAwaySnap, "minutes");
            if (DEBUG) {
                console.log("MINUTES TILL TRAIN Snap: " + tMinAwaySnap);
                console.log("ARRIVAL TIME Snap: " + moment(tNextArrivalSnap).format("hh:mm"));
            }

            // Where loop started previously...
            if (DEBUG) {
                console.log("trainKey = " + trainKey + " --- trainData = "+ trainData);
                console.log("trainData.tNameDB = " + trainData.tNameDB );
                console.log("trainData.tDestDB = " + trainData.tDestDB );
                console.log("trainData.tFirstTimeDB = " + trainData.tFirstTimeConvDB );
                console.log("trainData.tFreqDB = " + trainData.tFreqDB );
                // Calculations for next arrival and minutes away
                console.log("tMinAwaySnap = " + tMinAwaySnap);
                console.log("tNextArrivalSnap = " + moment(tNextArrivalSnap).format("hh:mm"));
            }
            
            // Change the HTML using jQuery to reflect the updated objeect values
            $("#train-sched-table-body").append("<tr>");
            $("#train-sched-table-body").append("<td>" + trainData.tNameDB + "</td>");
            $("#train-sched-table-body").append("<td>" + trainData.tDestDB + "</td>");
            $("#train-sched-table-body").append("<td>" + trainData.tFreqDB + "</td>");
            $("#train-sched-table-body").append("<td>" + moment(tNextArrivalSnap).format("hh:mm") + "</td>");
            $("#train-sched-table-body").append("<td>" + tMinAwaySnap + "</td>");
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
        var tFirstTimeConv = moment(tFirstTime, "HH:mm").subtract(1, "years").format();
        
        if (CURR_DEBUG) {
            console.log("We detected the button!!!")
            console.log("tFirstTimeConv = " + tFirstTimeConv);
            console.log("tName = " + tName);
            console.log("tDest = " + tDest);
            console.log("tFirstTime = " + tFirstTime);
            console.log("tFirstTimeConv = " + moment(tFirstTimeConv).format('LLLL'));
            console.log("tFreq = " + tFreq);
        };
            
          // Save new value to Firebase
        database.ref().push({ // Using PUSH creates child objects, vs SET overwrites data already there
            tNameDB: tName, // Posting this  object to the database in the cloud
            tDestDB: tDest, // Posting this  object to the database in the cloud
            tFirstTimeConvDB: tFirstTimeConv, // Posting this  object to the database in the cloud
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
    });
});