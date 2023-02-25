var d = document;


function getNewID(){
    xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            console.log("Server:", this.responseText);
            data = JSON.parse(this.responseText);
            response = JSON.parse(data['response']);
            //console.log(JSON.parse(data['response'])['id']);
            // d.getElementById('requestID').innerHTML = `id: ${response["id"]}`;
            //reqID = response["id"];
            setPageID(response['id']);
        }
    }
    let data = {};
    data['action'] = "insert";
    data['value'] = {};
    xR.open("POST", "dbInterface.php", true);
    xR.send(JSON.stringify(data));
}

function getJobByID(id){
    xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            // console.log("Server:", this.responseText);
            data = JSON.parse(this.responseText);
            response = JSON.parse(data['response']);
            job = response["job"][0]
            console.log(job);
            populateJobPage(job);
        }
    }
    let data = {};
    data['action'] = "getJobByID";
    data['value'] = {"id": id};
    xR.open("POST", "dbInterface.php", true);
    xR.send(JSON.stringify(data));
}

function populateJobPage(job){
    rName.value = job["requester"];
    requesterEmail.value = job["email"];
    requestTitle.value = job['title'];
    requestDescription.innerHTML = job['description'];
    wantBy.value = job['targetDate'];
    priority.value = job['priority'];
    d.getElementById("status").value = job['status'];
    uploadedFileList = job['fileList'];
    makeFileUploadTable();
}

function setPageID(id){
    d.getElementById("requestID").innerHTML = `id: ${id}`;
    reqID = id;
    return id;
}




function removeFile(i){
    let fileName = uploadedFileList[i];
    let data = {};
    data['action'] = 'remove';
    data['name'] = fileName;
    data['id'] = reqID;
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
    formData.append("id", reqID);
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
                
                if (f['name'] === uploadedFileList[i]){
                    l_addToTable = false;
                    console.log(f['name'], " already in table.")
                }
            }
            if (l_addToTable) {
                uploadedFileList.push(f['name']);
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
        let fileName = uploadedFileList[i];
        console.log('u:' + fileName);
        let rf = tb.insertRow();
        let cf = rf.insertCell();
        let flink = d.createElement('a');
        flink.href = `./uploads/${reqID}/${fileName}`;
        flink.innerText = fileName;
        cf.append(flink);
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
        let fileName = uploadedFileList[i];
        let id = `rmFile-${i}`;
        d.getElementById(id).addEventListener('click', () => {
            console.log("Removing: " + i + ":" + fileName);
            removeFile(i);
        })
    }
    
}



function makeJobBoard(adminFlag=false){
    let xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            //console.log("Server (getAll):", this.responseText);
            data = JSON.parse(this.responseText);
            response = JSON.parse(data['response']);

            //makeJobTable(response['values']);
            showJobs(response["values"], adminFlag);
        }
    }
    let data = {};
    data['action'] = "getAll";
    xR.open("POST", "dbInterface.php", true);
    xR.send(JSON.stringify(data));
}

function showJobs(jobs, adminFlag=false){
    let board = d.getElementById('jobBoard');
    board.innerHTML = "";

    for (let n=0; n<jobs.length; n++) {
        let job = jobs[n];
        if (typeof job["id"] !== 'undefined'){
            console.log(job["id"], job["requester"]);
            let jobDiv = d.createElement("div");
            jobDiv.classList.add("job");

            let titleDiv = d.createElement("div");
            titleDiv.classList.add("jobTitle");
            titleDiv.innerHTML = `${job['id']}: ${job['title']}`;
            jobDiv.append(titleDiv);

            div = d.createElement('div');
            div.classList.add("jobRequester");
            div.innerHTML = `${job['requester']}`;
            jobDiv.append(div);

            div = d.createElement('div');
            div.classList.add("jobPriority");
            div.innerHTML = `Priority: ${job['priority']}`;
            jobDiv.append(div);

            div = d.createElement('div');
            div.classList.add("jobStatus");
            div.innerHTML = `Status: ${job['status']}`;
            jobDiv.append(div);

            div = d.createElement('div');
            div.classList.add("jobDescription");
            let txt = `${job['description'].substring(0,50)}`;
            if (job['description'].length > txt.length) {
                txt += "...";
            }
            div.innerHTML = txt;
            jobDiv.append(div);

            if (adminFlag) { //remove job button
                div = d.createElement('div');
                rmBut =d.createElement('input');
                rmBut.type = 'button';
                rmBut.id = `rmJob-${job['id']}`;
                rmBut.value = "Remove Job";
                div.append(rmBut);
                jobDiv.append(div);
            }

            board.append(jobDiv);

            jobDiv.addEventListener("click", function(){
                console.log(job['id']);
                let url = `job.html?id=${job['id']}`;
                window.location.href = url;
            })

            if (adminFlag) {
                rmBut.addEventListener("click", () => {
                    if (confirm(`Remove ${job['id']}: ${job['title']}?`)) {
                        console.log(`removing ${job['id']}: ${job['title']}`);
                        removeJobFromDB(job['id']);
                    }
                })
            }
        }
        
    }
    
}

function removeJobFromDB(id){
    xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            console.log("Server:", this.responseText);
            data = JSON.parse(this.responseText);
            response = JSON.parse(data['response']);
            jobID = response["removed"][0]
            //console.log(job);
            //populateJobPage(job);
            alert(`${jobID} removed!`);
            makeJobBoard(true);
        }
    }
    let data = {};
    data['action'] = "removeJobByID";
    data['value'] = {"id": id};
    xR.open("POST", "dbInterface.php", true);
    xR.send(JSON.stringify(data));
}

function addToDiv(divTo, divClass){
    let div = d.createElement("div");
    div.classList.add(divClass);
}

function makeJobTable(jobs){
    let tableCols = [];
    tableCols.push("id");
    tableCols.push("requester");
    tableCols.push("title");
    tableCols.push("priority");
    tableCols.push("status");

    let board = d.getElementById('jobBoard');
    board.innerHTML = "";

    let t = d.createElement("table");
    // Headers
    let h = t.createTHead();
    let r = h.insertRow();
    for (let i=0; i<tableCols.length; i++){
        let c = r.insertCell();
        c.innerHTML = tableCols[i];
    }

    //Body
    let tb = t.createTBody();

    console.log("jobs:", jobs);
    for (let n=0; n<jobs.length; n++) {
        let job = jobs[n];
        if (typeof job["id"] !== 'undefined'){
            console.log(job["id"], job["requester"]);
            let r = tb.insertRow();
            for (let i=0; i<tableCols.length; i++){
                let c = r.insertCell();
                c.innerHTML = job[tableCols[i]];
            }
        }
        
    }
    board.append(t);

}