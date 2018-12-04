if (sessionStorage.getItem("name") != null) {
  var userName = sessionStorage.getItem("name")
} else {
  var userName = window.localStorage.getItem("name");
}
var duration;

// Closes Join Room Popup
function func_close_wait_pop() {
  $("div.wait_popup").css("display", "none");
}

// Brings up Join Room Popup
function func_wait_pop() {
  $("div.wait_popup").css("display", "block");
}

function finish_pop() {
  $("div.wait_popup").css("display", "block");
  $("#wait_home").css("display", "block");
  $("div.wait_popup_content").css("height", "18em");
  $("#wait_name").html("Goodbye, " + userName);
  $("#wait_msg").html("The activity has now finished. Thanks for brainstorming with BrainSprint!");

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------
  $("#wait_home").click(function(event) {
    if (sessionStorage.getItem("uid") != null) {
      window.location.href = "dashboard.html";

    } else {
      window.location.href = "homepage.html";
    }
  });
}

function new_prompt_pop(durationCurrent, durationTotal) {
  let duration = Math.abs(durationCurrent - durationTotal);
  $("div.new_popup").css("display", "block");
  $("#new_prompt_timer").html("Starting in: " + duration + "...");
}


  $(document).ready(function() {

    $("#wait_name").html("Welcome, " + userName);
    var roomCode = window.localStorage.getItem("roomCode"); //What room are we in?
    $("#wait_code").html("#" + roomCode);

    var room = database.ref("roomList/" + roomCode);

    room.child("roomName").once('value', snapshot => {
            $("title").html(snapshot.val() + " - BrainSprint Activity");
            $("#wait_title").html(snapshot.val());
          });



    func_wait_pop();
    room.child("start").on('value', snapshot => {
      if(snapshot.val()) {
        populate_prompts(room);
      }
    });



    var responseNum = 0;
    var totalText = {};
    var analyticsUpdate = {};
    $("#enter_button").click(function(event){
      var submission = $("#submit_text").val()
      if(!submission == "" || !("#submit_text").val() == "Text goes here") {
        var newItem = $("<p>" + $("#submit_text").val() + "</p>").addClass("reply");
        $("#div_submit_display").prepend(newItem).focus();
        $("#submit_text").val("Text goes here");
        //Send
        var reply = {};
        reply[responseNum] = {
          text: submission,
          votes: 0
        };


        database.ref().child('roomList/' + roomCode + '/replies/' + $('#pagename').html() + '/' + userName).update(reply);
        responseNum++;


        if (totalText[$('#pagename').html()] == null) {
          totalText[$('#pagename').html()] = "";
        }
        totalText[$('#pagename').html()] += submission + " ";

        var name = {};
        name[userName] = {
          text: totalText[$('#pagename').html()]
        }

        analyticsUpdate = name;
        var promise = database.ref().child('roomList/' + roomCode + '/analytics/prompts/' + $('#pagename').html()).update(analyticsUpdate);
        promise.then(function() {
          database.ref().child('roomList/' + roomCode + '/analytics/prompts/' + $('#pagename').html() + '/textCollection').once('value', snapshot => {
            if (snapshot.val() == null) {
              var textCollectionUpdate = {
              textCollection: submission + " "
              };
            database.ref().child('roomList/' + roomCode + '/analytics/prompts/' + $('#pagename').html()).update(textCollectionUpdate);
            } else {
            var textCollectionUpdate = {
              textCollection: snapshot.val() + submission  + " "
            };
             database.ref().child('roomList/' + roomCode + '/analytics/prompts/' + $('#pagename').html()).update(textCollectionUpdate);
            }
          });    
        });
      }
      else {
      }
    });

    $("#submit_text").click(function(event){
      $("#submit_text").val("");
    });
  });

  //Returns an object that contains all prompts, with text and duration
  function populate_prompts (roomParam) {
    func_close_wait_pop();
    roomParam.child("prompts").once('value', snapshot => {
      var promptsList = snapshot.val();
      var index = 0;
      var duration = promptsList[index]["duration"] + 5;
      var grace = false;

      $("#timer").html(duration);
      $("#pagename").html(promptsList[index]["text"]);
      $("#new_prompt_text").html('"' + promptsList[index]["text"] + '"');

      var time = setInterval(function() {
        if(duration <= 0 && index < promptsList.length) { //If a prompt has finished
          index++;
          if (index == promptsList.length){ //If there are now more prompts
            $("#timer").html(0);
            finish_pop();
            $("#div_input").css("display", "none");

          } else { //else start the next prompt
            $("#pagename").html(promptsList[index]["text"]);
            $("#new_prompt_text").html('"' + promptsList[index]["text"] + '"');
            duration = promptsList[index]["duration"] + 5; //give a 5 second grace period
            $("#timer").html(0)
            $(".reply").toggle();
          }
        } else if (index == promptsList.length) {
              //alert("time's up!")
        } else {
          if (duration > promptsList[index]["duration"]) { //checks if we are in grace period
            new_prompt_pop(duration, promptsList[index]["duration"]);
          } else {
            $("#timer").html(duration);
            $("div.new_popup").css("display", "none");
          }

          duration--;
          }
        }, 1000);

      });
  }
