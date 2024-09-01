import {Router} from 'express';
import pool from '../db/dbconnection.js';


const router = Router();


router.get('/',(req,res)=>{
    pool.query(`SELECT * FROM blog`,(err,result)=>{
        if(err){
            throw err;
        }
        res.render('index',{data: result});
    })
})

router.get('/addBlog',(req,res)=>{
    res.render('add.ejs');
})

router.post('/addBlog',(req,res)=>{
    const newBlog = {
        title: req.body.title,
        description: req.body.description,
        status: 'available'
    }
    let sql = `INSERT INTO blog (title, description, status) VALUES (?,?,?)`;
    pool.query(sql,[newBlog.title, newBlog.description, newBlog.status],(err,result)=>{
        if(err){
            throw err;
        }
        res.redirect('/')
    })
})

router.get('/edit/blog/:id', (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM blog WHERE id = ?`;

    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching blog:', err);
            return res.status(500).send('Error fetching blog');
        }

        if (result.length > 0) {
            res.render('edit.ejs', { data: result[0] }); // Pass the first blog entry to the template
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    });
});


router.post('/edit/blog/:id', (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    const sql = `UPDATE blog SET title = ?, description = ? WHERE id = ?`;

    pool.query(sql, [title, description, id], (err, result) => {
        if (err) {
            console.error('Error updating blog:', err);
            return res.status(500).send('Error updating blog');
        }

        res.redirect('/'); // Redirect to the homepage or any other page after updating
    });
});
router.post('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const sql = `DELETE FROM blog WHERE id = ${id}`;

    pool.query(sql, (err, result) => {
        if (err) {
            console.error('Error deleting blog:', err);
            return res.status(500).send('Error deleting blog');
        }

        res.redirect('/'); // Redirect to the homepage or any other page after deleting
    });
});



export default router;