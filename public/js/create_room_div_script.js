// // Dashboard - Joined Room Script
//
// // Creates the Div with populated elements
// function func_join_room(){
//   // var room_number = db.ref().child("userList").child("userId").child("name"); //function to pull from database;
//   var room_number = document.getElementsByName("textbox_room_number").value;
//
//   var div_room_joined = $("<div>").attr("id", "room_joined_" + room_number).addClass("room_joined");
//
//   var div_detail = $("<div>").attr("id", "room_details_" + room_number).addClass("room_details");
//   var h3_name = $("<h3>").html("name").attr("id", "room_name_" + room_number).addClass("room_name");
//   var p_topic = $("<p>").html("topic").attr("id", "room_topic_" + room_number).addClass("room_topic");
//   var p_number = $("<p>").html(room_number).attr("id", "room_number_" + room_number).addClass("room_number");
//
//   var div_options =  $("<div>").attr("id", "room_options_" + room_number).addClass("action_options");
//   var img_options = $("<img>").attr("src", "../images/options_icon.png").attr("id", "options_icon_" + room_number).addClass("icon_button");
//   var button_options = $("<button>").html("start").attr("id", "button_start_" + room_number).addClass("button_create_room_start"); //change class name to something else
//
//   var append_options = $(div_options).append(img_options, button_options);
//   var append_details= $(div_detail).append(h3_name, p_topic, p_number);
//   $("#div_body_joinedRoom").append(append_details, append_options);
//
// }
//
//
// // Create Room Page - Create Button
//
// function func_create_room() {
//   var room_number = db.ref().child("userList").child("userId").child("name"); //function to pull from database;
//
//   var div_detail = $("<div>").attr("id", "room_details_" + room_number).addClass("room_details");
//   var h3_name = $("<h3>").attr("id", "room_name_" + room_number).addClass("room_name");
//   var p_topic = $("<p>").attr("id", "room_topic_" + room_number).addClass("room_topic");
//   var p_number = $("<p>").attr("id", "room_number_" + room_number).addClass("room_number");
//
//   var joined_room_details = $(div_details).append(h3_name, p_topic, p_number);
//   $("#div_body_yourRoom").append(joined_room_details);
//
// }
