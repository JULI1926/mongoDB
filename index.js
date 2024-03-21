const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/prueba');

const noteSchema = new mongoose.Schema(
    {
        content: String,
        date: String,
        important: Boolean,
    }
);

const Note = mongoose.model("pruebas", noteSchema);

app.get('/', (request, response) => {
    response.send('index.html');
});


app.get('/notes/uno', (request, response) => {
    Note.findOne({ content: 'safada' }).then(
        result => {
            response.json(result);
        });
});

app.post('/api/crear', (request, response) => {

    const message = {
        content: 'safada',
        date: 'sdasd',
        important: false,
    };

    Note.create(message).then(
        result => {
            response.status(200).end();
        }).catch(
            error => {
                response.status(400).end();
            })
});

app.get('/api/buscar', (request, response) => {
    Note.find({}).then(
        notes => {
            response.json(notes);
        }
    );

});

app.put('/api/actualizar', (request, response) => {
    Note.findOneAndUpdate({ content: 'safada' }, { important: false })
        .then(
            updatedNote => {
                if (!updatedNote) {
                    return response.status(404).json({ error: 'Nota no encontrada' });
                }
            }).catch(
                error => {
                    console.error("Error:", error);
                    response.status(500).send("Error interno del servidor");
                });
});

app.delete('/api/eliminar', (request, response) => {
    const contentToDelete = 'safada';

    Note.findOneAndDelete({ content: contentToDelete })
        .then(deletedNote => {
            if (!deletedNote) {
                return response.status(404).json({ error: 'Nota no encontrada' });
            };
        })
        .catch(error => {
            console.error("Error:", error);
            response.status(500).send("Error interno del servidor");
        });
});

app.listen(3000, function () {
    console.log('http://localhost:3000')
});