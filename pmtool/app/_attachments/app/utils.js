//Global variables
var myLayout, myGantt;


var DEBUG_ENABLED = true;

function dbgLog(message){
    if(DEBUG_ENABLED) console.log(message);
}


//Data Processor associated with Gantt chart
/* 
The URL will be constructed for REST pattern as follows:
Task operations:
CREATE POST   URL/task
UPDATE PUT    URL/task/id
DELETE DELETE URL/task/id

Link operations:
CREATE POST   URL/link
UPDATE PUT    URL/task/id
DELETE DELETE URL/task/id
*/
var dp = new gantt.dataProcessor("../rest/_update/");


dp.attachEvent("onAfterUpdate", function(id, action, tid, response){
    
    dbgLog(id);
    dbgLog(action);
    dbgLog(tid);
    dbgLog(response);
    
    if(action == 'inserted' || action == 'updated'){
        dhx4.ajax.query({
            method:"HEAD",
            url:"../../"+tid,
            async:true,
            callback:function(data){
                //set _rev for the task
                var rev = data.xmlDoc.getResponseHeader("ETag");
                var task = myGantt.getTask(tid);//->{id:10,text:"Task #10",start_date:"02-09-2013",...}
                task._rev = rev.slice(1, rev.length - 1); 
                task._id = tid;
                //myGantt.updateTask(tid); 
                myGantt.refreshData();
            }
        });    
    }
    
})

/*
dp.defineAction("error",function(response){
    dbgLog(response);
    return true;
})
*/