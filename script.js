// Selection of elements

const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const addEditBtn = document.querySelector("#add-edit-btn")
const alert = document.querySelector("#alert")
const closeAlertBtn = document.querySelector("#close-alert-btn")
const editTaskAlert = document.querySelector(".edit-task-alert")
var taskElementEdit
// --------------------------------------------------------------------------------------------------

// Functions
    const addTask = (title) => {
        const task = document.createElement("div")
        task.classList.add("task")

        const taskTitle = document.createElement("h2")
        taskTitle.classList.add("task-title")
        taskTitle.innerText = title

        const taskOptionsContainer = document.createElement("section")
        taskOptionsContainer.classList.add("task-options-container")

        const buttonDone = document.createElement("button")
        buttonDone.setAttribute("class", "button-option")
        buttonDone.innerHTML = '<img class="img-button-option button-done" src="./assets/done.svg" alt="">'
        taskOptionsContainer.appendChild(buttonDone)

        const buttonEdit = document.createElement("button")
        buttonEdit.setAttribute("class", "button-option")
        buttonEdit.innerHTML = '<img class="img-button-option button-edit" src="./assets/edit.svg" alt="">'
        taskOptionsContainer.appendChild(buttonEdit)

        const buttonRemove = document.createElement("button")
        buttonRemove.setAttribute("class", "button-option")
        buttonRemove.innerHTML = '<img class="img-button-option button-remove" src="./assets/remove.svg" alt="">'
        taskOptionsContainer.appendChild(buttonRemove)
        
        task.appendChild(taskTitle)
        task.appendChild(taskOptionsContainer)

        todoList.appendChild(task)

        todoInput.value = ""
        todoInput.focus()
    }

    const closeAlert = () => {
        alert.style.display = "none"
    }
// --------------------------------------------------------------------------------------------------

// Events
todoForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault()
        const inputValue = todoInput.value

        if (inputValue){
            addTask(inputValue)
        console.log("Tarefa adicionada")
        }else {
         //   alert.style.display = "flex"
        }
        
    }
)

document.addEventListener(
    "click",
    (event) => {
        const targetElement = event.target
        const taskElement = targetElement.closest("div")

        if (targetElement.classList.contains("button-done")){

            taskElement.classList.add("done")

            const taskButton = targetElement.closest("button")
            taskButton.innerHTML = '<img class="img-button-option button-undone" src="./assets/undone.svg" alt="">'

        }else if(targetElement.classList.contains("button-undone")){

            taskElement.classList.remove("done")

            const taskButton = targetElement.closest("button")
            taskButton.innerHTML = '<img class="img-button-option button-done" src="./assets/done.svg" alt="">'

        }else if(targetElement.classList.contains("button-edit")){

            taskElementEdit = taskElement
            editForm.style.display = "flex"

        }else if(targetElement.classList.contains("button-remove")){

            taskElement.remove()

        }
    }
)


addEditBtn.addEventListener(
    "click",
    (event) => {
        if(editInput.value){
            event.preventDefault()
            taskElementEdit.querySelector("h2").innerText = editInput.value
            editForm.style.display = "none"
            editTaskAlert.style.display = "none"
            editInput.value = ""
        }else {
            event.preventDefault()
            editTaskAlert.style.display = "flex"
        }
    }
)

cancelEditBtn.addEventListener(
    "click",
    (event) => {
        event.preventDefault()
        editForm.style.display = "none"
        editTaskAlert.style.display = "none"
    }
)
// --------------------------------------------------------------------------------------------------