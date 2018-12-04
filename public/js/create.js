          /**Resets the form.**/
          function resetFields() {
            var form = document.getElementById("create_room_form").reset();
          }

          /**Adds a new input area for adding a new prompt.**/
          function createPrompt() {
            var newTopic = document.getElementById("topic_fieldset");
            var clone = newTopic.cloneNode(true);
            $(clone).css("margin-bottom", "2em");
            var cloneC = clone.children;
            cloneC[0].value = "";
            cloneC[3].value = 30;
            $(cloneC[6]).css("visibility", "visible");
            $(cloneC[7]).css("visibility", "visible");
            document.getElementById("create_prompt_button").before(clone);

          }

          /**Deletes the topic which this button was clicked from. **/
          function deletePrompt(event) {
            var trigger = event.target;
            trigger.parentNode.remove();
          }

          /**Prevents the user from using any odd characters in the title of the room**/
          $('#room_name').on('change keyup keydown',function(){
                  var txt = $(this).val();
                  $(this).val(/[A-Za-z]/.test(txt) ? txt : txt.substring(0,txt.length-1) );
              });


          /**Processes the information in the form and saves it in database.**/

          $('#create_button').click(function(event) {
            event.preventDefault();
            var roomName = document.getElementById("room_name");
            var topicNames = document.getElementsByClassName("topic_name");
            var topicTimes = document.getElementsByClassName("time_select");
            var prompts = {};
            for (let i = 0; i < topicNames.length; i++) {
              prompts[i] = {
                text: topicNames[i].value,
                duration: parseInt(topicTimes[i].value, 10)
              };
            }

            /** Grabs the user id and room information and assigns the information
            *   to the correct user id.
            **/

            var uid = sessionStorage.getItem("uid");
            var postData = {
              roomName: roomName.value,
              prompts: prompts,
              owner: uid,
              start: false
            };

            /**Updates room to roomList and also populates the room under userID.**/
            var roomCode;
            var numUpdate;
            database.ref().child('numRooms').once('value', snapshot => {
              roomCode = snapshot.val() + 1;
              numUpdate = {
                numRooms: roomCode
              }

              database.ref().update(numUpdate);

              var roomInfo = {};
              roomInfo[roomCode] = postData;


              var dbUpdate = database.ref().child('roomList').update(roomInfo);

              var updates = {};
              updates['/userList/' + uid + '/rooms/' + roomCode] = postData;
              database.ref().update(updates);


              window.location = 'dashboard.html'

            });
          });
