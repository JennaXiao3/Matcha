/*
-----READING DATABASE AND FORMATTING TIMETABLE------
-> .on('value' blah blah blah thingy)
    -> forEach timeslot under groups/groupID/schedule:
        -> get the timeslot (.key) and members (another forEach)
            -> get the colours of the members 

- retrieve groupID value from 'profiles' (for path)
*/
//retrieving userID
var userID, roomID;
var sessionDetails = [];
//retrieving groupID
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //alert("signed in; userID is " + userID);
        userID = user.uid;

        //retrieving groupID
        database.ref('profiles/' + userID + "/groupID").once('value').then(function(snapshot) {
            roomID = snapshot.val();
            console.log('roomID retrieved'); //first
            //code here runs after code outside .once()
            //displaying group ID on the schedule
            document.getElementById("gc").innerHTML = roomID.toUpperCase();
        });
        //code here runs before code in .once()
    } else {
        alert("not signed in");
    }
})

function twoDigits(input) {
    console.log("yes channge: " + input);
    if (input<10 && input>=0) {
        console.log("it changed!: 0" + String(input));
        return "0" + String(input);
    } else return input;
}

setTimeout(function() {

    console.log('success');//second
    /*/##############
    function nameFromUserId(id) {
        database.ref('profiles/'+id+'/name').once('value').then(function(snapshot) {
            return snapshot.val();
        });
    }*/

    //members list
    database.ref('groups/'+roomID+'/members').on('value', (membersData) => {
        document.getElementById('membersBox').innerHTML = '';
        membersData.forEach(function(memberInfo) {
            
            //member.key = uid
            //member.val() = colour
            //console.log(memberInfo.key + " " + memberInfo.val());
            var member = document.createElement("p");
            database.ref('profiles/'+memberInfo.key+'/name').once('value').then(function(snapshot) {
                var memberName = document.createTextNode(snapshot.val());
                member.appendChild(memberName);
                member.style.color = memberInfo.val();
                document.getElementById("membersBox").appendChild(member);
            });
        });
    });

    database.ref('groups/'+roomID+'/members').once('value').then(function(membersData) {
        database.ref('profiles/').once('value').then(function(profilesData) {
            let memberIdsList = [];
            let memberNamesList = [];
            let userColour = membersData.child(userID).val();
            membersData.forEach(function(memberInfoA) {
                memberIdsList.push(memberInfoA.key);
            });
            for (memberIdA of memberIdsList) {
                let memberNameA = profilesData.child(memberIdA+'/name').val()
                //console.log('member name: '+memberNameA);
                memberNamesList.push(memberNameA);
            }
            console.log('ids list '+memberIdsList);
            console.log('name list '+memberNamesList);

            //format database cells
            database.ref('groups/'+roomID+'/schedule').on('value', (scheduleData) => {

                var allBtn = [];
                //hopefully this works lol
                //7,1 
                for (var i = 7; i <= 23; i++) {
                    for (var j = 1; j <= 5; j++) {
                        var add = "";
                        if (i < 10) add = "0";
                        let btnId = 'bday' + j + 'hr' + add + i;
                        allBtn.push(btnId);
                        //console.log("i: " + i);
                        //console.log("j: " + j);

                        console.log('id is '+btnId);

                        var letter = memberNamesList[memberIdsList.indexOf(userID)].charAt(0);
                        
                        document.getElementById(btnId).className = "addUserBtn"; //not working
                        document.getElementById('m1' + btnId).className = "noneUser";
                        document.getElementById('m1' + btnId).innerHTML = letter;
                        document.getElementById('m1' + btnId).style.backgroundColor = userColour;
                    }
                } /*delete*/

                //allBtn[i] --> bday' + j + 'hr' + add + i --> id of button
                //i
                

                //allBtn[i].className = "addUserBtn"; //what the
                    
                scheduleData.forEach(function(timeslotX) {
                    var d = parseInt(timeslotX[2] + timeslotX[3]);
                    var h = parseInt(timeslotX[0] + timeslotX[1]);
                    var newDate = new Date();
                    var todayDate = newDate.getDate();
                    var relativeDayX = d - todayDate + 1; //1 = today
                    let timeslotXKey = 'bday'+relativeDayX+'hr'+h;
                    allBtn.splice(allBtn.indexOf(timeslotXKey),1);
                });

                for (var i = 0; i < allBtn.length; i++) {
                    var m1 = document.getElementById("m1" + allBtn[i]);
                    document.getElementById(allBtn[i]).className = "addUserBtn"; 
                    m1.className = "noneUser";
                    //m1.innerHTML = userID.
                    
                    
                    //adduser
                    /*document.getElementById(allBtn[i]).onclick = function() {

                        document.getElementById("member1").style.opacity = "1";
                        document.getElementById("member1").style.zIndex = "1";
                    };*/
                }
                console.log('ayayayay ' + i);
                
                scheduleData.forEach(function(timeslot) {
                    sessionDetails = [];
                    let time = timeslot.key; //session time — use to get id of cell
                    console.log('time is '+time);
                    var dd = parseInt(time[2] + time[3]);
                    var mm = parseInt(time[4] + time[5]);
                    var yy = parseInt(time[6] + time[7]);
                    var currentDate = new Date();
                    nowDate = currentDate.getDate();
                    nowMonth = currentDate.getMonth();
                    nowYear = currentDate.getFullYear();
                    //change this for future
                    if ((yy == (nowYear-2000)) && (mm == (nowMonth+1)) && (dd >= nowDate && dd <= nowDate + 4)) {
                        var hh = time[0] + time[1];
                        let memberIDs = []; //list of ids
                        let memberList = []; //2D array incl. colour
                        timeslot.forEach(function(member) {
                            memberIDs.push(member.val());
                        });
                        //memberList is array of member ids
                        //membersData = data from database
                        membersData.forEach(function(member) {
                            let memberInfo = [];
                            if (memberIDs.includes(member.key)) {
                                memberInfo.push(member.key);
                                memberInfo.push(member.val());
                                memberList.push(memberInfo);
                            }
                        });
                        //console.log('memberList: '+memberList); //[[m1ID, m1COL],[m2ID, m2COL]]
                        //console.log('time: '+time); //hhddmmyy

                        //FOR JENNA POOPOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                        var relativeDay = dd - nowDate + 1; //1 = today
                        console.log("hour: " + hh);
                        var timeslotId = 'day'+relativeDay+'hr'+ hh;
                        //console.log(timeslotId);
                        var cell = document.getElementById(timeslotId);
                        console.log(timeslotId);
                        
                        
                        //var index = allCells.indexOf(timeslotId); //initialized
                        //allCells.splice(index, 1);
                        //"day" + j.toString() + "hr" + hour

                        
                        //given time is within the next 5 days: 
                        //get element by id to identify the cell that the time (in this run of the loop) corresponds to
                            //eg. if time is today at 7, then get the element that contains the buttons/icons for today at 7
                        //format that cell accordingly

                        //? userID = id of current signed in user
                        //? function to get name from user ID: nameFromUserId(id)

                        //memberlist undefined ERRORR ERRORR (((((((((((())))))))))))
                        console.log('memberList: '+memberList);
                        var name1 = profilesData.child(memberList[0][0]+'/name').val();
                        var name1_letter = name1[0].toUpperCase();
                        var m1 = document.getElementById("m1b" + timeslotId);
                        console.log('first timeslotId '+timeslotId);

                        var letter = memberNamesList[memberIdsList.indexOf(userID)].charAt(0);
                        
                        var m2;
                        
                        if (memberList.length == 2) {
                            //two members
                            var name2 = profilesData.child(memberList[1][0]+'/name').val();
                            var name2_letter = name2[0].toUpperCase();
                            m2 = document.getElementById("m2b" + timeslotId);
                        }

                        if (memberList.length == 1) {
                            if (userID == memberList[0][0]) {
                                m1.className = "schedUnpairedUser";
                                document.getElementById('b' + timeslotId).className = "delete";
                            } else {
                                m1.className = "schedUnpaired";
                                m2 = document.getElementById("m2b" + timeslotId);
                                m2.className = "noneUser";
                                m2.innerHTML = letter;
                                m2.style.backgroundColor = userColour;
                                document.getElementById('b' + timeslotId).style.transform = "translateX(40px)";
                            }
                            m1.style.backgroundColor = memberList[0][1];
                            m1.innerHTML = name1_letter;
                            //lighten? ----
                        } else if (memberList.length == 2) {
                            document.getElementById('b' + timeslotId).className = "delete";
                            if (userID == memberList[0][0]) {
                                m1.className = "schedPairedUser";
                                m2.className = "schedPaired";
                            } else if (userID == memberList[1][0]) { 
                                m1.className = "schedPaired";
                                m2.className = "schedPairedUser";
                            } else {
                                m1.className = "schedPaired";
                                m2.className = "schedPaired";
                            }
                            m1.style.float = "left";
                 
                            m2.style.float = "right";

                            m1.style.backgroundColor = memberList[0][1];
                            m2.style.backgroundColor = memberList[1][1];
    
                            m1.innerHTML = name1_letter;
                            m2.innerHTML = name2_letter;
                            cell.style.backgroundColor = '#292d30';
                        } else {
                            console.log("error: invalid number of members");
                        }
                        console.log('while complete');
                    }
                });
                /*
                for (var a = 0; a < allCells.length; a++) {
                    document.getElementById('b' + allCells[a]).className = "addUserBtn";
                }
                console.log("Amount empty " + a);
                */
            });
        });
    });
}, 3000)





//if extra time: revise this for exceptions
//.ON TO READ DATABASE AND WRITE DATABASE
function joinSession(cellIdentity) {
    //get the current day number eg. sunday
    let tOday = new Date();
    let dAte = tOday.getDate();
    let mOnth = tOday.getMonth() + 1;
    let yEar = tOday.getFullYear() - 2000;

    //New: 'b' + cell.id; --> move index by one
    
    //get the day number and add
    let dayRel = parseInt(cellIdentity[4]);
    let scheduledDay = dAte + dayRel - 1;
    //get hour
    let hourN = parseInt(cellIdentity[7] + cellIdentity[8]);
    
    
    //concat
    let timeslotId = (`${twoDigits(hourN)}${twoDigits(scheduledDay)}${twoDigits(mOnth)}${yEar}`);
    database.ref('groups/' + roomID + '/schedule/' + timeslotId).push().set(userID);
}

//cell.id = ("day" + j + "hr" + hour); //i = 1 is at 7am; eg. bday01hr12



//displaying members






