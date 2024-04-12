import express from 'express';
const router = express.Router();
import connexion from '../config/db.js';
import * as articlesController from '../controllers/articlesController.js';
import multer from 'multer';
const upload = multer({ dest: 'public/temp/' });

const pool = connexion();
const port = 5001;
const baseUrl = `http://localhost:${port}`

router.get('/', async(req, res) => {
    try{
        const [rows] = await pool.query('SELECT articles.*, categorie.title as categorie_name FROM articles INNER JOIN categorie ON articles.id_categorie=categorie.id ORDER BY creation DESC LIMIT 3')
        res.render('index', {articles : rows, baseUrl})
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
})

router.get('/articles', articlesController.getAll )

router.get('/articles/add',articlesController.addPage)
router.post('/articles/add', upload.single('picture'), articlesController.addArticle)

router.get('/articles/edit/:id', articlesController.getOneForEdit)
router.post('/articles/edit/:id', upload.single('picture'), articlesController.editArticle )

router.get('/article/:id', articlesController.getOne)

router.post('/article/delete/:id', articlesController.deleteArticle)

export default router;