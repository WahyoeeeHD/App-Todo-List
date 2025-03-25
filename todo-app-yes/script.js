// fungsi dari domcontentloaded itu buat menjalankan event ketika semua dom treenya sudah terstruktur baru jalan
document.addEventListener('DOMContentLoaded', () => {
    const submitform = document.getElementById('form');
    submitform.addEventListener('submit', (event) => {
        event.preventDefault();
        addtodo();
    });

    function addtodo(){ 
        const teks = document.getElementById('title').value;
        const tanggal = document.getElementById('date').value;

        const generateid = generateId();
        const todoobject = generateTodoObject(generateid, teks, tanggal, false);
        todos.push(todoobject);

        document.dispatchEvent(new Event(SAVED_EVENT));
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function generateId(){
        return +new Date();
    }

    function generateTodoObject(id, task, waktu, isCompleted){{
        return {
            id,
            task,
            waktu,
            isCompleted,
        };
    }}

    const todos = [];
    const RENDER_EVENT = 'render-todo';

    document.addEventListener(RENDER_EVENT, function () {
        const uncompletedTODOList = document.getElementById('todos');
        uncompletedTODOList.innerHTML = '';
    
        const completedTODOList = document.getElementById('completed-todos');
        completedTODOList.innerHTML = '';
    
        for (const todoItem of todos) {
        const todoElement = maketodo(todoItem);
        if (!todoItem.isCompleted){
            uncompletedTODOList.append(todoElement);
        }
        else{
            completedTODOList.append(todoElement);
        }
        }
    });

    function maketodo(todoobject){
        const judulteks = document.createElement('h2');
        judulteks.innerText = todoobject.task;

        const tanggalteks = document.createElement('p');
        tanggalteks.innerText = todoobject.waktu;

        const penampungteks = document.createElement('div');
        penampungteks.classList.add('inner');
        penampungteks.append(judulteks, tanggalteks);

        const penampungpenampung = document.createElement('div');
        penampungpenampung.classList.add('item', 'shadow');
        penampungpenampung.append(penampungteks);
        penampungpenampung.setAttribute('id', `todo-${todoobject.id}`);
        
        if (todoobject.isCompleted) {
            const undoButton = document.createElement('button');
            undoButton.classList.add('undo-button');
        
            undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoobject.id);
            });
        
            const trashButton = document.createElement('button');
            trashButton.classList.add('trash-button');
        
            trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoobject.id);
            });
        
            penampungpenampung.append(undoButton, trashButton);
        } else {
            const checkButton = document.createElement('button');
            checkButton.classList.add('check-button');
            
            checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoobject.id);
            });
            6
            penampungpenampung.append(checkButton);
        }
        
        return penampungpenampung;
        };

        function addTaskToCompleted (todoId) {
            const todoTarget = findTodo(todoId);
        
            if (todoTarget == null) return;
        
            todoTarget.isCompleted = true;
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        }

    function findTodo(todoId) {
        for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
        }
        return null;
    }

    function removeTaskFromCompleted(todoId){
        const todoTarget = findTodoIndex(todoId);

        if(todoTarget === -1) return;

        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function undoTaskFromCompleted(todoId) {
        const todoTarget = findTodo(todoId);
    
        if (todoTarget == null) return;
    
        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findTodoIndex(todoId) {
        for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    
        return -1;
    }

    function saveData(){
        if(isStorageExist()){ // isstorage belom exist
            const parsed = JSON.stringify(todos);
            localStorage.setItem(STORAGE_KEY, parsed); // storage_key not exist
            document.dispatchEvent(new Event(SAVED_EVENT)); // saved_event not exist
        }
    }

    const STORAGE_KEY = 'TODO_APPS';
    const SAVED_EVENT = 'saved-todo';

    function isStorageExist(){
        if(typeof (Storage) === undefined){
            alert('Maaf browser anda tidak mendukung local maupun session storage');
            return false;
        }
        return true;
    }

    document.addEventListener(SAVED_EVENT, () => {
        const dialog = localStorage.getItem(STORAGE_KEY);
        console.log(dialog);
    });

    function loadDataFromStorage(){
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializedData);

        if(data !== null){
            for(const itemtodo of data){
                todos.push(itemtodo);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if(isStorageExist()){
        loadDataFromStorage();  
    }

});