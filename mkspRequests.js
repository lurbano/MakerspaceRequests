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
            
            console.log("Server:", this.responseText);
            data = JSON.parse(this.responseText);
            response = JSON.parse(data['response']);
            job = response["job"] //[0]
            console.log("job:", job, job !== undefined);
            if (job !== undefined) {
                populateJobPage(job);
            } else {
                alert(`Request ID: ${response['id']} not found.`);
            }
            
        }
    }
    let data = {};
    data['action'] = "getJobByID";
    data['value'] = {"id": id};
    xR.open("POST", "dbInterface.php", true);
    console.log("Request", data);
    xR.send(JSON.stringify(data));
}


function populateJobPage(job){
    for (const [key, value] of Object.entries(job)) {
        // console.log(`${key}: ${value}`);
        if (d.getElementById(key) !== null){
            d.getElementById(key).value = value;
        }
    }
    cID.innerHTML = `<p>-- ${job['id']} --<br> ${job['rTitle']}</p>`;

    // rName.value = job["rName"];
    // rEmail.value = job["rEmail"];
    // rTitle.value = job['rTitle'];
    // rNotes.innerHTML = job['rNotes'];
    // rTargetDate.value = job['rTargetDate'];
    // rPriority.value = job['rPriority'];
    // rStatus.value = job['rStatus'];
    rUploadedFileList = job['rUploadedFileList'];
    makeFileUploadTable();
    submitRequest.value = "Update Request";
}

function setPageID(id){
    d.getElementById("rID").innerHTML = `id: ${id}`;
    reqID = id;
    return id;
}




function removeFile(i){
    let fileName = rUploadedFileList[i]['filename'];
    let data = {};
    data['action'] = 'remove';
    data['name'] = fileName;
    data['id'] = reqID;
    xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("From server:");
            console.log(this.responseText);
            data = JSON.parse(this.responseText);
            if (data['status'] === 'Removed') {
                rUploadedFileList.splice(i,1);
                makeFileUploadTable();
            }
            
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
            data = JSON.parse(this.responseText);
            if (data['status'] === 'Failure') {
                alert("Upload Failed: Error #" + data['error']);
            } else {
                let f = formData.get('file');
                console.log(f['name'], f['size']);
    
                let l_addToTable = true;
                console.log("File check");
                for (let i=0; i<rUploadedFileList.length; i++){
                    
                    if (f['name'] === rUploadedFileList[i]){
                        l_addToTable = false;
                        console.log(f['name'], " already in table.")
                    }
                }
                if (l_addToTable) {
                    let newfile = {
                        "filename": f['name'], 
                        "note": "",
                        "thumb": 0
                    };
                    rUploadedFileList.push(newfile); //only saved when page saved
                    makeFileUploadTable();
                }
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
    for (let i=0; i<rUploadedFileList.length; i++) {
        let fileName = rUploadedFileList[i]["filename"];
        console.log('u:' + fileName);
        let rf = tb.insertRow();
        let cf = rf.insertCell();
        let flink = d.createElement('a');
        flink.href = `./jobs/${reqID}/uploads/${fileName}`;
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
    for (let i=0; i<rUploadedFileList.length; i++) {
        let fileName = rUploadedFileList[i];
        let id = `rmFile-${i}`;
        d.getElementById(id).addEventListener('click', () => {
            console.log("Removing: " + i + ":" + fileName);
            removeFile(i);
        })
    }
    
}


function makeJobBoardQ(key="mStatus", value="all"){
    
    console.log(`key: ${key} | value: ${value}`);
    let xR = new XMLHttpRequest();
    xR.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            
            console.log("Server (getAll):", this.responseText);
            data = JSON.parse(this.responseText);
            response = JSON.parse(data['response']);

            //makeJobTable(response['values']);
            showJobs(response["values"], adminFlag);
        }
    }
    let data = {};
    data['action'] = "getByQuery";
    data['key'] = key;
    data['value'] = value;
    console.log("data: ", data);
    xR.open("POST", "dbInterface.php", true);
    xR.send(JSON.stringify(data));
}

function showJobs(jobs, adminFlag=false){
    let board = d.getElementById('jobBoard');
    board.innerHTML = "";

    for (let n=0; n<jobs.length; n++) {
        let job = jobs[n];
        if (typeof job["id"] !== 'undefined'){
            //console.log(job["id"], job["requester"]);
            let jobDiv = d.createElement("div");
            jobDiv.classList.add("job");

            //add class based on status
            jobDiv.classList.add(`job_${job['mStatus']}`);
            

            // let titleDiv = d.createElement("div");
            // titleDiv.classList.add("jobTitle");
            // titleDiv.innerHTML = `${job['id']}: <b>${job['rTitle']}</b>`;
            // jobDiv.append(titleDiv);


            let titleLink = d.createElement('a');
            titleLink.classList.add("jobTitle");
            titleLink.innerHTML = `${job['id']}: <b>${job['rTitle']}</b>`;
            titleLink.setAttribute('href', `job.html?id=${job['id']}`);
            jobDiv.append(titleLink);


            reqDiv = d.createElement('div');
            reqDiv.classList.add("jobRequester");
            reqDiv.innerHTML = `<b>${job['rName']}</b> (${job['rStatus']}) (Pri: ${job['rPriority']}) `;
            jobDiv.append(reqDiv);


            div = d.createElement('div');
            div.classList.add("jobStatus");
            div.innerHTML = `<b>${job['mName']}</b> (${job['mStatus']})`;
            jobDiv.append(div);


            div = d.createElement('div');
            div.classList.add("jobDescription");
            let txt = `${job['rNotes'].substring(0,50)}`;
            if (job['rNotes'].length > txt.length) {
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


            jobLink = d.createElement('a');
            jobLink.classList.add("jobLink");
            jobLink.setAttribute('href', `job.html?id=${job['id']}`);
            jobLink.innerHTML = "View Details";
            jobDiv.append(jobLink);

            board.append(jobDiv);


            jobLink.addEventListener("click", function(){
                console.log(job['id']);
                let url = `job.html?id=${job['id']}`;
                window.location.href = url;
            })

            // Button for Administrator to remove jobs
            if (adminFlag) {
                rmBut.addEventListener("click", () => {
                    if (confirm(`Remove ${job['id']}: ${job['title']}?`)) {
                        console.log(`removing ${job['id']}: ${job['rTitle']}`);
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

function searchJobs(txt){
    if (txt !== ""){
        console.log(`Search for: ${txt}`);
        let xR = new XMLHttpRequest();
        xR.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                console.log("Server (search):", this.responseText);
                data = JSON.parse(this.responseText);
                response = JSON.parse(data['response']);
    
                //makeJobTable(response['values']);
                showJobs(response["values"], adminFlag);
            }
        }
        let data = {};
        data['action'] = "searchText";
        data['value'] = txt;
        console.log("data: ", data);
        xR.open("POST", "dbInterface.php", true);
        xR.send(JSON.stringify(data));
    }
    else {
        makeJobBoardQ();
    }
}