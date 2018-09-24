$(document).ready(function(){

    // VARS
    var DEBUG = false;
    var CURR_DEBUG = true;
    var tName = "";
    var tDest = "";
    var tFirstTime = "";
    var tFreq  ; // In minutes
    var tNextArrival  ;
    var tMinAway ;

    var trainRowEntry;
    // Create a variable to reference the database
    var database = firebase.database();

    // At the initial load and on subsequent data value changes, get a snapshot of the current data. (I.E FIREBASE HERE)
    // This callback keeps the page updated when a value changes in firebase.
    database.ref().on("value", function(snapshot) {     // DATABASE LISTENER!!!
    // database.ref().on("child_added", function(snapshot) {  // Returns a different object so must do display code DIFFERENTLY    // DATABASE LISTENER!!!
    // database.ref.once('value', function(snapshot) {
    // We are now inside our .on function...

        // Console.log the "snapshot" value (a point-in-time representation of the database)
        // This "snapshot" allows the page to get the most current values in firebase.
        if (DEBUG) {
            console.log(snapshot.val());
        };




        // UPDATE the value of our object parameters to match the value in the database
        // ___________ = snapshot.val().______________________
        trainRowEntry = snapshot.val();

        // Console Log the value of the object
        if (CURR_DEBUG) {
            console.log(trainRowEntry);
        }

        // Do Calculations for these vars...
        var eEndDate = 0; // ADD moment.today(); // TBD
        tNextArrival = 0; // TBD
        var trainMonths ;

        // Clear out existing table, to allow for re-writing entire table without duplicating!
        $("#train-sched-table-body").html("");
        // Loop through database objects to present data to the screen.
        snapshot.forEach(function(trainSnapshot) {
            var trainKey = trainSnapshot.key;
            var trainData = trainSnapshot.val();
            console.log("trainKey =" + trainKey + "--- trainData = "+ trainData);
            console.log("trainData.tNameDB = " + trainData.tNameDB );
            console.log("trainData.tDestDB = " + trainData.tDestDB );
            console.log("trainData.tFirstTimeDB = " + trainData.tFirstTimeDB );
            console.log("trainData.tFreqDB = " + trainData.tFreqDB );
            // trainMonths = moment().diff(moment.unix(trainData.tFirstTimeDB, 'X'), 'months');
            trainMonths = moment().diff(moment(trainData.tFirstTimeDB), 'months'); // NaN
            console.log("trainMonths = " + trainMonths);
            tNextArrival = trainMonths * trainData.tFreqDB;
            console.log("tNextArrival = " + tNextArrival);
    // Change the HTML using jQuery to reflect the updated objeect values
            $("#train-sched-table-body").append("<tr>");
            $("#train-sched-table-body").append("<td>" + trainData.tNameDB + "</td>");
            $("#train-sched-table-body").append("<td>" + trainData.tDestDB + "</td>");
            $("#train-sched-table-body").append("<td>" + trainData.tFirstTimeDB + "</td>");
            $("#train-sched-table-body").append("<td>" + trainMonths + "</td>");
            $("#train-sched-table-body").append("<td>" + trainData.tFreqDB + "</td>");
            $("#train-sched-table-body").append("<td>" + tNextArrival + "</td>");
            $("#train-sched-table-body").append("</tr>");
            $("#length-of-time-display").append("<h3>" + moment(trainData.tFirstTimeDB, "MMDDYYYY").fromNow() + " </h3>"); 
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
        // event.preventDefault();
        tName = $("#train-name-input").val().trim();
        tDest = $("#train-dest-input").val().trim();
        tFirstTime = $("#train-first-input").val().trim();
        tFreq = $("#train-freq-input").val().trim();
        // tNextArrival = $("#e-total-wages").val().trim();

        if (CURR_DEBUG) {
            console.log("We detected the button!!!")
            console.log("tName = " + tName);
            console.log("tDest = " + tDest);
            console.log("tFirstTime = " + tFirstTime);
            console.log("tFreq = " + tFreq);
            // console.log("tNextArrival = " + tNextArrival);
        };
            
          // Save new value to Firebase
        database.ref().push({ // Using PUSH creates child objects, vs SET overwrites data already there
            tNameDB: tName, // Posting this  object to the database in the cloud
            tDestDB: tDest, // Posting this  object to the database in the cloud
            tFirstTimeDB: tFirstTime, // Posting this  object to the database in the cloud
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
var randomDate = moment(1/1/89);
var randomFormat = moment().format("MM/DD/YYYY");

});