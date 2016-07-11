/*
 * Link create, update, delete
 
  
 POST   -> CREATE
 PUT    -> UPDATE
 DELETE -> DELETE
 
 The response may be
 {"type":"updated", "sid":15, "tid":15}
 {"action":"error", ...}
 {"status":"ok"}
 {"tid":121}

 type: "updated" | "inserted" | "deleted"

 "invalid"

 action: "error"
 
 */

function(doc, req){
   
    var payload = req.form;
    
    if (req.method == "DELETE"){
        if(doc){
            doc["_deleted"] = true;
            if(typeof doc["id"] === 'undefined') doc["id"] = doc["_id"];
            
            return [doc, JSON.stringify({"type":"deleted", "tid":doc["id"]})];
        }
        return [null, JSON.stringify({"action":"error","msg":"DELETE without doc!"})]
    };    

    //Crate new document. doc is expected to be null
    if(req.method == "POST"){
        
        if (!doc){
            var newdoc = {};
            newdoc = payload;
            newdoc["id"] = req.uuid;
            newdoc["_id"] = req.uuid;
            //newdoc["_rev"] = "";
            newdoc["doctype"] = "link";
            // create new document
            return [newdoc, JSON.stringify({"type":"inserted", "tid":req["uuid"]})]
        }

        return [null, JSON.stringify({"action":"error","msg":"POST with doc --- use PUT instead!"})]
        
    };    
    
    
    //Update existing document. doc is expected to be non-null
    if(req.method == "PUT"){
        if(doc){
            doc = payload;
            if(typeof doc["id"] === 'undefined') doc["id"] = doc["_id"];
            if(typeof doc["doctype"] === 'undefined') doc["doctype"] = "link";

            return [doc, JSON.stringify({"type":"updated", "tid":doc["id"]})];
        }
        return [null, JSON.stringify({"action":"error","msg":"PUT without doc!"})]
    };    
    
    //Something else was requested. Nice fail, do not change anything in the database.
    return [null, JSON.stringify({"action":"error","msg":"Unknown command! Please contact developers for help."})];    
    
}