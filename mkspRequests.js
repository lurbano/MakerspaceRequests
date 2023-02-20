var d = document;
var reqID = null;
var uploadedFileList = [];

d.addEventListener('DOMContentLoaded', getNewID, false);

function getNewID(){
    xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            console.log("Server:", this.responseText);
            data = JSON.parse(this.responseText);
            d.getElementById('requestID').innerHTML = `id: ${data["id"]}`;
            reqID = data["id"];
        }
    }
    xR.open("POST", "getNewID.php", true);
    xR.send();
}


d.getElementById("uploads").addEventListener("change", function() {
    console.log(this.files);
    for (let i=0; i<this.files.length; i++){
        uploadFile(this.files[i]);
    }
})

function removeFile(i){
    let file = uploadedFileList[i];
    let data = {};
    data['action'] = 'remove';
    data['name'] = file['name'];
    xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("From server:");
            console.log(this.responseText);
            console.log(this.responseText.split()[0]);
            if (this.responseText.split(' ')[0] === 'Removed') {
                uploadedFileList.splice(i,1);
                makeFileUploadTable();
            }
            // let f = formData.get('file');
            // console.log(f['name'], f['size']);
            // uploadedFileList.push(formData.get('file'));
            
        }
    }
    xR.open("POST", "rmFile.php", true);
    xR.setRequestHeader('Content-Type', 'application/json');
    console.log("outgoing data: ", JSON.stringify(data));
    xR.send(JSON.stringify(data));
}

function uploadFile(file) {
    let formData = new FormData();
    formData.append("file", file);
    console.log("uploading", formData);
    //makeRequest(formData, "fileUpload.php");
    xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("From server:");
            console.log(this.responseText);
            let f = formData.get('file');
            console.log(f['name'], f['size']);

            let l_addToTable = true;
            console.log("File check");
            for (let i=0; i<uploadedFileList.length; i++){
                
                if (f['name'] === uploadedFileList[i]['name']){
                    l_addToTable = false;
                    console.log(f['name'], " already in table.")
                }
            }
            if (l_addToTable) {
                uploadedFileList.push(formData.get('file'));
                makeFileUploadTable();
            }
            
        }
    }
    xR.open("POST", "fileUpload.php", true);
    xR.send(formData);
}

function makeFileUploadTable(){
    uploadTable.innerHTML = '';
    let t = d.createElement("table");
    let h = t.createTHead();
    let r = h.insertRow();
    r.innerHTML = '<td>File</td><td>Remove</td>';
    let tb = t.createTBody();
    for (let i=0; i<uploadedFileList.length; i++) {
        let file = uploadedFileList[i];
        console.log('u:' + file['name']);
        let rf = tb.insertRow();
        let cf = rf.insertCell();
        let flink = d.createElement('a');
        flink.href = `./uploads/${file['name']}`;
        flink.innerText = file['name'];
        cf.append(flink);
        //cf.innerHTML = file['name'];
        let cr = rf.insertCell();
        let rmBut = d.createElement("input");
        rmBut.type = "button";
        rmBut.id = `rmFile-${i}`;
        rmBut.value = "Remove";
        cr.appendChild(rmBut);
        
    }
    uploadTable.append(t);

    //add listeners to remove buttons
    for (let i=0; i<uploadedFileList.length; i++) {
        let file = uploadedFileList[i];
        let id = `rmFile-${i}`;
        d.getElementById(id).addEventListener('click', () => {
            console.log("Removing: " + i + ":" + file['name']);
            removeFile(i);
        })
    }
    
}


d.getElementById("submitRequest").addEventListener("click", () => {
    
    let formData = new FormData();
    // Collect data to be sent
    formData.append("id", reqID);
    formData.append("requester", rName.value);
    formData.append("email", requesterEmail.value);
    formData.append("title", requestTitle.value);
    formData.append("request", requestDescription.value);
    formData.append("targetDate", wantBy.value);
    formData.append("priority", priority.value);
    formData.append("fileList", JSON.stringify(uploadedFileList));

    console.log(formData);
    makeRequest(formData);
    
})

function makeRequest(formData, phpFile="postLogger.php"){
    xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("From server:");
            console.log(this.responseText);
        }
    }
    xR.open("POST", phpFile, true);
    xR.send(formData);
}
