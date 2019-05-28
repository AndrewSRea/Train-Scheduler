$(document).ready(function(){
    
    var firebaseConfig = {
        apiKey: "AIzaSyCAKPw7XuwFi05YH8-npRzZTfRga1YVYf8",
        authDomain: "train-scheduler-34ea9.firebaseapp.com",
        databaseURL: "https://train-scheduler-34ea9.firebaseio.com",
        projectId: "train-scheduler-34ea9",
        storageBucket: "train-scheduler-34ea9.appspot.com",
        messagingSenderId: "69329306369",
        appId: "1:69329306369:web:0018d7eae3f9da36"
    };
    
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
 
    setInterval(function(startTime) {
        $("#timer").html(moment().format('hh:mm a'))
    }, 1000);
  
    $("#add-train").on("click", function() {
        event.preventDefault();
    
        var train = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = $("#first-train").val().trim();
        var frequency = $("#frequency").val().trim();
    
        var trainInfo = { 
            formtrain: train,
            formdestination: destination,
            formfirsttrain: firstTrain,
            formfrequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };
        
        database.ref().push(trainInfo);
  
        console.log(trainInfo.formtrain);
        console.log(trainInfo.formdestination);
        console.log(trainInfo.formfirsttrain);
        console.log(trainInfo.formfrequency);
        console.log(trainInfo.dateAdded);
  
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");
  
    });
  
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {  
        var train = childSnapshot.val().formtrain;
        var destination = childSnapshot.val().formdestination;
        var firstTrain = childSnapshot.val().formfirsttrain;
        var frequency = childSnapshot.val().formfrequency;
  
        var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
        console.log(firstTrainConverted);
  
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm a"));
  
        $("#timer").text(currentTime.format("hh:mm a"));
  
        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
  
        var remainder = diffTime % frequency;
        console.log("Remainder: " + remainder);
  
        var minutesAway = frequency - remainder;
        console.log("MINUTES TILL TRAIN: " + minutesAway);
  
        var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
        console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm a"));
  
        $("#table > tbody").append("<tr><td>" + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
    
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

});