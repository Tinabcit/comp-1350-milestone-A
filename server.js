
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, 'data', 'notes.json');

app.use(express.json());
app.use(express.static('public'));

// Read notes from the JSON file
function getNotes() {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Save notes to the JSON file
function saveNotes(notes) {
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

// Get all notes
app.get('/api/notes', (req, res) => {
    const notes = getNotes();
    res.json(notes);
});

// Add a new note
app.post('/api/notes', (req, res) => {
    const notes = getNotes();

    const newNote = {
        id: Date.now().toString(),
        title: req.body.title,
        content: req.body.content
    };

    notes.push(newNote);
    saveNotes(notes);

    res.json(newNote);
});

// Update a note
app.put('/api/notes/:id', (req, res) => {
    const notes = getNotes();

    const note = notes.find(note => note.id === req.params.id);

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    note.title = req.body.title;
    note.content = req.body.content;

    saveNotes(notes);
    res.json(note);
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
    const notes = getNotes();

    const updatedNotes = notes.filter(note => note.id !== req.params.id);

    if (updatedNotes.length === notes.length) {
        return res.status(404).json({ message: 'Note not found' });
    }

    saveNotes(updatedNotes);
    res.json({ message: 'Note deleted' });
});

// Run Express on localhost only
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
