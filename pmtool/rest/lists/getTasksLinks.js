/*

The response is expected to be a JSON in the following format:

{
  data:[
     {
        id: 1, 
        text: "Project #1", 
        start_date: "01-04-2013", 
        duration:18,
        type: "project" | "task" | "milestone",
        parent: id | root_id,
        source: [id, ...],
        target: [id, ...],
        level: 0..n,
        progress: 0.0 ... 1.0,
        open: true | false,
        //Custom fields are passed as strgings
        holder: "user name",
        priority: "Low" | "Normal" | "High"
        
    },
    ...
  ],
  links:[
    {
        id:1, 
        source:task_id, 
        target:task_id, 
        type:"0" | "1" | "2" | "3"
    },
    ...
  ]
}

*/

function (head, req) {
    // specify that we're providing a JSON response
    provides('json', function() {
        // create an array for our result set
        var results = {};
        results.data = [];
        results.links = [];

        while (row = getRow()) {
            if (row.value.doctype == "task") results.data.push(row.value);
            if (row.value.doctype == "link") results.links.push(row.value);
        }

        // make sure to stringify the results :)
        send(JSON.stringify(results));
    });
}