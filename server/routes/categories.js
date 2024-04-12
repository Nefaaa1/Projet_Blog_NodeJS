import express from 'express';
const router = express.Router();
import connexion from '../config/db.js';
import * as categoriesController from '../controllers/categoriesController.js';

const pool = connexion();
const port = 5001;
const baseUrl = `http://localhost:${port}`


router.get('/categories', categoriesController.getAll )

router.get('/categories/add',categoriesController.addPage)
router.post('/categories/add', categoriesController.addCategorie)

router.get('/categories/edit/:id', categoriesController.getOneForEdit)
router.post('/categories/edit/:id', categoriesController.editCategorie)

router.post('/categorie/delete/:id', categoriesController.deleteCategorie)

export default router;