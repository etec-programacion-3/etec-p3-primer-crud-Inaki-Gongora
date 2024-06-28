import express from 'express';
import bodyParser from 'body-parser';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from 'dotenv';

const app = express();
// Puerto donde se iniciara 
const port = 5050;

config();
// Nombre del archivo de base de datos
const filename = 'database.db'
console.log(filename)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: filename
});

/**
 * Representa un Libro
 * @class Book
 * @extends Model
 * autor - Nombre del Autor
 * isbn - Identificador numerico del libro
 * editorial - Nombre de la editorial 
 * paginas - Número de páginas  
 */
class Book extends Model { }
Book.init({
    autor: DataTypes.STRING,
    isbn: DataTypes.INTEGER,
    editorial: DataTypes.STRING,
    paginas: DataTypes.INTEGER
}, { sequelize, modelName: 'book' });

sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Maneja las solicitudes GET en '/books'
 * @param res - Respuesta de Express
 */
app.get('/books', async (res) => {
    const books = await Book.findAll();
    res.json(books);
});

/**
 * Maneja las solicitudes GET en '/books/:id'
 * @param req - Solicitud de Express (ID)
 * @param res - Respuesta de Express
 */
app.get('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.json(book);
});

/**
 * Maneja las solicitudes POST en '/books'
 * @param req - Solicitud de Express (Datos del nuevo libro)
 * @param res - Respuesta de Express
 */
app.post('/books', async (req, res) => {
    const book = await Book.create(req.body);
    res.json(book);
});

/**
 * Maneja las solicitudes PUT en '/books/:id'
 * Actualiza un libro existente basado en el ID proporcionado.
 * @param req - Solicitud de Express (ID y Datos actualizados, por ejemplo 
 * {"autor": "Tomas",
 * "isbn": 9876543,
 * "editorial": "Perez",
 * "paginas": 40 })
 * @param res - Respuesta de Express
 */
app.put('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.update(req.body);
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Maneja las solicitudes DELETE en '/books/:id'
 * Elimina un libro existente basado en el ID proporcionado
 * @param req - Objeto de solicitud de Express con el parámetro :id.
 * @param res - Objeto de respuesta de Express.
 */
app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await book.destroy();
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

/**
 * Inicia Express en el puerto {port}
 * @param port - Puerto donde se iniciara Express
 */
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});