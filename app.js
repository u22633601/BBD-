// Get elements from the DOM
const toggleModeBtn = document.getElementById('toggle-mode');
const boardsContainer = document.getElementById('boards-container');
let boards = JSON.parse(localStorage.getItem('boards')) || [];
// Function to retrieve boards from local storage and render them on the page
function renderBoardsFromLocalStorage() {
    boards.forEach(boardData => {
        const boardName = boardData.name;
        createBoard(boardName, boardData);
    });
}

// Function to create a new board
function createBoard(boardName) {
    const board = document.createElement('div');
    board.classList.add('card');
    board.innerHTML = `
        <div class="card-header">
            <div class="board-title">${boardName}</div>
            <div class="completed-checkbox">
            <button class="complete-btn btn btn-success btn-sm">complete</button>
            </div>
        </div>
        <div class="card-body">
            <input type="text" placeholder="Add a to-do item">
            <button class="add-btn">Add</button>
            <ul class="todo-list list-group list-group-numbered"></ul>
        </div>
    `;
    boardsContainer.appendChild(board);
    const boardId = `board_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create an object to represent the board and its items
    const boardData = {
        name: boardName,
        id: boardId,
        items: [], // To store the list of items
        dueDate: '' // To store the due date
    };

    // Save the board data to local storage
    // Check if boards exist in local storage
    let boards = JSON.parse(localStorage.getItem('boards')) || [];

    // Add the new board to the list of boards
    boards.push(boardData);

    // Save updated boards back to local storage
    localStorage.setItem('boards', JSON.stringify(boards));

    // Add event listener for adding to-do items
    const addBtn = board.querySelector('.add-btn');
    const input = board.querySelector('input');
    const todoList = board.querySelector('.todo-list');


    // Function to create delete button for each todo item
    function createDeleteButton(todoItem) {
        const deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete-btn');
        //deleteBtn.className = "btn btn-outline-secondary btn-sm";
        deleteBtn.innerHTML = '&times;'; // 'X' icon
        //deleteBtn.ariaLabel= "Close";
        deleteBtn.addEventListener('click', () => {
            todoItem.remove(); // Delete the todo item
        });
        return deleteBtn;
    }

    const dueDateDisplay = document.createElement('div');
    dueDateDisplay.classList.add('due-date-display');
    board.querySelector('.card-body').prepend(dueDateDisplay);

    // Create the due date picker
    const dueDateBtn = document.createElement('button');
    dueDateBtn.textContent = 'Select Due Date';
    dueDateBtn.classList.add('due-date-btn');
    dueDateBtn.className = 'btn btn-primary btn-sm';
    dueDateBtn.onclick = function () {
        const datePicker = flatpickr(dueDateDisplay, {
            enableTime: false,
            dateFormat: 'Y-m-d',
            onClose: function (selectedDates, dateStr, instance) {
                dueDateDisplay.textContent = `Due Date: ${dateStr}`;
            }
        });
        datePicker.open();
    };
    board.querySelector('.card-body').prepend(dueDateBtn);

    addBtn.addEventListener('click', () => {
        const todoText = input.value.trim();
        if (todoText !== '') {
            const todoItem = document.createElement('li');
            todoItem.className = 'list-group-item';
            todoItem.textContent = todoText;

            const deleteBtn = createDeleteButton(todoItem);
            //const editBtn = createEditButton(todoItem);
            todoItem.prepend(deleteBtn);
            todoList.appendChild(todoItem);
            boardData.items.add(todoText);

            //todoItem.appendChild(dueDateBtn);
            //todoItem.appendChild(editBtn);

            alert(todoText);

            input.value = '';
        }
    });
    // Add event listener to delete todo items
    todoList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            event.target.parentElement.remove(); // Delete the todo item
        }
    });

    // Add event listener to edit todo items
    todoList.addEventListener('dblclick', (event) => {
        if (event.target.tagName === 'LI') {
            const newText = prompt('Edit your todo item:', event.target.textContent);
            if (newText !== null) {
                event.target.textContent = newText;
            }
        }
    });
    // Function to delete a board
    function deleteBoard() {
        // Remove board from the DOM
        board.remove();
        // Remove board from local storage
        removeBoardFromLocalStorage(boardName);
    }


    const deleteBoardBtn = document.createElement('button');
    deleteBoardBtn.textContent = 'Delete Board';
    deleteBoardBtn.className = 'delete-board-btn btn btn-danger btn-sm';
    deleteBoardBtn.onclick = deleteBoard;
    board.querySelector('.card-header').appendChild(deleteBoardBtn);

    // // Get the switch element from the board
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + Math.floor(Math.random() * 14) + 7);
    const formattedDueDate = dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    //const dueDateDisplay = board.querySelector('.due-date-display');
    dueDateDisplay.textContent = `Due Date: ${formattedDueDate}`;

    // Get the complete button element
    const completeBtn = board.querySelector('.complete-btn');

    // Add event listener to the complete button
    completeBtn.addEventListener('click', function () {
        board.classList.add('disabled');
    });

    // Add event listener to enable the board on double click
    board.addEventListener('dblclick', function () {
        board.classList.remove('disabled');
    });
    return newBoard;
}
// Function to remove a board from local storage by name
function removeBoardFromLocalStorage(boardName) {
    // Retrieve boards from local storage
    let boards = JSON.parse(localStorage.getItem('boards')) || [];

    // Find the index of the board to remove
    const indexToRemove = boards.findIndex(board => board.name === boardName);

    if (indexToRemove !== -1) {
        // Remove the board from the array
        boards.splice(indexToRemove, 1);

        // Save the updated boards array back to local storage
        localStorage.setItem('boards', JSON.stringify(boards));
    }
}
// Function to toggle between light and dark mode
function toggleMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    // Toggle todo list styles
    const todoList = document.querySelectorAll('.todo-list, .todo-list li');
    todoList.forEach(item => {
        item.classList.toggle('dark-mode-todo');
    });
    // Save the selected mode in local storage for page refreshes
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
}

// Event listener for toggle mode button
toggleModeBtn.addEventListener('click', toggleMode);

// Check local storage for saved mode and apply it on page load
const isDarkMode = JSON.parse(localStorage.getItem('isDarkMode'));
if (isDarkMode) {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}

// Function to prompt user for board name and create a new board
function createNewBoard() {
    const boardName = prompt('Enter board name:');
    if (boardName) {
        const newBoard = createBoard(boardName);
        boards.push(newBoard);
        saveBoardsToLocalStorage();
    }
}

// Function to save boards to local storage
function saveBoardsToLocalStorage() {
    localStorage.setItem('boards', JSON.stringify(boards));
}

window.addEventListener('load', renderBoardsFromLocalStorage);
// Example: Adding 3 items to specified boards
// createBoard('Work');
// createBoard('Personal');
// createBoard('Meeting');
// createBoard('Project');
// createBoard('Study');
// createBoard('Shopping');
// createBoard('Vacation');
// createBoard('Home');
// const createBoardBtn = document.getElementById('createBoardBtn');
createBoardBtn.addEventListener('click', createNewBoard);


