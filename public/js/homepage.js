    // Join Room Pop Up Functions
    var join_room = $(".join_room_popup");
    var span = document.getElementsByClassName("close")[0];

    // Closes Join Room Popup
    function close_pop() {
      join_room.css("display", "none");
      $(".join_room_popup_content").css("height","10em");
      $("#pop_message").html("");
    }

    // Brings up Join Room Popup
    function join_room_pop() {
      join_room.css("display", "block");
    }

    // Send the user to a room with their room code and name
    myStorage = window.localStorage;

    function send_activity() {
      const room = database.ref().child("roomList/" + $("#input_number").val());

      //checks if room exists
      room.once('value', snapshot => {
        if (snapshot.exists() && $("#input_number").val() != "") {
          room.child("start").once('value', snapshot => {
            if(!snapshot.val()) {
              name_validate(room);
            }
            else {
              $(".join_room_popup_content").css("height","14em");
              $("#pop_message").html("Sorry, that room has already be started.");
            }
          });
        } else {
          $(".join_room_popup_content").css("height","14em");
          $("#pop_message").html("Sorry, we didn't find a room with that number.");
        }
      });
    };

    //checks if the username is unique, if it is, connect them to that activity
    function name_validate(roomParam) {
      roomParam.child("people/" + $("#input_name").val()).once('value', snapshot => {
        if (!snapshot.exists()) {
          let name = $("#input_name").val();
          roomParam.child("people/" + name).set(true); //adds username to the database, within the room they are joining
          myStorage.setItem("name", name);
          myStorage.setItem("roomCode", $("#input_number").val());
          window.location.href = "activity.html";
          // a comment
        } else {
          $(".join_room_popup_content").css("height","14em");
          $("#pop_message").html("Sorry, that name is taken.");
        }
      });
    }
