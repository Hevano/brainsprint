/** var firebaseScript = $("<script>").attr("src", "https://www.gstatic.com/firebasejs/5.5.8/firebase.js");
$("head").prepend(firebaseScript); **/
var config = {
  apiKey: "AIzaSyAZwdjR0wpNxj0yG0YLN1ueuMa6L-NLd2A",
  authDomain: "brainsprint-92cf3.firebaseapp.com",
  databaseURL: "https://brainsprint-92cf3.firebaseio.com",
  projectId: "brainsprint-92cf3",
  storageBucket: "brainsprint-92cf3.appspot.com",
  messagingSenderId: "117462095616"
};
firebase.initializeApp(config);

var database = firebase.database();
