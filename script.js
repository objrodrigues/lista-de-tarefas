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

// Variáveis --------------------------------------------------------------------------------------
var taskElementEdit

// Funções ----------------------------------------------------------------------------------------

// Criar tarefa
const createTask = (title, done = 0, saved = 1) => {
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

    if (done) {
        task.classList.add("done")
    }

    if (saved) {
        saveTaskInLocalStorageTasksList({ title, done: 0 })
    }

    tasksList.appendChild(task)

    taskInput.value = ""
}

// Pegar lista de tarefas do Local Storage
const getTasksListLocalStorage = () => {
    const tasksList = JSON.parse(localStorage.getItem("tasksList")) || []
    return tasksList
}

// Carregar lista de tarefas
const loadTasksList = () => {
    const tasksList = getTasksListLocalStorage()

    tasksList.forEach(
        (task) => {
            createTask(task.title, task.done, 0)
        }
    )
}

// Salvar tarefa na lista de tarefas do Local Storage
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

// Atualizar status da tarefa no Local Storage
const updateTaskStatusLocalStorage = (taskTitle) => {
    const tasksList = getTasksListLocalStorage()

    tasksList.map(
        (task) => task.title === taskTitle ? (task.done = !task.done) : null
    )

    localStorage.setItem("tasksList", JSON.stringify(tasksList))
}

// Atualizar a tarefa no Local Storage
const updateTaskLocalStorage = (todoOldTitle, todoNewTitle) => {
    const tasksList = getTasksListLocalStorage()

    tasksList.map((task) =>
        task.title === todoOldTitle ? (task.title = todoNewTitle) : null
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
    }
)

// Ações dos botões da tarefa
document.addEventListener(
    "click",
    (event) => {
        const targetElement = event.target
        const taskElement = targetElement.closest("div")

        // Tarefa concluida
        if (targetElement.classList.contains("button-done")) {

            taskElement.classList.add("done")

            const taskButton = targetElement.closest("button")
            taskButton.innerHTML = '<img class="img-button-option button-undone" src="./assets/undone.svg" alt="">'

            taskTitle = taskElement.firstElementChild.innerText

            updateTaskStatusLocalStorage(taskTitle)

            // Tarefa não concluida
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

            // Mostrar mensagens de campo inválido
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

loadTasksList()