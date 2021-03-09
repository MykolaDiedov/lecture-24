class List {
    constructor(name) {
        this.name = name;
        this.data = this.initData();
    }
    add(payload) {
        const Object = {
            id: Date.now(),
            ...payload
        };

        this.data.push(Object);
        this.save();
    }
    remove(id) {
        this.data = this.data.filter(e => e.id !== id);
        this.save();
    }
    update(id, payload) {
        this.data = this.data.map(j => {
            if(j.id !== id) {

                return j;
            }

            return {...j, ...payload};
        });
        this.save();
    }
    save () {
        const jsonData = JSON.stringify(this.data);

        localStorage.setItem(this.name, jsonData);
    }
    initData() {
        const jsonData = localStorage.getItem(this.name);

        return JSON.parse(jsonData) || [];
    }
}

class TodoList extends List {

    add(text) {
        const note = {
            isComplete: false,
            value: text
        };

        super.add(note);
    }
    update(id, text) {
        super.update(id, {value: text});
    }
    setNoteComplete(id) {
        this.data = this.data.map(j => {
            if (j.id === id) {
                j.isComplete = true;
            }

            return j;
        });
        this.save();
    }
    get statistic() {
        const complete = this.data.filter(j => Boolean(j.isComplete)).length;

        return {
            complete,
            total: this.data.length
        };
    }
}
const todo = new TodoList('todo');



const addMessage = document.querySelector('.message');
const addButton = document.querySelector('.add');
const task = document.querySelector('.todo');
//const statistic = document.querySelector('.statistic');
const lengthArray = 0;

// функция отоброжения

function showMessages () {

    let showMessage = '';
    if(todo.data.length === lengthArray) task.innerHTML = '';
    todo.data.forEach((item) => {

        showMessage += `
            <li> 
                <input type = 'checkbox' id = '${item.id}' ${item.isComplete ? 'checked' : ''}>
                <label for = '${item.id}'> ${item.value}</label>
                <button class = "delete" id = '${item.id}'>Delete</button>
            </li>
            `;

        task.innerHTML = showMessage;
    });
}
// отоброжение задач после перезагрузки

if(localStorage.getItem('todo')) {
    todo.initData();
    showMessages();
}

// добавление задачи

addButton.addEventListener('click', () => {

    todo.add(addMessage.value);

    showMessages();
});

// пометить как true

task.addEventListener('change', event => {

    const stringIdNote = event.target.id;
    const id = Number(stringIdNote);

    todo.setNoteComplete(id);
});

// удалить задачу (удаляет одну за сессию!!!)


const deleteButton = document.querySelector('.delete');

deleteButton.addEventListener('click', event => {

    const idDelete = Number(event.target.id);

    todo.data.forEach((item) => {
        const idNote = item.id;
        if(item.id === idDelete){
            todo.remove(idNote);
        }

        showMessages();
    });

});

// функция вывода статистики

/*function showStatistic () {
    const f = todo.statistic;



}
showStatistic();
*/