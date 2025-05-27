// Backup storage
const state = {
    taskList: [],
};

// DOM Operations
const taskContents = document.querySelector(".task_contents");
const taskModal =  document.querySelector(".task_modal_body");

// Template for the card on screen 
// element identifier key = ${id} is been missing on line 13
const htmltaskcontent = ({id,title,description,type,url}) =>`
    <div class="col-md-6 col-lg-4 mt-3" id = ${id} key = ${id}>
        <div class = 'card shadow-sm task_card'>
            <div class = 'card header d-flex justify-content-end task_card_header'>
                <button type="button" class='btn btn-outline-primary mr-1.5' title="Add Task" name=${id} onclick="editTask.apply(this,arguments)">
                   <i class='fas fa-pencil-alt name=${id}'></i></button>

                <button type="button" class='btn btn-outline-danger mr-1.5' name=${id} onclick="DeleteTask.apply(this,arguments)">
                  <i class="fas fa-trash-alt" name="${id}" ></i>
</button>   
            </div>
            <div class = 'card-body'>
                ${
                    url 
                    ? `<img width = '100%' src = ${url} alt ='Card Image' class ='card-img-top md-3 rounded-lg'/>`
                    : `<img width = '80%' src = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" alt ='Card Image' class ='card-img-top md-3 rounded-lg'/>`
                }       
                <h4 class = 'card-title task_card_title'>${title}</h4>
                <p class = 'description trim-3-lines text-muted'>${description}</p>
                <div class = 'tags text-white d-flex flex-wrap'>
                    <span class = 'badge bg-primary m-1'>${type}</span>
                </div>
                <div class = 'card-footer'>
                    <button type='button' class="btn btn-outline-primary float-right" data-bs-toggle="modal" data-bs-target = "#showTask"onclick="OpenTask.apply(this,arguments)" id=${id}>Open Task</button>
                </div>
            </div>
        </div>             
    </div>`;

    // Modal Body On >> Click of Open Task
const htmlModalContent = ({id,title,description,type,url}) =>{
    const date = new Date(parseInt(id));
    return`
        <div id=${id}>
        ${
            url 
                    ? `<img width = '100%' src = ${url} alt ='Card Image' class ='card-img-top md-3 rounded-lg'/>`
                    : `<img width = '100%' src = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" alt ='Card Image' class ='card-img-top md-3 rounded-lg'/>`
        } 
        <strong class ='text-muted text-sm'>Created On : ${date.toDateString()}</strong>
        <h2 class ='my-3'>${title}</h2>
        <p class = 'text-muted'> ${description}</p>
        </div>  
    `; 
};

// Covert JSON > string for local storage
const updateLocalStorage = () => {
    localStorage.setItem(
        "task",
        JSON.stringify({
            tasks:state.taskList,
        })
    );
};

// Convert string > Json for rendering the cards on screen
const LoadInitialData = () => {
    const storedData = localStorage.getItem("task");
    if (!storedData) return; // If no data, exit safely

    try {
        const localStoragecopy = JSON.parse(storedData);
        if (localStoragecopy && Array.isArray(localStoragecopy.tasks)) {
            state.taskList = localStoragecopy.tasks;
            state.taskList.forEach((cardData) => {
                taskContents.insertAdjacentHTML("beforeend", htmltaskcontent(cardData));
            });
        }
    } catch (err) {
        console.error("Error parsing localStorage data:", err);
    }
};



// Spread Operator...
// Appending or adding a new key to object:
// console.log({...obj,designation: "mentor"});
// {name:'tarun',age:20,designation: 'mentor'};

// When we  update/edit we need to save it..
const handleSubmit = (event) =>{
    const id = `${Date.now()}`;
    const input = {
        url:document.getElementById("imageUrl").value,
        title:document.getElementById("TaskTitle").value,
        type: document.getElementById("tags").value,
        description:document.getElementById("TaskDescription").value,
    };
    taskContents.insertAdjacentHTML("beforeend",htmltaskcontent({...input,id})
);
state.taskList.push({...input,id});
updateLocalStorage();
};
// Open Task
const OpenTask =(e) =>{
    if (!e) e = window.event;

    const getTask = state.taskList.find(({id})=> id === e.target.id);
    taskModal.innerHTML=htmlModalContent(getTask) 
};

// Delete task

const DeleteTask =(e) =>{
    if (!e) e = window.event;

    const targetId = e.target.getAttribute("name");
    const type = e.target.tagName;
    const removeTask = state.taskList.filter(({id}) => id!== targetId);
    updateLocalStorage();

    if(type === "BUTTON"){
        // console.log(e.target.parentNode.parentNode.parentNode.parentNode);
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode
    );

};

// edit task
const editTask = (e) => {
    if(!e)e = window.event;

    const targetId = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let TaskTitle;
    let TaskDescription;
    let taskType;
    let submitButton;

    if(type == "BUTTON"){
        parentNode = e.target.parentNode.parentNode;   
    }
    else{
        parentNode = e.target.parentNode.parentNode.parentNode;
    }
    TaskTitle = parentNode.childNodes[3].childNodes[3];
    TaskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes  [1];

    console.log(TaskTitle,TaskDescription,taskType,submitButton);

    TaskTitle.setAttribute("contenteditable","true");
    TaskDescription.setAttribute("contenteditable","true");
    taskType.setAttribute("contenteditable","true");

    submitButton.setAttribute("onclick","saveEdit.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};

// save edit

const saveEdit = (e) => {
    if(!e) e = window.event;
    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode;
    
    const TaskTitle = parentNode.childNodes[3].childNodes[3];
    const TaskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updateData = {
        TaskTitle: TaskTitle.innerHTML,
        TaskDescription: TaskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };
    let stateCopy = state.taskList;
    stateCopy = stateCopy.map((task) =>
     task.id === targetId
      ? {
        id: task.id,
        title: updateData.TaskTitle,
        description:updateData.TaskDescription,
        type:updateData.taskType,
        url: task.url,
        }
      : task
    );
    state.taskList= stateCopy;
    updateLocalStorage();

TaskTitle.setAttribute("contenteditable","false");
TaskDescription.setAttribute("contenteditable","false");
taskType.setAttribute("contenteditable","false");

submitButton.setAttribute("onclick","OpenTask.apply(this,arguments)");
submitButton.setAttributeAttribute("data-bs-toggle","modal");
submitButton.setAttributeAttribute("data-bs-target","#showTask");
submitButton.innerHTML = "Open Task";

};

// search
const searchTask = (e) =>{
    if (!e)e = window.event;

    while(taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild);
    }
    const resultData = state.taskList.filter(({title})=>
        title.toLowerCase().includes(e.target.value.toLowerCase())
    );

    resultData.map((cardData)=> {
        taskContents.insertAdjacentHTML("beforeend",htmlModalContent(cardData));
    }); 
};

    