
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
// Display the signed-in user's name
async function loadUser() {
    const response = await fetch('/api/me');

    if (response.ok) {
        const user = await response.json();

        document.getElementById('welcomeMessage').textContent =
            'Hi ' + user.name + '!';
    }
}

loadUser();

const githubForm = document.getElementById('githubForm');
const githubUsername = document.getElementById('githubUsername');
const githubCalendar = document.getElementById('github-calendar');
const githubStatus = document.getElementById('githubStatus');
const githubButton = document.getElementById('githubButton');

async function loadGitHubCalendar(username) {
    githubCalendar.innerHTML = '';
    githubStatus.textContent = 'Loading';
    githubButton.disabled = true;
    githubButton.textContent = 'Loading';

    try {
        const response = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`
        );

        if (!response.ok) {
            throw new Error('Could not find GitHub contributions.');
        }

        const result = await response.json();

        if (!result.contributions || result.contributions.length === 0) {
            throw new Error('No contributions found.');
        }

        githubCalendar.innerHTML = '';

        const colors = [
            '#ebedf0',
            '#9be9a8',
            '#40c463',
            '#30a14e',
            '#216e39'
        ];

        result.contributions.forEach(day => {
            const square = document.createElement('div');
            square.className = 'contribution-day';
            square.title = `${day.count} contributions on ${day.date}`;
            square.style.backgroundColor = colors[Math.min(day.level, 4)];
            githubCalendar.appendChild(square);
        });
        githubStatus.textContent = `Showing contributions for @${username}`;

    } catch (error) {
        githubStatus.textContent = 'Unable to load contributions. Please check the username and try again.';
        githubCalendar.innerHTML = '';
        console.error('GitHub calendar error:', error);

    } finally {
        githubButton.disabled = false;
        githubButton.textContent = 'Load Contributions';

    }
}

githubForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = githubUsername.value.trim();
    if (!username) return;
    loadGitHubCalendar(username);
});