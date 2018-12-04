$(document).ready(function() {
  var uid = sessionStorage.getItem('uid')

  var myStorage = window.localStorage;
  var roomCode = myStorage.getItem("roomCode")


/**---------Updates the total textCollection in database to allow analytics to pull data easily.---------**/
  var personal = {};
  var personalPrompts = {};
  var firstRef = database.ref().child('/roomList/' + roomCode + '/replies/');
  firstRef.once('value', snapshot => {
    var totalText = "";
    snapshot.forEach(function(prompt) {
      var promptKey = prompt.key;
      var promptData = prompt.val();
      personalPrompts[promptKey] = "";
      var secondRef = firstRef.child(promptKey + '/');
      secondRef.once('value', promptShot => {
          /**Name Tree**/
          promptShot.forEach(function(name){
          var nameKey = name.key;
          var nameData = name.val();
          var thirdRef = secondRef.child(nameKey + '/');
          thirdRef.once('value', nameShot => {
            /**Response tree **/
            nameShot.forEach(function(response) {
              var responseKey = response.key;
              var responseData = response.val();

              var fourthRef = thirdRef.child(responseKey + '/');
              fourthRef.once('value', textShot => {
                  totalText += textShot.child('text').val() + " ";

                  var textCollection = {
                    textCollection: totalText
                  };


                  /**Updates the total text collection.**/
                  database.ref().child('/roomList/' + roomCode + '/analytics/').update(textCollection);



                });
            });
          });
        });
      });
    });
  });
  populate_prompts();
  countWords();
 });

//  function organizeInformation() {

//  }
/**populates the drop-down menu for prompts**/
function populate_prompts() {
  var myStorage = window.localStorage;
  var roomCode = myStorage.getItem('roomCode');
  var promptNames = [];
  var addPrompt;
  let i = 1;
  var firstRef = database.ref().child('/roomList/' + roomCode + '/prompts/');
  firstRef.once('value', numShot => {
    numShot.forEach(function(prompt) {
      var promptKey = prompt.key
      var secondRef = firstRef.child(promptKey + '/text/').once('value', promptShot => {
        addPrompt = $('<option>').attr('value', promptShot.val()).html(promptShot.val());
        $('#select_prompt').append(addPrompt);
      });
    });
  });
}

/**Separates the textCollection into an array and counts words.**/
function countWords() {
  var myStorage = window.localStorage;
  var textArray;
  var roomCode = myStorage.getItem('roomCode');
  var newTextArray = {};
  database.ref().child('/roomList/' + roomCode + '/analytics/').once('value', snapshot => {
    var string = snapshot.val().textCollection;
    textArray = string.split(" ");

    for (let i = 0; i < textArray.length; i++) {
        if (newTextArray[textArray[i]] == null) {
          newTextArray[textArray[i]] = 1;
        } else {
          newTextArray[textArray[i]]++;
        }
    } 

    var toSort = [];
    for (var word in newTextArray) {
      toSort.push([word, newTextArray[word]])
    }
    toSort.sort(function(a, b) {
      return b[1] - a[1];
    });
      
    var sortedArray = {};
    for (let i = 0; i < toSort.length; i++) {
      sortedArray[toSort[i][0]] = toSort[i][1];          
    }
    populate_most_common_words(toSort);
    populate_responses();
    });
  }
/** Populate left side of most common words analytic **/
function populate_most_common_words(array) {
  for (let i = 0; i < 10; i++) {
    let word_div = $('<div>').attr('class', 'word_div');
    let word_button = $('<button>').attr('class', 'word_button').html('<span class=\'button_text\'>' + array[i][0] + '</span>');
    let word_count = $('<button>').attr('class', 'word_count').html('<span class=\'button_text\'>' + array[i][1] + '</span>');
    $(word_div).append(word_button, word_count);
    $('#div_common_content').append(word_div);
  }
}
/** Populates each user responses on the right side. **/
function populate_responses() {

  var myStorage = window.localStorage;
  var roomCode = myStorage.getItem('roomCode');
  database.ref().child('roomList/' + roomCode + '/analytics/prompts/').once('value', snapshot => {
    var promptObj = snapshot.val();
    var promptNames = Object.keys(promptObj);
    var userNames = {};
    for (let i = 0; i < promptNames.length; i++) {
      userNames[i] = Object.keys(promptObj[promptNames[i]]);
    }
    var userSubmission = {};
    for (let i = 0; i < promptNames.length; i++) {
      userSubmission[promptNames[i]] = {};
      for (let j = 0; j < userNames[i].length - 1; j++) {
        userSubmission[promptNames[i]][userNames[i][j]] = promptObj[promptNames[i]][userNames[i][j]]['text'];
      }
    }
    
    for (let i = 0; i < promptNames.length; i++) {
      var response_div = $('<div>').attr('class', 'response_div');
      var name_button_div = $('<div>').attr('class', 'name_button_div');
      var prompt_button = $('<div>').attr('class', 'prompt_button').html(promptNames[i]);        
      $('#div_response_content').append(response_div);
      $(response_div).append(prompt_button);
      $(response_div).after(name_button_div);
      for (let j = 0; j < userNames[i].length - 1; j++) {
        var name_button = $('<button>').attr('class', 'name_button').html(userNames[i][j]);
        $(name_button_div).append(name_button);
        var userSubmittedResponse = $('<p>').attr('class', 'user_response').html(promptObj[promptNames[i]][userNames[i][j]]['text']);
        $(name_button_div).append(userSubmittedResponse);
      }
    }
  });
}