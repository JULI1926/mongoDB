const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/prueba');

const schemaNote = new mongoose.Schema(
    {
        id: Number,
        content: String,
        date: String,
        important: Boolean,
    }
);

const Note = mongoose.model("pruebas", schemaNote);

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
        id: 15,
        content: 'popeye el marino',
        date: 'asd',
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
    const query = {}; // Objeto para almacenar los criterios de búsqueda

    // Verifica si se proporciona el parámetro 'content' en la consulta
    if (request.query.content) {
        query.content = request.query.content; // Añade el contenido de búsqueda al objeto de consulta
    }

    // Verifica si se proporciona el parámetro 'important' en la consulta
    if (request.query.important) {
        query.important = request.query.important; // Añade el estado de importancia de búsqueda al objeto de consulta
    }

    // Busca notas en la base de datos con los criterios de búsqueda
    Note.find(query)
        .then(notes => {
            response.json(notes); // Envía las notas encontradas como respuesta
        })
        .catch(error => {
            console.error(error); // Maneja cualquier error que ocurra durante la búsqueda
            response.status(500).json({ error: 'Hubo un error al buscar notas' });
        });
});

app.put('/api/actualizar', (request, response) => {
    Note.findOneAndUpdate({ content: 'popeye el marino' }, { date: 'oliva y popeye se lo comen' })
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
    const contentToDelete = 'true';

    Note.findOneAndDelete({ important: contentToDelete })
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