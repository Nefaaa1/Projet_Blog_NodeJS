import connexion from '../config/db.js';
import fs from 'fs';

const pool = connexion();
const port = 5001;
const baseUrl = `http://localhost:${port}`


export const getAll = async(req, res) => {
    try{
        const [rows] = await pool.query('SELECT articles.*, categorie.title as categorie_name FROM articles INNER JOIN categorie ON articles.id_categorie=categorie.id')
        res.render('articles/liste', {articles : rows, baseUrl})
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const getOneForEdit = async(req, res) => {
    const id = req.params.id
    try{
        const [rows] = await pool.query('SELECT articles.*, categorie.title as categorie_name FROM articles INNER JOIN categorie ON articles.id_categorie=categorie.id WHERE articles.id=?', [id])
        const [categories] = await pool.query('SELECT * FROM categorie ')
        res.render('articles/edit', {articles : rows[0], baseUrl, categories})
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const getOne = async(req, res) => {
    const id = req.params.id
    try{
        const [rows] = await pool.query('SELECT articles.*, categorie.title as categorie_name FROM articles INNER JOIN categorie ON articles.id_categorie=categorie.id WHERE articles.id=?', [id])
        const [categories] = await pool.query('SELECT * FROM categorie ')
        res.render('articles/view', {article : rows[0], baseUrl, categories})
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const editArticle = async(req, res) => {
    const { id } = req.params
    const {title, content, picture_alt, id_categorie} = req.body;
    const uploadFile = req.file;
    let sql = "";
    let value =[];
    try{
        if (uploadFile) {
            const picturePath = `public/img/${uploadFile.originalname}`;
            const readStream = fs.createReadStream(req.file.path);
            const writeStream = fs.createWriteStream(picturePath);
            readStream.pipe(writeStream);
            readStream.on('end', () => {
              fs.unlinkSync(req.file.path);
            });
            const picture = uploadFile.originalname ;
            sql = "UPDATE articles SET title=?, content=?, picture_alt=?, id_categorie=?, picture=? WHERE id= ?"
            value =[title, content, picture_alt, id_categorie, picture,id];
        }else{
            sql = "UPDATE articles SET title=?, content=?, picture_alt=?, id_categorie=? WHERE id= ?"
            value =[title, content, picture_alt, id_categorie,id];
        }
        
        await pool.execute(sql, value)
        res.redirect('/articles')
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const addPage = async(req, res) => {
    try{
        const [categories] = await pool.query('SELECT * FROM categorie ')
        res.render('articles/add', { baseUrl, categories})
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const addArticle = async(req, res) => {
    const {title, content, picture_alt, id_categorie} = req.body;
    const uploadFile = req.file;
    let sql = "";
    let value =[];
    try{
        if (uploadFile) {
            const picturePath = `public/img/${uploadFile.originalname}`;
            const readStream = fs.createReadStream(req.file.path);
            const writeStream = fs.createWriteStream(picturePath);
            readStream.pipe(writeStream);
            readStream.on('end', () => {
              fs.unlinkSync(req.file.path);
            });
            const picture = uploadFile.originalname ;
            sql = "INSERT INTO articles (title, content, picture_alt, id_categorie, picture) VALUES (?,?,?,?,?)"
            value =[title, content, picture_alt, id_categorie, picture];
        }else{
            sql = "INSERT INTO articles (title, content, picture_alt, id_categorie) VALUES (?,?,?,?)"
            value =[title, content, picture_alt, id_categorie];
        }
        await pool.execute(sql, value)
        res.redirect('/articles')
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};

export const deleteArticle = async(req, res) => {
    const { id } = req.params
    try{
        const [row] = await pool.execute('SELECT * FROM articles WHERE id= ?', [id]);
        if(row[0].picture != null){
            const pictureName = row[0].picture;
            fs.unlink(`public/img/${pictureName}`, (err) => {
                if (err) {
                    console.error("Erreur lors de la suppression du fichier :", err);
                } else {
                    console.log("Le fichier a été supprimé avec succès.");
                }
            });
        }
        await pool.execute('DELETE FROM articles WHERE id= ?', [id])
        res.redirect('/articles')
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
};





