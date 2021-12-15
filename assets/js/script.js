
var tasks = [];
var pageContentEl = document.querySelector("#page-content");
var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("tasks-completed");


var taskFormHandler = function (event) {

    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();

    // has data attribute, so get task id and call function to complete edit process
    var isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        // package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        // send it as an argument to createTaskEl
        createTaskEl(taskDataObj);
    }
};

var createTaskEl = function(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl); 

    console.log(taskDataObj);
    console.log(taskDataObj.status);

    //increase task counter for the next unique id
    taskIdCounter++;       
};

var createTaskActions = function(taskId) {
    // create container to hold elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
  
    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);
    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    // create change status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";
    actionContainerEl.appendChild(statusSelectEl);
    // create status options
    var statusChoices = ["To Do", "In Progress", "Completed"];
  
    for (var i = 0; i < statusChoices.length; i++) {
      // create option element
      var statusOptionEl = document.createElement("option");
      statusOptionEl.setAttribute("value", statusChoices[i]);
      statusOptionEl.textContent = statusChoices[i];
  
      // append to select
      statusSelectEl.appendChild(statusOptionEl);
    }
  
    return actionContainerEl;
  };


var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was click
    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    if (event.target.matches(".delete-btn")) {
        console.log("delete", targetEl);
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

var editTask = function(taskId) {
    console.log("editing task #" + taskId);
    
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType; 
    document.querySelector("#save-task").textContent = "Save Task";
    
    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    
    // loop through tasks array and task object with the new content
    for (var i = 0; i < tasks.length; i++) {
        if(tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
    alert("Task Updated!");
};

var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);
  
    // find task list item based on event.target's data-task-id attribute
    var taskId = event.target.getAttribute("data-task-id");
  
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  
    // convert value to lower case
    var statusValue = event.target.value.toLowerCase();
  
    if (statusValue === "to do") {
      tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
      tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
      tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    console.log(tasks);

  };

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);
