import express from "express";
import expressLayout from "express-ejs-layouts"
import connexion from './server/config/db.js';
import articlesRoute from './server/routes/articles.js';
import categoriesRoute from './server/routes/categories.js';


const app = express();
const port = 5001;

const pool = connexion();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');


app.use('/', articlesRoute);
app.use('/', categoriesRoute);

app.listen(port, ()=>{
    console.log(`Serveur lancé sur le port ${port} !`);
})