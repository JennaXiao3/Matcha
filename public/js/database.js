
//declare variables
var userID;
var arrColours = ['#e73535','#ff9900','#fad422','#53c400','#40e0b8','#1885ff','#4d32da','#a742c0','#e83290','#815129'];

//Get user ID
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        //user is signed in
        userID = user.uid;
    } else {
        //not signed in
    }
})
/*
firebase.database().ref('allGroups').set({
    temp: "poo"
});
*/
var allGroupIds = [];

//read from database allgroupids
database.ref('allGroups').on('value', (allGroupsData) => {
    allGroupIds = [];
    allGroupsData.forEach(function(groupIdItem) {
        //alert(groupIdItem.val());
        allGroupIds.push(groupIdItem.val());
    })
    //alert("allGroupIds is "+allGroupIds);
})

//create group ID
function newGroupId() {
    let randomId = '';
    let characters = 'abcdefghijklmnopqrstuvwxyz';

    for(let i = 0; i < 6; i++) {
        randomId += characters[(Math.floor(Math.random() * characters.length))];
    }

    return randomId;
}


//for the create group button
 // maybe delete newGroupId here

function createNewGroup() {
    //alert('check a');
    var trueId = newGroupId();

    function checkIfUniqueId() {
        if (allGroupIds.includes(trueId)) {
            trueId = newGroupId();
            checkIfUniqueId();
        }
    }
    checkIfUniqueId();

    /*
    var validate = (currentValue) => {
        if (currentValue === trueId) return true;
        else return false;
    }
    //var validate = (currentValue) => currentValue === trueId;

    alert('lalalala');

    while (allGroupIds.every(validate)) {
        trueId = newGroupId();
    }
    */
    //alert('check b');
    database.ref('allGroups').push().set(trueId);
    //alert('sandwich');
    database.ref('profiles/'+ userID + '/groupID').set(trueId);
    //alert('elastic');


    //set members node with colour
    database.ref('groups/' + trueId).set('');
    database.ref('groups/' + trueId + '/members/' + userID).set(arrColours[0]);

    //set schedule node
    database.ref('groups/' + trueId + '/schedule').set('');

    //redirect
    window.location.href = "schedule.html";  
}


//for the join group button
function joinAnExistingGroup() {
    //associated to ID of field of entry of group code 'join'
    let trueId = document.getElementById('joinGroup').value;
    let poo = 0;
    for (let i = 0; i<allGroupIds.length; i++) {
        if(allGroupIds[i] === trueId) {
            poo = 1;
            break;
        }
    }
    
    if(poo === 1) {
        let availableColours = arrColours;
        database.ref('groups/'+trueId+'/members').once('value').then(function(snapshot) {
            snapshot.forEach(function(members) {
                availableColours.splice(availableColours.indexOf(members.val()),1);
            })
            let profColour = availableColours[Math.floor(Math.random()*availableColours.length)]
            database.ref('profiles/'+ userID + '/groupID').set(trueId);
            database.ref('groups/'+trueId+'/members/'+userID).set(profColour);
            window.location.href = 'schedule.html';
        });
        /*
        database.ref('profiles/'+ userID + '/groupID').set(trueId);
        get number child nodes
        database.ref('groups/'+trueId+'/members').once('value').then(function(snapshot) {
            let colourIndex = snapshot.numChildren();
            let profColour = arrColours[colourIndex];

            //enter group node
            database.ref('groups/' + trueId + '/members/'+userID).set(profColour);

            //redirect
            window.location.href = "schedule.html";
        });*/
    } else {
        alert("enter a valid room code");
    }
}

//leave group button
function leaveGroup() {
    let groupIden;
    //get group ID then delete node --> to be revised (if nec do in 2 steps)
    database.ref('profiles/'+ userID + '/groupID').once('value').then(function(snapshot){
        groupIden = snapshot.val();
        
        //deleting group from user profile
        database.ref('profiles/'+ userID).update({groupID: null});
        
        //deleting member from group
        database.ref('groups/'+groupIden+'/members').once('value').then(function(snapshot) {
            if (snapshot.numChildren() < 2) {
                database.ref('groups/'+groupIden).set(null);
                window.location.href = 'groups.html';
            } else {
                database.ref('groups/'+groupIden+'/members/'+userID).set(null);
                
                //removing user from all timeslots
                database.ref('groups/'+groupIden+'/schedule').once('value').then(function(scheduleData) {
                    scheduleData.forEach(function(timeslot) {
                        let timeslotKey = timeslot.key;
                        timeslot.forEach(function(member) {
                            if (member.val() == userID) {
                                database.ref('groups/'+groupIden+'schedule/'+timeslotKey+'/'+member.key).set(null);
                            }
                        });
                    });
                    window.location.href = 'groups.html';
                });
            }
        });
        
        /*
        //making sure gone from all timeslots too listeners
        //let keys = database.ref('groups/' + groupIden + '/schedule').equalTo(userID);
        console.log(database.ref('groups/' + groupIden + '/schedule').equalTo(userID));
        
        database.ref('groups/' + groupIden + '/schedule').equalTo(userID).key.update(null);
        */
         
        
        
        /*then(function(scheduleData) {
            scheduleData.forEach(function(timeslot) {
                console.log('step 3');
                //let key = timeslot.key;
                let query = timeslot.orderByValue().equalTo(userID).once('value').then(function(snapshot) {
                    snapshot.forEach(function(query) {
                        query.remove();
                    });
                });
                
            });

        console.log('success');
        });*/

        //if last member (delete from allGroupsIds)
    });
}


    