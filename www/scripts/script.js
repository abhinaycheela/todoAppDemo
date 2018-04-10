alert('hi');
function Task(id, name, tag, status) {
    this.id = id;
    this.name = name;
    this.tag = tag;
    this.status = status;
}

var taskArray = [
    {
        id: 1,
        name: 'Draw Painting',
        status: "pending",
        tag: ["tag1"]
    },
    {
        id: 2,
        name: 'Go for Shopping',
        status: "completed",
        tag: ["tag1", "tag2"]
    }
]

var tagsArray = [];

var getID = (function () {
    var id = taskArray[taskArray.length - 1].id;
    return function () { return id += 1; }
})();
//function for adding tasks
function addTask() {
    let taskName = document.getElementById("taskname").value;
    if (taskName.length < 4) {
        alert("Task Name should be of minimum 4 charcaters");
        return;
    }
    let tags = tagsArray;
    let statusValue = document.getElementById("status").value;
    if (statusValue == "1") {
        statusValue = "pending"
    }
    else {
        statusValue = "completed";
    }
    let newTask = new Task(getID(), taskName, tagsArray, statusValue);
    taskArray.push(newTask);
    createTaskDiv(newTask);
    progressCalculator();
    document.getElementById("taskname").value = "";
    document.getElementById("tags").value = "";
    tagsArray.splice(0, tagsArray.length);
    document.getElementById("tagdisplay").innerHTML = ""
}

function addTags() {
    let tag = document.getElementById("tags").value;
    tagsArray.push(tag);
    document.getElementById("tags").value = "";
    let tagDiv = document.createElement("div");
    let remBtn = document.createElement("button");
    remBtn.innerHTML = "X";
    remBtn.onclick = (e) => {
        let tagValue = e.target.parentElement.childNodes[1].innerHTML;
        let index = tagsArray.findIndex((el) => el == tagValue);
        tagsArray.splice(index, 1);
        e.target.parentElement.remove();
    }
    tagDiv.style.display = "block";
    tagDiv.style.cssFloat = "left"
    tagDiv.style.paddingRight = "5px"
    let p = document.createElement("p");

    p.textContent = tag;
    p.style.cssFloat = "right"
    tagDiv.appendChild(remBtn);
    tagDiv.appendChild(p);
    document.getElementById("tagdisplay").appendChild(tagDiv);
}

function createTaskDiv(taskObj) {
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = "checkBox" + taskObj.id;
    if (taskObj.status == "completed") {
        checkBox.setAttribute("checked", true);
    }
    checkBox.addEventListener("change", statusSwap);
    let taskName = document.createElement("p");
    taskName.textContent = taskObj.name;
    let tags = document.createElement("p");
    tags.textContent = taskObj.tag;
    let status1 = document.createElement("p");
    status1.textContent = taskObj.status;
    status1.setAttribute("id", "statusTd" + taskObj.id);
    let options = document.createElement("div");
    let remove = document.createElement("button");
    remove.innerHTML = "remove";
    remove.onclick = () => {
        removeTask(event, taskObj.id)
    }
    let edit = document.createElement("button");
    edit.innerHTML = "edit";

    edit.onclick = () => {
        let taskName = document.getElementById("taskname");
        let tags = document.getElementById("tags");
        taskName.value = taskObj.name;
        tags.value = taskObj.tag;
        let saveBtn = document.getElementById("save");
        saveBtn.onclick = () => {
            let statusValue = document.getElementById("status").value;
            let index = taskArray.findIndex(el => el.id == taskObj.id);
            taskArray[index].name = taskName.value;
            taskArray[index].tag = tags.value;
            statusValue = statusValue == "1" ? "pending" : "completed";
            taskArray[index].status = statusValue;
            document.getElementById("tasksTable").innerHTML = "";
            document.getElementById("taskname").value = "";
            document.getElementById("tags").value = "";
            tagsArray.splice(0, tagsArray.length);
            document.getElementById("tagdisplay").innerHTML = ""
            loadTasks();
            saveBtn.onclick = addTask;
            progressCalculator();
        }
    }
    options.appendChild(edit);
    options.appendChild(remove);

    tr = document.getElementById("tasksTable").insertRow(-1);
    tr.setAttribute("id", "taskRow" + taskObj.id);
    let td1 = tr.insertCell(-1);
    let td2 = tr.insertCell(-1);
    let td3 = tr.insertCell(-1);
    let td4 = tr.insertCell(-1);
    let td5 = tr.insertCell(-1);
    td1.appendChild(checkBox);
    td2.appendChild(taskName);
    td3.appendChild(tags);
    td4.appendChild(status1);
    td5.appendChild(edit)
    td5.appendChild(remove);





    function removeTask(e, id) {
        e.target.parentElement.parentElement.remove()
        let taskIndex = -1;
        for (let i = 0; i < taskArray.length; i++) {
            if (taskArray[i].id == id) {
                taskIndex = i;
                break;
            }
        }

        if (taskIndex > -1) {
            taskArray.splice(taskIndex, 1);
        }
        progressCalculator();
    }


}


function statusSwap(e) {
    let taskDiv = e.target.parentElement;

    let id = e.target.id.slice(8);

    for (i = 0; i < taskArray.length; i++) {
        if (taskArray[i].id == id) {
            if (taskArray[i].status == "pending") {
                taskArray[i].status = "completed";
                document.getElementById("statusTd" + id).innerHTML = "completed";
                break;
            }
            taskArray[i].status = "pending";
            document.getElementById("statusTd" + id).innerHTML = "pending";
        }
    }
    progressCalculator();
}

function loadTasks() {

    for (let i = 0; i < taskArray.length; i++) {
        createTaskDiv(taskArray[i]);

    }
    progressCalculator();
};
loadTasks();

function filterFun() {

    var input, filter, table, tr, td, i;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    tasksTable = document.getElementById("tasksTable");
    tr = tasksTable.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td1 = tr[i].getElementsByTagName("td")[1];
        td2 = tr[i].getElementsByTagName("td")[2];
        if (td1) {
            if (td1.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }

    }
}

function showPending(e) {

    tasksTable = document.getElementById("tasksTable");
    tr = tasksTable.getElementsByTagName("tr");
    if (!e.target.checked) {
        for (i = 0; i < tr.length; i++) {
            id = i + 1;
            td = document.getElementById("statusTd" + id);
            tr[i].style.display = "";
        }
        return;
    }
    for (i = 0; i < tr.length; i++) {
        id = i + 1;
        td = document.getElementById("statusTd" + id);

        if (td) {
            if (td.innerHTML == "pending") {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function progressCalculator() {
    let pendingTasks = 0, completedTasks = 0, percentage = 0;
    let Progress = document.getElementById("Progress");
    let Completed = document.getElementById("Completed");
    let Pending = document.getElementById("Pending");
    for (let i = 0; i < taskArray.length; i++) {
        if (taskArray[i].status == "completed") {
            completedTasks++;
        }
        else {
            pendingTasks++;
        }
    }
    Pending.innerHTML = pendingTasks;
    Completed.innerHTML = completedTasks;
    percentage = (completedTasks / (completedTasks + pendingTasks)) * 100;
    if (isNaN(percentage)) {
        Progress.innerHTML = "0%";
        return
    }

    Progress.innerHTML = percentage.toString().slice(0, 5) + "%";
}

function clearCompleted() {

    for (let i = 0; i < taskArray.length; i++) {
        if (taskArray[i].status == "completed") {
            document.getElementById("taskRow" + taskArray[i].id).remove();
            taskArray.splice(i, 1);
			i--;
        }
    }
    return false;
}