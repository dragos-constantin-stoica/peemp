var myApp = {
    
    init: function(){
        myLayout = new dhtmlXLayoutObject(document.body,"1C"); 
        //myLayout.setSkin("dhx_terrace");  
        myLayout.cells("a").setText("Dashboard");
            
        myGantt = Gantt.getGanttInstance();
        
        myGantt.config.scale_unit = "month";
        myGantt.config.date_scale = "%F, %Y";
        myGantt.config.scale_height = 50;

        myGantt.config.subscales = [
            {unit:"day", step:1, date:"%j, %D" }
        ];

        myGantt.templates.rightside_text = function(start, end, task){
            if(task.type == myGantt.config.types.milestone){
                return task.text;
            }
            return "";
        };
        myGantt.config.lightbox.sections = [
            {name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
            {name: "type", type: "typeselect", map_to: "type"},
            {name: "time", type: "duration", map_to: "auto"}
        ];
                
        myGantt.config.min_column_width = 50;
        
        var colHeader = '<div class="gantt_grid_head_cell gantt_grid_head_add" onclick="myGantt.createTask()"></div>',
            colContent = function(task){
			return ('<i class="fa gantt_button_grid gantt_grid_edit fa-pencil" onclick="myApp.clickGridButton(\''+task.id+'\', \'edit\')"></i>' +
                    '<i class="fa gantt_button_grid gantt_grid_add fa-plus" onclick="myApp.clickGridButton(\''+task.id+'\', \'add\')"></i>' +
                    '<i class="fa gantt_button_grid gantt_grid_delete fa-times" onclick="myApp.clickGridButton(\''+task.id+'\', \'delete\')"></i>');
            };
        
        myGantt.config.columns = [
            {name:"text", tree:true, width:'*', resize:true },
            {name:"start_date", align: "center", resize:true },
            {name:"duration", align: "center" },
            {
                name:"buttons",
                label:colHeader,
                width:75,
                template:colContent
            }
        ];
        
        myLayout.cells("a").attachGantt(null,null,myGantt);
        
        myGantt.load("../rest/_list/getTasksLinks/task_link",function(){
            dbgLog("Data has been successfully loaded");
        });
        
        dp.init(myGantt);
        dp.setTransactionMode("REST");
        
    },
    
    clickGridButton: function(id, action) {
        switch (action) {
            case "edit":
                myGantt.showLightbox(id);
                break;
            case "add":
                myGantt.createTask(null, id);
                break;
            case "delete":
                myGantt.confirm({
                    title: myGantt.locale.labels.confirm_deleting_title,
                    text: myGantt.locale.labels.confirm_deleting,
                    callback: function(res){
                        if(res)
                            myGantt.deleteTask(id);
                    }
                });
                break;
        }
    }    
    
};