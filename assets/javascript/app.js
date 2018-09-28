$(document).ready(function(){

    // VARS
    var DEBUG = false;
    var CURR_DEBUG = true;

    var trainRowEntry;
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

        // UPDATE the value of our object parameters to match the value in the database
        trainRowEntry = snapshot.val();

        // Console log the value of the object
        if (CURR_DEBUG) {
            console.log("----------- Start trainRowEntry -----------");
            console.log(trainRowEntry);
            console.log("------------ End trainRowEntry ------------");
        }


        // Clear out existing table, to allow for re-writing entire table without duplicating!
        $("#train-sched-table-body").html("");
        // Loop through database objects to present data to the screen.
        snapshot.forEach(function(trainSnapshot) {
            var trainKey = trainSnapshot.key;
            var trainData = trainSnapshot.val();

            // Do Calculations for these vars...
            // TBD: ADD moment.today(); // TBD
            var tNextArrival = 0; // TBD
            // Current Time
            var currTime = moment();
            console.log("CURRENT TIME: " + currTime.format("hh:mm"));
            console.log("CURRENT TIME: " + currTime.format("LLLL"));
            console.log("CURRENT TIME: " + currTime);

            // Difference between the times: Now - tFirstTimeConv
            console.log("----------------------- [0] Start, NEEDS FOR LOOP ----------------------------");
            console.log("Object.values(trainRowEntry = " , Object.values(trainRowEntry) );
            console.log("Object.values(trainRowEntry) -> trainRowEntry[0].tNameDB = " , Object.values(trainRowEntry)[0].tNameDB ); 
            console.log("Object.values(trainRowEntry) -> trainRowEntry[0].tDestDB = " , Object.values(trainRowEntry)[0].tDestDB ); 
            console.log("Object.values(trainRowEntry) -> trainRowEntry[0].tFirstTimeConvDB = " , moment(Object.values(trainRowEntry)[0].tFirstTimeConvDB) ); 
            console.log("Object.values(trainRowEntry) -> trainRowEntry[0].tFreqDB = " , Object.values(trainRowEntry)[0].tFreqDB ); 
            var diffTime = currTime.diff(moment(Object.values(trainRowEntry)[0].tFirstTimeConvDB), "minutes");
            console.log("DIFFERENCE IN TIME currTime.diff(moment(Object.values(trainRowEntry)[0].tFirstTimeConvDB), 'minutes') is: " , diffTime);
            console.log("----------------------- [0] End, NEEDS FOR LOOP -----------------------------");

            console.log("+++++++++++++++++++++++++ EACH Start  +++++++++++++++++++++++++");
            console.log("trainKey = " + trainKey + " --- trainData = "+ trainData);
            console.log("trainSnapshot -> trainData.tNameDB = " , trainData.tNameDB ); 
            console.log("trainSnapshot -> trainData.tDestDB = " , trainData.tDestDB ); 
            console.log("trainSnapshot -> trainData.moment(tFirstTimeConvDB) = " , moment(trainData.tFirstTimeConvDB) ); 
            console.log("trainSnapshot -> trainData.tFreqDB = " , trainData.tFreqDB ); 
            var diffTimeSnap = currTime.diff(moment(trainData.tFirstTimeConvDB), "minutes");
            console.log("DIFFERENCE IN TIME currTime.diff(moment(trainData.tFirstTimeConvDB), 'minutes') is: " , diffTimeSnap);
            console.log("++++++++++++++++++++++++ EACH End  +++++++++++++++++++++++++++");

            // console.log("----------------------- EACH Start ---- ODD Array ------------------------");
            // console.log("Object.values(trainSnapshot = " , Object.values(trainSnapshot) );
            // console.log("Object.values(trainSnapshot) -> trainSnapshot.tNameDB = " , Object.values(trainSnapshot).tNameDB ); 
            // console.log("Object.values(trainSnapshot) -> trainSnapshot.tDestDB = " , Object.values(trainSnapshot).tDestDB ); 
            // console.log("Object.values(trainSnapshot) -> trainSnapshot.tFirstTimeConvDB = " , moment(Object.values(trainSnapshot).tFirstTimeConvDB) ); 
            // console.log("Object.values(trainSnapshot) -> trainSnapshot.tFreqDB = " , Object.values(trainSnapshot).tFreqDB ); 
            // var diffTimeSnap = currTime.diff(moment(Object.values(trainSnapshot).tFirstTimeConvDB), "minutes");
            // console.log("DIFFERENCE IN TIME currTime.diff(moment(Object.values(trainSnapshot).tFirstTimeConvDB), 'minutes') is: " , diffTimeSnap);
            // console.log("----------------------- EACH End ------ ODD Array -----------------------");


            // Time apart (remainder)
            var tFreqFromObj = Object.values(trainRowEntry)[0].tFreqDB;
            console.log("tFreqFromObj = ", tFreqFromObj);
            var tFreqSnapshot = trainData.tFreqDB;
            console.log("tFreqSnapshot = ", tFreqSnapshot);
            var tRemainder = diffTimeSnap % Object.values(trainRowEntry)[0].tFreqDB;
            console.log("tRemainder = " + tRemainder);
            var tRemainderSnap = diffTimeSnap % trainData.tFreqDB;
            console.log("tRemainderSnap = " + tRemainderSnap);

            // Minute Until Train
            var tMinAway = Object.values(trainRowEntry)[0].tFreqDB - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinAway);
            var tMinAwaySnap = trainData.tFreqDB - tRemainderSnap;
            console.log("MINUTES TILL TRAIN Snap: " + tMinAwaySnap);

            // Next Train
            var tNextArrival = moment().add(tMinAway, "minutes");
            console.log("ARRIVAL TIME: " + moment(tNextArrival).format("hh:mm"));
            var tNextArrivalSnap = moment().add(tMinAwaySnap, "minutes");
            console.log("ARRIVAL TIME Snap: " + moment(tNextArrivalSnap).format("hh:mm"));

            // Where loop started previously...
            console.log("trainKey = " + trainKey + " --- trainData = "+ trainData);
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
            tFirstTimeConvDB: tFirstTimeConv, // Posting this  object to the database in the cloud
            // tFirstTimeConvDB: myJSONtFirstTimeConv, // Posting this STRINGIFIED object to the database in the cloud
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
});