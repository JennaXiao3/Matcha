// MAIN DATABASE STUFF
// defer
var database = firebase.database();
var rootRef = database.ref(); //the root node

//importing from database addTimeslot function
//import {addTimeslot} from 'js/database.js';

var schedTable = document.getElementById("schedule");
var schedHead = document.getElementById("schedHead");
var schedBody = document.getElementById("schedBody");

var d = new Date();
var month = d.getMonth();
var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
var m = months[month];
var date = d.getDate();
var n = d.getDay();
var days = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT', 'SUN', 'MON', 'TUES', 'WED'];
var year = d.getFullYear() - 2000; //should i even define it here

var userID;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        userID = user.uid;
        //alert("signed in; userID is " + userID);
    } else {
        //alert("not signed in");
        window.location.href = "logIn.html";
    }
})

/*
function reformatTime(time) {
  console.log('memberList: '+memberList); //[[m1ID, m1COL],[m2ID, m2COL]]
  console.log('time: '+time); //hhddmmyy

  var hh = parseInt(time[0] + time[1]);
  var dd = parseInt(time[2] + time[3]);
  var mm = parseInt(time[4] + time[5]);
  var yy = parseInt(time[6] + time[7]);

  //change this for future
  if ((yy == year) && (mm == month) && (dd >= date && dd <= date + 5)) {

  }
}*/

for(var i = 0; i < 19; i++){
  var row = document.createElement("tr");
  row.id = ("rowId" + i.toString());

  for(var j = 0; j < 6; j++){
  // time slots
    if(j == 0 && i > 1 ){
        var timing = document.createElement("td");
        var timingText = document.createTextNode((i+5) + ":00 - " + (i+5) + ":50");
        timing.appendChild(timingText);
        timing.className = "timeSlot";

        row.appendChild(timing);
    } else {
        // first row with the days of the week
        if (i == 1 & j != 0) {
            var head = document.createElement("th");
            head.className = "days";
            var headText;

            if(j == 1){
              headText = document.createTextNode("TODAY");
              head.className = "today days";
            } else {
              headText = document.createTextNode(m + " " + (date+j-1));
            }
            head.appendChild(headText);

            head.id = ("head" + j.toString());

            row.appendChild(head);
        } else if (i == 0 & j!= 0){
            var week = document.createElement("th");
            week.className = "week";
            var weekText;

            weekText = document.createTextNode(days[n + j- 1]);
            week.appendChild(weekText);

            weekid = ("week" + j.toString());

            row.appendChild(week);
        } else if(j!=0){
        //All other columns (except time column)
            var cell = document.createElement("td");
            cell.className = "slotCell";

            if(j == 1){
              cell.className = "slotCell slotToday";
              cell.style.borderLeft = "6px solid #bdf29d";
              if(i == 18){ 
                cell.className = "slotLast slotToday slotCell";
              }
            }
            var hour = String(i+5);

            if (hour.length == 1) hour = "0" + hour; 
            cell.id = ("day" + j.toString() + "hr" + hour); //i = 1 is at 7am; eg. day1hr12
            
            //User icons
            var user1 = document.createElement("div");
            user1.id = "m1b" + cell.id;

            var user2 = document.createElement("div");
            user2.id = "m2b" + cell.id;
            console.log('m2b'+ cell.id);
            

              //Add user button
            var addUser = document.createElement("button");
            //addUser.className = "addUserBtn";

            addUser.id = 'b' + cell.id;

            // JUNYI
            addUser.onclick = function() {
              joinSession(this.id); //bday#hr##
              this.disabled = true;
              this.className = "delete";
              
              var m1 = 'm1' + this.id;
              var m2 = 'm2' + this.id;
              if (document.getElementById(m1).className == "noneUser") {
                document.getElementById(m1).style.opacity = "1";
                document.getElementById(m1).style.transform = "translateX(40px)";
                document.getElementById(m1).style.marginBottom = "20px";
              } else if (document.getElementById(m2).className == "noneUser") {
                document.getElementById(m2).style.opacity = "1";
              }
            };
            cell.appendChild(user1);
            cell.appendChild(user2);
            
            cell.appendChild(addUser);
            row.appendChild(cell);
        } else {
            //empty cells top left
            var cell = document.createElement("td");
            cell.className="slotEmpty";

            if (i == 1) {
              cell.className = "slotEmpty beforeTime";
            }
            row.appendChild(cell);
        }
      }
    }
  if(i == 0 || i == 1){
    schedHead.appendChild(row);
  } else {
    schedBody.appendChild(row);
  }
}
