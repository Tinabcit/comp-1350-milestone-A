
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const filePath = path.join(__dirname, 'data', 'notes.json');

// Check environment variables
const requiredVariables = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'SESSION_SECRET'
];

for (const variable of requiredVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing environment variable: ${variable}`);
    }
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy when deployed
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    state: true
}, (accessToken, refreshToken, profile, done) => {

    const user = {
        id: profile.id,
        displayName: profile.displayName
    };

    return done(null, user);
}));

// Save user to session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Get user from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Check if user is logged in
function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    if (req.path.startsWith('/api/')) {
        return res.status(401).json({
            message: 'Please sign in first'
        });
    }

    return res.redirect('/');
}

// Public CSS
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

// Protected dashboard JavaScript
app.get('/script.js', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'script.js'));
});

// Homepage
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/notes');
    }

    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Google Sign In
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Google OAuth Callback
app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        res.redirect('/notes');
    }
);

// Notes Dashboard
app.get('/notes', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Google Account Information
app.get('/api/me', requireAuth, (req, res) => {
    res.json({
        name: req.user.displayName
    });
});

// Log Out and Redirect to Homepage
app.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }

            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

// Read Notes
function getNotes() {
    if (!fs.existsSync(filePath)) {
        return [];
    }

    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Save Notes
function saveNotes(notes) {
    fs.mkdirSync(path.dirname(filePath), {
        recursive: true
    });

    fs.writeFileSync(
        filePath,
        JSON.stringify(notes, null, 2)
    );
}

// Get Notes for Signed-in User
app.get('/api/notes', requireAuth, (req, res) => {
    const notes = getNotes();

    const userNotes = notes.filter(note =>
        note.userId === req.user.id
    );

    res.json(userNotes);
});

// Add Note
app.post('/api/notes', requireAuth, (req, res) => {
    const notes = getNotes();

    const newNote = {
        id: require('crypto').randomUUID(),
        userId: req.user.id,
        title: req.body.title,
        content: req.body.content
    };

    notes.push(newNote);
    saveNotes(notes);

    res.json(newNote);
});

// Update Note
app.put('/api/notes/:id', requireAuth, (req, res) => {
    const notes = getNotes();

    const note = notes.find(note =>
        note.id === req.params.id &&
        note.userId === req.user.id
    );

    if (!note) {
        return res.status(404).json({
            message: 'Note not found'
        });
    }

    note.title = req.body.title;
    note.content = req.body.content;

    saveNotes(notes);

    res.json(note);
});

// Delete Note
app.delete('/api/notes/:id', requireAuth, (req, res) => {
    const notes = getNotes();

    const note = notes.find(note =>
        note.id === req.params.id &&
        note.userId === req.user.id
    );

    if (!note) {
        return res.status(404).json({
            message: 'Note not found'
        });
    }

    const updatedNotes = notes.filter(note =>
        note.id !== req.params.id
    );

    saveNotes(updatedNotes);

    res.json({
        message: 'Note deleted'
    });
});

// Start Server
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
