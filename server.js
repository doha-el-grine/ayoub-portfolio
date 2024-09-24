const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve your HTML file

// Ensure contacts.json exists
const contactsFilePath = path.join(__dirname, 'contacts.json');
if (!fs.existsSync(contactsFilePath)) {
    fs.writeFileSync(contactsFilePath, JSON.stringify([]));
}

app.post('/submit', (req, res) => {
    const data = req.body;

    // Basic validation
    if (!data.fullName || !data.email || !data.phone || !data.subject || !data.message) {
        return res.status(400).send('All fields are required.');
    }

    fs.readFile(contactsFilePath, 'utf8', (err, jsonData) => {
        if (err) {
            return res.status(500).send('Error reading contacts data.');
        }

        let contacts;
        try {
            contacts = JSON.parse(jsonData);
        } catch (parseErr) {
            return res.status(500).send('Error parsing contacts data.');
        }

        contacts.push(data);
        fs.writeFile(contactsFilePath, JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving data.');
            }
            res.json(data);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
