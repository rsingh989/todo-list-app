const listsContainer = document.querySelector('[data-lists]');
const listForm = document.querySelector('[data-list-form]');
const listInput = document.querySelector('[data-list-input]');
const deleteList = document.querySelector('[data-delete-list]');
const todoListContainer = document.querySelector('[data-todo-list]');
const todoListTitle = document.querySelector('[data-todo-title]');
const todoListCount = document.querySelector('[data-task-count]');
const taskContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const taskForm = document.querySelector('[data-task]');
const taskInput = document.querySelector('[data-task-input]');
const clearCompletedTasks = document.querySelector(
  '[data-completed-tasks]'
);

//Defining local storage for lists
const LOCAL_STORAGE_LIST_KEY = 'task.lists';
let lists =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

//Defining local storage for selected list
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
let selectedListId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_LIST_ID_KEY
);

//Selecting list and making it active
listsContainer.addEventListener('click', (event) => {
  if (event.target.tagName.toLowerCase() === 'li') {
    selectedListId = event.target.dataset.listId;
    saveAndRenderList();
  }
});

//Updating the task count in selected list
taskContainer.addEventListener('click', (event) => {
  if (event.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(
      (list) => list.id === selectedListId
    );
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === event.target.id
    );
    selectedTask.complete = event.target.checked;
    saveList();
    renderTaskCount(selectedList);
  }
});

//Deleting completed tasks from the selected list
clearCompletedTasks.addEventListener('click', (event) => {
  const selectedList = lists.find(
    (list) => list.id === selectedListId
  );
  selectedList.tasks = selectedList.tasks.filter(
    (task) => !task.complete
  );
  saveAndRenderList();
});

//Deleting currently active list
deleteList.addEventListener('click', (event) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  saveAndRenderList();
});

//Adding new list to 'My Lists'
listForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const listName = listInput.value;
  if (listName == null || listName === '') {
    return;
  } else {
    const list = createList(listName);
    listInput.value = null;
    lists.push(list);
    saveAndRenderList();
  }
});

//Adding new task to selected list
taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskName = taskInput.value;
  if (taskName == null || taskName === '') {
    return;
  } else {
    const task = createTask(taskName);
    taskInput.value = null;
    const selectedList = lists.find(
      (list) => list.id === selectedListId
    );
    selectedList.tasks.push(task);
    saveAndRenderList();
  }
});

//Creating a new list in 'My Lists'
function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

//Creating a new task in the selected list
function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

//Render the lists saved to local storage
function saveAndRenderList() {
  saveList();
  renderLists();
}

//Saving the list and list selected state in 'My Lists' to local storage
function saveList() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_LIST_ID_KEY,
    selectedListId
  );
}

//Render the lists and todos
function renderLists() {
  clearElement(listsContainer);
  renderList();

  const selectedList = lists.find(
    (list) => list.id === selectedListId
  );
  if (selectedListId == null) {
    todoListContainer.style.display = 'none';
  } else {
    todoListContainer.style.display = '';
    todoListTitle.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(taskContainer);
    renderTasks(selectedList);
  }
}

//Render the tasks in selected list
function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(
      taskTemplate.content,
      true
    );
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    taskContainer.appendChild(taskElement);
  });
}

//Render the task count in selected list
function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
  todoListCount.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

//Render the lists in 'My Lists'
function renderList() {
  lists.forEach((list) => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerHTML = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listsContainer.append(listElement);
  });
}

//Clear out the existing lists
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

renderLists();
