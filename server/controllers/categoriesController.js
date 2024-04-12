import connexion from '../config/db.js';

const pool = connexion();
const port = 5001;
const baseUrl = `http://localhost:${port}`


export const getAll = async(req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM categorie ')
        res.render('categories/liste', {categories : rows, baseUrl})
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const getOneForEdit = async(req, res) => {
    const id = req.params.id
    try{
        const [categorie] = await pool.query('SELECT * FROM categorie WHERE id=? ', [id])
        res.render('categories/edit', {categorie : categorie[0], baseUrl })
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const editCategorie = async(req, res) => {
    const { id } = req.params
    const {title} = req.body;
    try{
        await pool.execute("UPDATE categorie SET title=? WHERE id= ?", [title,id])
        res.redirect('/categories')
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const addPage = async(req, res) => {
    try{
        res.render('categories/add', { baseUrl})
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const addCategorie = async(req, res) => {
    const {title} = req.body;
    try{
        await pool.execute("INSERT INTO categorie (title) VALUES (?)", [title])
        res.redirect('/categories')
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const deleteCategorie  = async(req, res) => {
    const { id } = req.params
    try{
        await pool.execute('DELETE FROM categorie WHERE id= ?', [id])
        res.redirect('/categories')
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};





