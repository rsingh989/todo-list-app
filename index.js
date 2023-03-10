const listsContainer = document.querySelector('[data-lists]');
const listForm = document.querySelector('[data-list-form]');
const listInput = document.querySelector('[data-list-input]');
const deleteList = document.querySelector('[data-delete-list]');

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

//Creating a new list in 'My Lists'
function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

//Render the lists saved to local storage
function saveAndRenderList() {
  saveList();
  renderList();
}

//Saving the list and list selected state in 'My Lists' to local storage
function saveList() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_LIST_ID_KEY,
    selectedListId
  );
}

//Render the lists in 'My Lists'
function renderList() {
  clearElement(listsContainer);
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

renderList();
