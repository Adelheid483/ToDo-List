let todoArray = [];
let progressArray = [];
let doneArray = [];

// записываю в переменные инпуты
let inputValue = document.querySelectorAll('input')[0];
let inputValueDate = document.querySelectorAll('input')[1];

//установка в инпуте текущей даты
//-----------------------------------------------------
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
if (month < 10) month = "0" + month;
if (day < 10) day = "0" + day;
let today = year + "-" + month + "-" + day;
inputValueDate.value = today;

//записываю в переменные все поля для вывода списков
let todoList = document.querySelector('div.project_tasks');
let todoLocal;
let progressList = document.querySelector('div.progress_tasks');
let progressLocal;
let doneList = document.querySelector('div.done_tasks');
let doneLocal;

//записываю в переменные все модальные окна
let modalEnter = document.querySelector('div.modal_back_enter');
let modalAreYouSure = document.querySelector('div.modal_back_sure');
let modalFiveMax = document.querySelector('div.modal_back_five');


// событие на кнопку ADD и клавиша Enter на инпуты
//------------------------
let addButton = document.getElementById('add_id');
addButton.addEventListener('click', validate);
inputValue.addEventListener('keydown', addTaskKeyBoard);
inputValueDate.addEventListener('keydown', addTaskKeyBoard);

function addTaskKeyBoard(event) {
    if (event.keyCode === 13){
        validate ();
    }
}


//функция проверки на заполнение инпута
//-------------------------------------------------
function validate () {
    if (inputValue.value === '') {
        modalEnter.style.display = 'block';
        document.querySelector('div.modal_back_enter button').onclick = function(){
            modalEnter.style.display = 'none';
        };
    }
    else {
        addTask();
        tasksCounter(1);
        addToLocal();
    }
}


// функция добавления задачи в список туду
//-----------------------------------------------
function addTask(){
    //создаю новую строку в списке дел в виде ДИВа
    let todoString = document.createElement('div');
        todoString.className = 'string_todo';

    // создаю текстовые узлы для дела, даты, иконок. Помещаю дело и дату в дивчики
    let pTask = document.createElement('p');
        pTask.className = 'p_italic';
    let divTask = document.createElement('div');
    let pDate = document.createElement('p');
        pDate.className = 'p_italic';
    let iconArrow = document.createElement('i');
        iconArrow.className = 'far fa-arrow-alt-circle-right';
    let iconClose = document.createElement('i');
        iconClose.className = 'fas fa-times-circle';
    let divDateIcons = document.createElement('div');
        divDateIcons.className = 'string_todo_dateicons';

        pTask.append(document.createTextNode(inputValue.value));
        divTask.append(pTask);
        pDate.append(document.createTextNode(`DeadLine: ${inputValueDate.value}`));
        divDateIcons.append(pDate, iconArrow, iconClose);

    // добавляю дивы с делом и датой, иконки в строку списка
    todoString.append(divTask, divDateIcons);
    todoList.append(todoString);

    //очистка инпутов после добавления дела
    inputValue.value = '';
    inputValue.focus();
    inputValueDate.value = today;
}


// перенос из туду и удаление
//------------------------------------
let projectTasks = document.querySelector('div.project_tasks');
projectTasks.addEventListener('click', function (event) {
        //перенос
    if (event.target.className === 'far fa-arrow-alt-circle-right') {
            //проверка на количество задач в процеесе
        let taskToProgress = document.querySelector('div.progress_tasks');
            if(taskToProgress.childElementCount >= 5) {
                    modalFiveMax.style.display = 'block';
                    document.querySelector('div.modal_back_five button').onclick = function(){
                        modalFiveMax.style.display = 'none';
                    };
                return;
            }
        let movedTask = event.target.closest('div.string_todo');
            progressList.append(movedTask);
            addToLocal();
    }
        //удаление
    else if (event.target.className === 'fas fa-times-circle') {
        event.target.closest('div.string_todo').remove();
        addToLocal();
    }
    tasksCounter(1);
    tasksCounter(2);
    addToLocal();
});


//перенос из прогресса и удаление
//-------------------------------------------
let progressTasks = document.querySelector('div.progress_tasks');
progressTasks.addEventListener('click', function (event) {
        //перенос
    if (event.target.className === 'far fa-arrow-alt-circle-right') {
        let movedTask = event.target.closest('div.string_todo');
        doneList.append(movedTask);
        addToLocal();
    }
        //удаление с подтверждением
    else if (event.target.className === 'fas fa-times-circle') {
        modalAreYouSure.style.display = 'block';
        document.querySelectorAll('div.modal_back_sure button')[0].onclick = function (){
            event.target.closest('div.string_todo').remove();
            modalAreYouSure.style.display = 'none';
            tasksCounter(2);
            addToLocal();
        };
            //отмена удаления
        document.querySelectorAll('div.modal_back_sure button')[1].onclick = function () {
            modalAreYouSure.style.display = 'none';
        };
    }
    tasksCounter(2);
    tasksCounter(3);
    addToLocal();
});


//возврат из выполненного и удаление
//-------------------------------------------
let doneTasks = document.querySelector('div.done_tasks');
doneTasks.addEventListener('click', function (event) {
        //возврат
    if (event.target.className === 'far fa-arrow-alt-circle-right') {
        let movedTask = event.target.closest('div.string_todo');
        todoList.append(movedTask);
        addToLocal();
    }
        //удаление
    else if (event.target.className === 'fas fa-times-circle') {
        event.target.closest('div.string_todo').remove();
        addToLocal();
    }
    tasksCounter(3);
    tasksCounter(1);
    addToLocal();
});


// CLEAR ALL - кнопки очистки списков, у второй - модалка с подтверждением
//-------------------------------------
let clearButtons = document.querySelectorAll('div.project_button_clear > button');
for (let i=0; i<clearButtons.length; i++) {
    if (i === 0) {
        clearButtons[i].addEventListener('click', function () {
            document.querySelector('div.project_tasks').innerHTML = '';
            tasksCounter(1);
            addToLocal();
        })
    }
    else if (i === 1) {
        clearButtons[i].onclick = function () {
            modalAreYouSure.style.display = 'block';

            document.querySelectorAll('div.modal_back_sure button')[0].onclick = function () {
                document.querySelector('div.progress_tasks').innerHTML = '';
                modalAreYouSure.style.display = 'none';
                tasksCounter(2);
                addToLocal();
            };
            document.querySelectorAll('div.modal_back_sure button')[1].onclick = function () {
                modalAreYouSure.style.display = 'none';
            };
        };
    }
    else if (i === 2) {
        clearButtons[i].addEventListener('click', function () {
            document.querySelector('div.done_tasks').innerHTML = '';
            tasksCounter(3);
            addToLocal();
        });
    }
}


// СЧЁТЧИК ЗАДАЧ В СПИСКАХ
//----------------------------------
function tasksCounter(index) {
    if(index === 1) {
        let todoString = document.querySelector('div.project_tasks');
        document.querySelectorAll('div.project_list_title p')[1].innerHTML = `Total Tasks: ${todoString.childElementCount}`;
    }
    else if(index === 2) {
        let todoString = document.querySelector('div.progress_tasks');
        document.querySelectorAll('div.project_list_title p')[3].innerHTML = `Total Tasks: ${todoString.childElementCount}`;
    }
    else if(index === 3) {
        let todoString = document.querySelector('div.done_tasks');
        document.querySelectorAll('div.project_list_title p')[5].innerHTML = `Total Tasks: ${todoString.childElementCount}`;
    }
}


// работа с Local Storage
//----------------------------------------------------
function addToLocal() {
    todoLocal = todoList.innerHTML;
    localStorage.setItem('todoLocal', todoLocal);

    progressLocal = progressList.innerHTML;
    localStorage.setItem('progressLocal', progressLocal);

    doneLocal = doneList.innerHTML;
    localStorage.setItem('doneLocal', doneLocal);
}

if (localStorage.getItem('todoLocal')) {
    todoList.innerHTML = localStorage.getItem('todoLocal');
    tasksCounter(1);
}
if (localStorage.getItem('progressLocal')) {
    progressList.innerHTML = localStorage.getItem('progressLocal');
    tasksCounter(2);
}
if (localStorage.getItem('doneLocal')) {
    doneList.innerHTML = localStorage.getItem('doneLocal');
    tasksCounter(3);
}











