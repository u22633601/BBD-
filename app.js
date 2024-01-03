// Get elements from the DOM
const toggleModeBtn = document.getElementById('toggle-mode');
const boardsContainer = document.getElementById('boards-container');



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

            //todoItem.appendChild(dueDateBtn);
            //todoItem.appendChild(editBtn);


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
    // const switchInput = board.querySelector('.form-check-input');
    // Realistic due date for each board
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + Math.floor(Math.random() * 14) + 7);
    const formattedDueDate = dueDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    //const dueDateDisplay = board.querySelector('.due-date-display');
    dueDateDisplay.textContent = `Due Date: ${formattedDueDate}`;

    // // Function to handle the toggle switch
    // switchInput.addEventListener('change', function () {
    //     const isChecked = switchInput.checked;
    //     if (isChecked) {
    //         // Disable the board or add a disabled class
    //         board.classList.add('disabled');
    //     } else {
    //         // Enable the board
    //         board.classList.remove('disabled');
    //     }
    // });


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
    // Add three realistic items to each board
    //const todoList = board.querySelector('.todo-list');
    for (let i = 0; i < 3; i++) {
        const todoItem = document.createElement('li');
        todoItem.className = 'list-group-item';
        todoItem.textContent = generateRealisticTask(boardName);
        const deleteBtn = createDeleteButton(todoItem);
        //const editBtn = createEditButton(todoItem);
        todoItem.prepend(deleteBtn);

        todoList.appendChild(todoItem);
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
        createBoard(boardName);
    }
}

// Function to generate realistic task names based on the board name
function generateRealisticTask(boardName) {
    // Define realistic task names based on the board name or any other logic
    const realisticTasks = {
        'Work': ['Prepare presentation', 'Review reports', 'Schedule meetings'],
        'Personal': ['Call family', 'Go for a run', 'Read a book'],
        'Meeting': ['Prepare agenda', 'Send invites', 'Review previous meeting notes'],
        'Project': ['Define milestones', 'Develop wireframes', 'Code implementation'],
        'Study': ['Read research papers', 'Write essay', 'Solve practice problems'],
        'Shopping': ['Groceries', 'Clothing', 'Household items'],
        'Vacation': ['Book flights', 'Plan itinerary', 'Pack luggage'],
        'Home': ['Clean the house', 'Organize closet', 'Fix leaking faucet']
    };

    // Get realistic tasks based on the boardName
    const tasks = realisticTasks[boardName];
    if (tasks) {
        return tasks[Math.floor(Math.random() * tasks.length)];
    } else {
        return 'Generic task';
    }
}

// Rest of your existing code...

// Example: Adding 3 items to specified boards
createBoard('Work');
createBoard('Personal');
createBoard('Meeting');
createBoard('Project');
createBoard('Study');
createBoard('Shopping');
createBoard('Vacation');
createBoard('Home');
const createBoardBtn = document.getElementById('createBoardBtn');
createBoardBtn.addEventListener('click', createNewBoard);


