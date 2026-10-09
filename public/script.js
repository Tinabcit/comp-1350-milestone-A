
const noteForm = document.getElementById('noteForm');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesList = document.getElementById('notesList');
const saveButton = document.getElementById('saveButton');

let editingId = null;

// Display all saved notes
async function loadNotes() {
    const response = await fetch('/api/notes');
    const notes = await response.json();

    notesList.innerHTML = '';

    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';

        const title = document.createElement('h3');
        title.textContent = note.title;

        const content = document.createElement('p');
        content.textContent = note.content;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            noteTitle.value = note.title;
            noteContent.value = note.content;
            editingId = note.id;
            saveButton.textContent = 'Update Note';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteNote(note.id);
        });

        noteDiv.append(title, content, editButton, deleteButton);
        notesList.appendChild(noteDiv);
    });
}

// Add or update a note
noteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const note = {
        title: noteTitle.value,
        content: noteContent.value
    };

    let url = '/api/notes';
    let method = 'POST';

    if (editingId !== null) {
        url = `/api/notes/${editingId}`;
        method = 'PUT';
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
    });

    if (!response.ok) {
        alert('Could not save note.');
        return;
    }

    noteForm.reset();
    editingId = null;
    saveButton.textContent = 'Add Note';

    loadNotes();
});

// Delete a note
async function deleteNote(id) {
    const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Could not delete note.');
        return;
    }

    if (editingId === id) {
        noteForm.reset();
        editingId = null;
        saveButton.textContent = 'Add Note';
    }

    loadNotes();
}

// Load notes when the page opens
loadNotes();
