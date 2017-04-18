
////////////////// INITIALIZE FIREBASE ////////////////////

var config = {
    apiKey: "AIzaSyAJS4YQWU5DmESeYueG1qH1NGkjv3DncEY",
    authDomain: "fir-click-counter-7cdb9.firebaseapp.com",
    databaseURL: "https://train-scheduler-96318.firebaseio.com/",
    storageBucket: "train-scheduler-96318"
};

firebase.initializeApp(config);

var database = firebase.database();

////////////////// INITIALIZE FIREBASE ////////////////////


////////////////// KEEP VARIABLES INSIDE AN OBJECT ////////////////////

var form = {
    name: function(){
        return $("#trainName").val();
    },

    destination: function(){
        return $("#trainDestination").val();
    },

    frequency: function(){
        return $("#trainFrequency").val();
    },

    firstTrain: function(){
        return $("#firstTrainTime").val(); //need another function
    },

    minutes: function(){
        return moment($("#firstTrainTime").val(),"HH:mm").diff(moment(),"minutes");
    },

    dateAdded: function(){
        return firebase.database.ServerValue.TIMESTAMP
    }
};

////////////////// KEEP VARIABLES INSIDE AN OBJECT ////////////////////


//////////// CLICKING ON THE SUBMIT BUTTON CREATES A NEW CHILD IN THE DATABASE ////////////

$("#submitBtn").on("click",function(event){

    event.preventDefault();

    database.ref().push({

        nameinpt:form.name(),
        destinationinpt: form.destination(),
        frequencyinpt: form.frequency(),
        first_train: form.firstTrain(),
        date_added:form.dateAdded()

    });

    $("#trainName").val("")
    $("#trainDestination").val("")
    $("#trainFrequency").val("")
    $("#firstTrainTime").val("");

});

//////////// CLICKING ON THE SUBMIT BUTTON CREATES A NEW CHILD IN THE DATABASE ////////////


//////////// EVERY TIME A CHILD IS ADDED TO THE DATABASE, THE TRAIN SCHEDULE IS UPDATED ////////////

database.ref().on("child_added",function(snapshot){

    var new_row = $("<tr>");
    var new_name = $("<td>");
    var new_destination = $("<td>");
    var new_nextTrain = $("<td>");
    var new_frequency = $("<td>");
    var new_minAway = $("<td>");

    ///////////// CALCULATING THE MINUTES AWAY AND TIME THE NEXT TRAIN WILL ARRIVE //////////////

    var tFrequency = snapshot.val().frequencyinpt;
    // Time is 3:30 AM
    var firstTime = snapshot.val().first_train;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    ///////////// CALCULATING THE MINUTES AWAY AND TIME THE NEXT TRAIN WILL ARRIVE //////////////

    new_name.text(snapshot.val().nameinpt);
    new_destination.text(snapshot.val().destinationinpt);
    new_nextTrain.text(moment(nextTrain).format("hh:mm a"));
    new_frequency.text(snapshot.val().frequencyinpt);
    new_minAway.text(tMinutesTillTrain);

    new_row.append(new_name);
    new_row.append(new_destination);
    new_row.append(new_frequency);
    new_row.append(new_nextTrain);
    new_row.append(new_minAway);

    $("table").append(new_row);

},function(errorObject){
    console.log("Errors handled: " + errorObject.code);
});

//////////// EVERY TIME A CHILD IS ADDED TO THE DATABASE, THE TRAIN SCHEDULE IS UPDATED ////////////
