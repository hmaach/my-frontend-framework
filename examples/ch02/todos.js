// State of the app
const todos = ['Walk the dog', 'Water the plants', 'Sand the chairs']

// HTML element references
const todoForm = document.getElementById('todo-form')
const addTodoInput = document.getElementById('todo-input')
const addTodoButton = document.getElementById('add-todo-btn')
const todosList = document.getElementById('todos-list')

todoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const newTodo = addTodoInput.value

    if (todos.some(todo => newTodo === todo)) {
        alert("it's already exist!")
        return
    }
    addTodo(newTodo)
    todos.push(newTodo)
    let utterance = new SpeechSynthesisUtterance(newTodo);
    speechSynthesis.speak(utterance);
    addTodoInput.value = ""
})

addTodoInput.addEventListener("input", () => {
    addTodoButton.disabled = addTodoInput.value.length < 3
})

const addTodo = (todo) => {
    const li = document.createElement("li")
    const span = document.createElement("span")
    span.textContent = todo
    li.appendChild(span)

    const doneBtn = document.createElement("button")
    doneBtn.innerText = "Done"

    const updateBtn = document.createElement("button")
    updateBtn.innerText = "Update"

    const updateInput = document.createElement("input")
    updateInput.value = todo
    updateInput.style.display = "none"

    const cancelBtn = document.createElement("button")
    cancelBtn.innerText = "Cancel"
    cancelBtn.style.display = "none"

    const saveBtn = document.createElement("button")
    saveBtn.innerText = "Save"
    saveBtn.style.display = "none"

    updateInput.addEventListener("input", () => {
        saveBtn.disabled = updateInput.value.length < 3
    })

    doneBtn.addEventListener("click", () => {
        doneBtn.style.display = "none"
        updateBtn.style.display = "none"
        li.classList.add("done")
    })

    li.addEventListener("dblclick", () => {
        span.style.display = "none"
        doneBtn.style.display = "none"
        updateBtn.style.display = "none"
        updateInput.style.display = "block"
        cancelBtn.style.display = "block"
        saveBtn.style.display = "block"
    })

    updateBtn.addEventListener("click", () => {
        span.style.display = "none"
        doneBtn.style.display = "none"
        updateBtn.style.display = "none"
        updateInput.style.display = "block"
        cancelBtn.style.display = "block"
        saveBtn.style.display = "block"
    })

    cancelBtn.addEventListener("click", () => {
        updateInput.value = todo
        span.style.display = "block"
        updateBtn.style.display = "block"
        doneBtn.style.display = "block"
        updateInput.style.display = "none"
        cancelBtn.style.display = "none"
        saveBtn.style.display = "none"
    })

    saveBtn.addEventListener("click", () => {
        if (updateInput.value.length < 3) return
        span.textContent = updateInput.value
        span.style.display = "block"
        updateBtn.style.display = "block"
        doneBtn.style.display = "block"
        updateInput.style.display = "none"
        cancelBtn.style.display = "none"
        saveBtn.style.display = "none"
    })

    li.appendChild(doneBtn)
    li.appendChild(updateBtn)
    li.appendChild(updateInput)
    li.appendChild(cancelBtn)
    li.appendChild(saveBtn)

    todosList.appendChild(li)
}

todos.forEach(todo => {
    addTodo(todo)
});
