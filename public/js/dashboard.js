var user = sessionStorage.getItem("uid");

// Create Room Page Display
function yourRoom_up() {
  document.getElementById("div_body_yourRoom").style.display = "block";
  document.getElementById("div_body_analytics").style.display = "none";
  document.getElementById("div_body_joinedRoom").style.display = "none";

  document.getElementById("option_your_room").style.backgroundColor = "rgb(134, 190, 131)";
  document.getElementById("option_analytics").style.backgroundColor = "rgb(226, 226, 226)";
  document.getElementById("option_joined_room").style.backgroundColor = "rgb(226, 226, 226)";
}

// Analytics Room Page Display
function analytics_up() {
  document.getElementById("div_body_yourRoom").style.display = "none";
  document.getElementById("div_body_analytics").style.display = "block";
  document.getElementById("div_body_joinedRoom").style.display = "none";

  document.getElementById("option_your_room").style.backgroundColor = "rgb(226, 226, 226)";
  document.getElementById("option_analytics").style.backgroundColor = "rgb(134, 190, 131)";
  document.getElementById("option_joined_room").style.backgroundColor = "rgb(226, 226, 226)";
}

// Join Room Page Display
function joinedRoom_up() {
  document.getElementById("div_body_yourRoom").style.display = "none";
  document.getElementById("div_body_analytics").style.display = "none";
  document.getElementById("div_body_joinedRoom").style.display = "block";

  document.getElementById("option_your_room").style.backgroundColor = "rgb(226, 226, 226)";
  document.getElementById("option_analytics").style.backgroundColor = "rgb(226, 226, 226)";
  document.getElementById("option_joined_room").style.backgroundColor = "rgb(134, 190, 131)";
}

// Join Room Pop Up Functions
var join_room = $(".join_room_popup");
var span = document.getElementsByClassName("close")[0];

// Closes Join Room Popup
function func_close_join_room_pop() {
  join_room.css("display", "none");
}

// Brings up Join Room Popup
function func_join_room_pop() {
  join_room.css("display", "block");
}

// Populates the Create Page -------------------------------------------------------------------------------------------------------------

var config = {
  apiKey: "AIzaSyAZwdjR0wpNxj0yG0YLN1ueuMa6L-NLd2A",
  authDomain: "brainsprint-92cf3.firebaseapp.com",
  databaseURL: "https://brainsprint-92cf3.firebaseio.com",
  projectId: "brainsprint-92cf3",
  storageBucket: "brainsprint-92cf3.appspot.com",
  messagingSenderId: "117462095616"
};

firebase.initializeApp(config);
var db = firebase.database();
var list_of_rooms = [];
var list_of_joined = [];

//----------------------------------------------------------------------------------------------------------------------------------------
// loads the rooms and the data
$(document).ready(function() {
  var rooms_saved = db.ref("userList/" + user + "/rooms");
  rooms_saved.once("value").then(function(s) {
    var room_array = s.val();
    var room_length = Object.keys(room_array).length;

    for (i = 0; i < room_length; i++) {
      var room_number = Object.keys(room_array)[i];
      list_of_rooms[i] = room_number;
      func_has_started(rooms_saved, room_number);
    };
  });

  //add the joined room script

  var rooms_joined = db.ref("userList/" + user + "/joined");
  if (rooms_joined != null) {
    rooms_joined.once("value").then(function(s) {
      var joined_array = s.val();
      var joined_length = Object.keys(joined_array).length;

      for (i = 0; i < joined_length; i++) {
        var joined_number = Object.keys(joined_array)[i];
        list_of_joined[i] = joined_number;
        func_has_started_joined(rooms_joined, joined_number);
      };
    });
  } else {
    alert("nothing in joined");
  }

});

// Checks if the room status and calls the function to create and populate the rooms---------------------------------------------------------
function func_has_started(rooms_saved, room_number) {
  var has_started = rooms_saved.child(room_number).child("start");
  has_started.once("value").then(function(r) {
    var started = r.val();

    if (started) {
      $("#div_body_analytics").append(create_room(room_number, 0));
      func_populate(room_number);
    } else {
      $("#div_body_yourRoom").append(create_room(room_number, 2));
      func_populate(room_number);
    }
  });

}

// Checks if the room status and calls the function to create and populate the rooms---------------------------------------------------------
function func_has_started_joined(rooms_saved, room_number) {
  var has_started = rooms_saved.child(room_number).child("start");
  has_started.once("value").then(function(r) {
    var started = r.val();

    if (started) {
      //delete from joined room
    } else {
      $("#div_body_joinedRoom").append(create_room(room_number, 1));
      func_populate(room_number);
    }
  });
}

// Checks if roomCode exist and creates the elements-------------------------------------------------------------------------------------------
function room_validate() {
  var room_number = document.getElementById('input_text').value;
  const room = db.ref().child("roomList/" + room_number);

  event.preventDefault();

  //checks if room exists
  if (room_number.length == 0) {
    $("#pop_message").html("Please Enter a Room Number");
  } else {
    room.once('value', snapshot => {
      if (snapshot.exists()) {
        room.child("start").once("value").then(function(s) {
          var started = s.val();
          var users_room = func_is_users_room(room_number);
          if (users_room) {
            $("#pop_message").html("Code #" + room_number + " is your room");
          } else {
            if (started) {
              $("#pop_message").html("Code #" + room_number + " Already started");
            } else {
              func_join_room();
            }
          }
        });
      } else {
        $("#pop_message").html("Code #" + room_number + " does not exist");
      }
    });
  }
}

//All functions Dealing with starting a room from the dashboard
function start_popup(room_number) {
  $("#start_room_popup").css("display", "block");
  $("#start_room_popup_title").html($("#room_joined_" + room_number + " h3").html());
  db.ref().child("roomList/" + room_number + "/people").on("value", snapshot => {
    $("#start_room_popup_joined").html("Joined: " + Object.keys(snapshot.val()).length);
  });
  $("#start_room_popup_go").click(function(event) {
    func_start_room(room_number);
  });

}

//closes the popup
function func_close_start_room_pop() {
  $("#start_room_popup").css("display", "none");
}

//Starts the room and allows the user to join the room they have started
function func_start_room(room_number) {
  db.ref().child("roomList/" + room_number + "/start").set(true); //starts the activity in the roomList
  db.ref().child("userList/" + user + "/rooms/" + room_number + "/start").set(true); //starts the activity in the userList
  $("#start_room_popup_go").html("Join Room").unbind("click");
  $("#start_room_popup_go").click(function(event) {
    var myStorage = window.localStorage;

    var ref = db.ref("userList/" + user + "/name");
    ref.once("value")
      .then(function(s) {
        var name_thing = s.val();
        myStorage.setItem("name", name_thing);
      })
    myStorage.setItem("roomCode", room_number);
    window.location.href = "activity.html";
  });
}

function func_is_users_room(room_number) {
  for (i = 0; i < list_of_rooms.length; i++) {
    if (room_number == list_of_rooms[i]) {
      return true;
    }
  }
  return false;
}

// function that creates the divs for joined room------------------------------------------------------------------------------------------------
function func_join_room() {
  var room_number = document.getElementById('input_text').value;
  var list_length = list_of_joined.length++;
  list_of_joined[list_length] = room_number;
  $("#div_body_joinedRoom").append(create_room(room_number, 1));
  func_populate(room_number);
  func_close_join_room_pop();
  func_add_room_to_database(room_number);
}


// Function that createds the div elements---------------------------------------------------------------------------------------------------------
function create_room(room_number, status) {
  var div_room_joined = $("<div>").attr("id", "room_joined_" + room_number).addClass("room_joined");

  var div_detail = $("<div>").attr("id", "room_details_" + room_number).addClass("room_details");

  var h3_name = $("<h3>").html("Room Name").attr("id", "room_name_" + room_number).addClass("room_name");

  var p_topic = $("<p>").html("Topic: ").addClass("room_topic");
  var span_topic = $("<span>").attr("id", "room_topic_" + room_number).addClass("room_topic");

  var p_number = $("<p>").html("Room Number: ").addClass("room_number");
  var span_number = $("<span>").html(room_number).attr("id", "room_number_" + room_number).addClass("room_number");

  var div_options = $("<div>").attr("id", "room_options_" + room_number).addClass("action_options");
  var img_options = $("<img>").attr("src", "../images/options_icon.png").attr("id", "options_icon_" + room_number).attr("onclick", "func_delete_pop(" + room_number + ")").addClass("icon_button");

  var div_pop = $("<div>").attr("id", "del_pop_" + room_number).addClass("del_pop");
  var div_pop_cont = $("<div>").attr("id", "del_pop_cont_" + room_number).addClass("del_pop_cont");
  var p_pop_text = $("<p>").html("Delete").attr("id", "del_pop_text_" + room_number).attr("onclick", "func_delete(" + room_number + ")").addClass("del_text");

  // .css("display", "none");

  if (status == 0) { //If this room belongs in the anlytics section
    var button_options = $("<button>").html("Analytics").attr("id", "button_start_" + room_number).addClass("button_analytics").attr('value', room_number).attr("onclick",
      "set_storage(this); location.href='analytics.html'"); //change class name to something else
  } else if (status == 1) { //If this room belongs in the joined room section
    var button_options = $("<button>").html("Join").attr("id", "button_start_" + room_number).addClass("button_create_room_start").attr('value', room_number).attr("onclick",
      "set_storage(this);location.href='activity.html';"); //change class name to something else
  } else { //If this room belongs in the your roooms secotion
    var button_options = $("<button>").html("Start").attr("id", "button_start_" + room_number).addClass("button_create_room_start").attr('value', room_number).attr("onclick", "set_storage(this)").attr("onclick",
      "start_popup(" + room_number + ")"); //change class name to something else

  }
  $(div_pop_cont).append(p_pop_text);
  var pop = $(div_pop).append(div_pop_cont);

  $(p_topic).append(span_topic);
  $(p_number).append(span_number);

  var append_options = $(div_options).append(img_options, button_options, pop);
  var append_details = $(div_detail).append(h3_name, p_topic, p_number);

  return $(div_room_joined).append(append_details, append_options);
}


// Populates the created room with the datbase data--------------------------------------------------------------------------------------------------
function func_populate(room_number) {
  var room = db.ref().child("roomList").child(room_number);

  var room_name = document.getElementById('room_name_' + room_number);
  var room_topic = document.getElementById('room_topic_' + room_number);
  var room_num = document.getElementById('room_number_' + room_number);

  var db_room_name = room.child("roomName");
  var db_room_topic = room.child("prompts");

  db_room_topic.once("value")
    .then(function(s) {
      var num = s.val();

      for (i = 0; i < Object.keys(num).length; i++) {
        var topic = db_room_topic.child(i + "/text");
        topic.once("value")
          .then(function(s) {
            var topics = s.val() + '\xa0';
            db_room_topic.on('value', snap => room_topic.innerText += topics);
          });
      }
    });

  db_room_name.on('value', snap => room_name.innerText = snap.val());
  room.on('value', snap => room_num.innerText = room_number);
}


// Get the value of the owner--------------------------------------------------------------------------------------------------------------------------------

function set_storage(e) {
  var myStorage = window.localStorage;

  var ref = db.ref("userList/" + user + "/name");
  ref.once("value")
    .then(function(s) {
      var name_thing = s.val();
      myStorage.setItem("name", name_thing);
    })
  var code_value = document.getElementById(e.id).value + "";
  myStorage.setItem("roomCode", code_value);
}

// Adds the Joined room to the database
function func_add_room_to_database(room_number) {
  var room = db.ref("roomList").child(room_number);
  var user_room = db.ref("userList").child(user);

  room.once("value").then(function(c) {
    var room_info = c.val();
    var key = room_number;
    var add_room = {
      [key]: room_info
    }
    user_room.child("joined").update(add_room);
  });
}

// funtion needs to show and hide the delete div
function func_delete_pop(room_number) {
  var del = "#del_pop_" + room_number;

  $(del).toggle();
}

function func_delete(room_number) {
  var room_list = db.ref("roomList/" + room_number)
  var your_room = db.ref("userList/" + user + "/rooms").child(room_number);
  var joined_room = db.ref("userList/" + user + "/joined").child(room_number);
  $("#room_joined_" + room_number).remove();


  for (i = 0; i < list_of_rooms.length; i++) {
    if (room_number == list_of_rooms[i]) {
      your_room.remove();
      room_list.remove()

      //remove form list_of_rooms
      list_of_rooms.splice(i, i);
    } else if (room_number == list_of_joined[i]) {
      joined_room.remove();

      //remove form list_of_joined
      list_of_joined.splice(i, i);

    }

  }
};
