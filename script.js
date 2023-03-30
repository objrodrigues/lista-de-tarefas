// Captura de elementos --------------------------------------------------------------------------
const taskForm = document.querySelector("#task-form")
const taskInput = document.querySelector("#task-input")
const tasksList = document.querySelector("#tasks-list")
const editForm = document.querySelector("#edit-form")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#cancel-edit-btn")
const addEditBtn = document.querySelector("#add-edit-btn")
const alert = document.querySelector("#alert")
const closeAlertBtn = document.querySelector("#close-alert-btn")
const editTaskAlert = document.querySelector(".edit-task-alert")
const selectFilterTask = document.querySelector("#filter-task")

// Variáveis --------------------------------------------------------------------------------------
var taskElementEdit
var newtask

// Funções ----------------------------------------------------------------------------------------
//Recarregar lista de tarefas na tela
const reloadTaskList = () => {
    tasksList.innerHTML = null
    loadFilteredTasksList(getFilterSelectedLocalStorage())
}

// Criar nova tarefa
const createTask = (title, done = false, isNewTask = true) => {

    newTask = document.createElement("div")
    newTask.classList.add("task")

    const taskTitle = document.createElement("h2")
    taskTitle.classList.add("task-title")
    taskTitle.innerText = title

    const taskOptionsContainer = document.createElement("section")
    taskOptionsContainer.classList.add("task-options-container")

    const buttonDone = document.createElement("button")
    buttonDone.setAttribute("class", "button-option")

    if (!done){
        buttonDone.innerHTML = '<img class="img-button-option button-done" src="./assets/done.svg" alt="">'
    } else {
        buttonDone.innerHTML = '<img class="img-button-option button-undone" src="./assets/undone.svg" alt="">'
        newTask.classList.add("done")
    }
    
    taskOptionsContainer.appendChild(buttonDone)

    const buttonEdit = document.createElement("button")
    buttonEdit.setAttribute("class", "button-option")
    buttonEdit.innerHTML = '<img class="img-button-option button-edit" src="./assets/edit.svg" alt="">'
    taskOptionsContainer.appendChild(buttonEdit)

    const buttonRemove = document.createElement("button")
    buttonRemove.setAttribute("class", "button-option")
    buttonRemove.innerHTML = '<img class="img-button-option button-remove" src="./assets/remove.svg" alt="">'
    taskOptionsContainer.appendChild(buttonRemove)

    newTask.appendChild(taskTitle)
    newTask.appendChild(taskOptionsContainer)

    if (isNewTask){
        saveTaskInLocalStorageTasksList({ title, done })
    }

    taskInput.value = ""

    return newTask
}

// Pegar lista de tarefas do Local Storage
const getTasksListLocalStorage = () => {
    let tasksList = JSON.parse(localStorage.getItem("tasksList")) || []
    return tasksList
}

// Pegar filtro selecionado do Local Storage
const getFilterSelectedLocalStorage = () => {
    const filterSelected = localStorage.getItem("filter-task-selected")
    return filterSelected
}

// Carregar lista de tarefas filtrada na tela
const loadFilteredTasksList = (filter) => {
    let filteredTasksList

    const loadTasksList = (element) => {
        element.forEach(
            (task) => {
                tasksList.appendChild(createTask(task.title, task.done, false))
            }
        )
    }

    switch (filter) {
        case 'all':
            filteredTasksList = getTasksListLocalStorage()
            loadTasksList(filteredTasksList)
            break
        case 'done':
            filteredTasksList = getTasksListLocalStorage().filter(task => task.done === true)
            loadTasksList(filteredTasksList)
            break
        case 'not-done':
            filteredTasksList = getTasksListLocalStorage().filter(task => task.done === false)
            loadTasksList(filteredTasksList)
            break
        default:
    }
}

// Adicionar tarefa na lista de tarefas do Local Storage
const saveTaskInLocalStorageTasksList = (task) => {
    const tasksList = getTasksListLocalStorage()

    tasksList.push(task)

    localStorage.setItem("tasksList", JSON.stringify(tasksList))
}

// Remover tarefa da lista de tarefas do Local Storage
const removeTaskInLocalStorageTasksList = (taskTitle) => {
    const tasksList = getTasksListLocalStorage()

    const filteredTasks = tasksList.filter((task) => task.title != taskTitle)

    localStorage.setItem("tasksList", JSON.stringify(filteredTasks))
}

// Atualizar status (Concluída / Não concluída) da tarefa no Local Storage
const updateTaskStatusLocalStorage = (taskTitle) => {
    const tasksList = getTasksListLocalStorage()

    tasksList.map(
        (task) => task.title === taskTitle ? (task.done = !task.done) : null
    )

    localStorage.setItem("tasksList", JSON.stringify(tasksList))
}

// Atualizar título da tarefa no Local Storage
const updateTaskLocalStorage = (todoOldTitle, todoNewTitle) => {
    const tasksList = getTasksListLocalStorage()

    tasksList.map(
        (task) => {
            if (task.title === todoOldTitle) {
                task.title = todoNewTitle
                task.done = false
            } else {
                null
            }
        }
    )

    localStorage.setItem("tasksList", JSON.stringify(tasksList))
}

const closeAlert = () => {
    alert.style.display = "none"
}

// Eventos -------------------------------------------------------------------------------------------
// Adicionar tarefa
taskForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault()
        const inputValue = taskInput.value

        if (inputValue) {
            createTask(inputValue)
        }

        reloadTaskList()
    }
)

// Filtrar tarefas
selectFilterTask.addEventListener(
    "change",
    (event) => {
        event.preventDefault()
        tasksList.innerHTML = null
        localStorage.setItem("filter-task-selected", selectFilterTask.value)

        switch (getFilterSelectedLocalStorage()) {
            case 'all':
                loadFilteredTasksList("all")
                break
            case 'done':
                loadFilteredTasksList("done")
                break
            case 'not-done':
                loadFilteredTasksList("not-done")
                break
            default:
        }
    }
)

// Ações dos botões da tarefa
document.addEventListener(
    "click",
    (event) => {
        const targetElement = event.target
        const taskElement = targetElement.closest("div")

        // Modificar status da tarefa para concluída
        if (targetElement.classList.contains("button-done")) {

            taskElement.classList.add("done")

            const taskButton = targetElement.closest("button")
            taskButton.innerHTML = '<img class="img-button-option button-undone" src="./assets/undone.svg" alt="">'

            taskTitle = taskElement.firstElementChild.innerText

            updateTaskStatusLocalStorage(taskTitle)

            // Modificar status da tarefa para não concluída
        } else if (targetElement.classList.contains("button-undone")) {

            taskElement.classList.remove("done")

            const taskButton = targetElement.closest("button")
            taskButton.innerHTML = '<img class="img-button-option button-done" src="./assets/done.svg" alt="">'

            taskTitle = taskElement.firstElementChild.innerText

            updateTaskStatusLocalStorage(taskTitle)

            // Abrir tela de edição de tarefa
        } else if (targetElement.classList.contains("button-edit")) {

            taskElementEdit = taskElement
            editForm.style.display = "flex"

            // Remover tarefa
        } else if (targetElement.classList.contains("button-remove")) {

            taskElement.remove()

            taskTitle = taskElement.firstElementChild.innerText

            removeTaskInLocalStorageTasksList(taskTitle)
        }
    }
)

// Editar tarefa
addEditBtn.addEventListener(
    "click",
    (event) => {
        if (editInput.value) {
            event.preventDefault()

            let oldTitle = taskElementEdit.querySelector("h2").innerText
            let newTitle = editInput.value

            taskElementEdit.querySelector("h2").innerText = newTitle

            editForm.style.display = "none"
            editTaskAlert.style.display = "none"
            editInput.value = ""

            updateTaskLocalStorage(oldTitle, newTitle)

            reloadTaskList()

            // Mostrar mensagem de campo inválido
        } else {
            event.preventDefault()
            editTaskAlert.style.display = "flex"
        }
    }
)

// Fechar caixa de tarefa e ocultar mensagem de campo inválido
cancelEditBtn.addEventListener(
    "click",
    (event) => {
        event.preventDefault()
        editForm.style.display = "none"
        editTaskAlert.style.display = "none"
    }
)

localStorage.setItem("filter-task-selected", selectFilterTask.value)

reloadTaskList()