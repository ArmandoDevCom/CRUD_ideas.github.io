class Element {
    constructor(id, title, date, content) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.content = content;
    }
}

class ElementManager {
    constructor() {
        this.elements = JSON.parse(localStorage.getItem('elements')) || [];
    }

    addElement(title, date, content) {
        const id = Date.now();
        const newElement = new Element(id, title, date, content);
        this.elements.push(newElement);
        this.saveElements();
        return newElement;
    }

    saveElements() {
        localStorage.setItem('elements', JSON.stringify(this.elements));
    }

    getElements() {
        return this.elements;
    }

    deleteElement(id) {
        this.elements = this.elements.filter(element => element.id !== id);
        this.saveElements();
    }

    getElementById(id) {
        return this.elements.find(element => element.id === id);
    }

    updateElement(id, title, date, content) {
        const elementIndex = this.elements.findIndex(element => element.id === id);
        if (elementIndex !== -1) {
            this.elements[elementIndex].title = title;
            this.elements[elementIndex].date = date;
            this.elements[elementIndex].content = content;
            this.saveElements();
        }
    }
}

class Server {
    constructor() {
        this.elementManager = new ElementManager();
    }

    renderElements() {
        const elements = this.elementManager.getElements();
        const elementList = document.getElementById('elementList');
        elementList.innerHTML = '';
        elements.forEach(element => {
            const elementHTML = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${element.title}</h5>
                        <p class="card-text"><strong>Fecha:</strong> ${element.date}</p>
                        <p class="card-text"><strong>Contenido:</strong> ${element.content}</p>
                        <button class="btn btn-primary btn-sm mr-2" onclick="server.editElement(${element.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="server.deleteElement(${element.id})">Eliminar</button>
                    </div>
                </div>
            `;
            elementList.innerHTML += elementHTML;
        });
    }

    deleteElement(id) {
        this.elementManager.deleteElement(id);
        this.renderElements();
    }

    editElement(id) {
        const element = this.elementManager.getElementById(id);
        document.getElementById('editId').value = element.id;
        document.getElementById('title').value = element.title;
        document.getElementById('date').value = element.date;
        document.getElementById('content').value = element.content;
        document.getElementById('elementForm').addEventListener('submit', event => {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const content = document.getElementById('content').value;
            this.elementManager.updateElement(id, title, date, content);
            this.renderElements();
            document.getElementById('elementForm').reset();
            document.getElementById('editId').value = '';
        });
    }

    startServer() {
        document.getElementById('elementForm').addEventListener('submit', event => {
            event.preventDefault();
            const editId = document.getElementById('editId').value;
            if (editId) {
                return; 
            }
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const content = document.getElementById('content').value;
            this.elementManager.addElement(title, date, content);
            this.renderElements();
            event.target.reset();
        });
        window.onload = () => {
            this.renderElements();
        };
    }
}

const server = new Server();
server.startServer();
