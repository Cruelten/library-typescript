import express from "express";
import { Router } from "express";
import Books from "../models/books";
import fileMulter from "../middleware/file";  //multer 
import { v4: uuid } from "uuid";
import container from "../container"; //имортируем контейнер 
const router = Router();

router.get('/', async (req, res) => { //получаем все книги
    try {
        const books = await Books.find()
        res.json(books)
    } catch (e) {
        res.status(500).json(e)
    }
});



// router.get('/:id', async (req, res) => { //Получаем книгу по ее ID
//     const {id} = req.params

//     try {
//         const book = await Books.findById(id)
//         res.json(book)
//     } catch (e) {
//         res.status(404).json(e)
//     }
// });


router.get('/:id', async (req, res) => { //Получаем книгу по ее ID. Используем получение данных из контейнера
    const {id} = req.params
    const repo = container.get(BooksRepository);
    try {
        const book = await repo.getBook(id);
        res.json(book)
    } catch (e) {
        res.status(404).json(e)
    }
});


router.post('/', fileMulter.single('kniga-pdf'), async (req, res) => { //создаем книгу
    const {title, description, authors, favorite, fileCover} = req.body
    if(req.file){
        const fileName = req.file.filename
        const newBook = new Books({
            title, 
            description, 
            authors, 
            favorite, 
            fileCover,
            fileName,
        })
        try {
            await newBook.save()
            res.json(newBook)
        } catch (e) {
            res.status(500).json(e)
        }

    } else {
        res.json("Пожалуйста, добавьте файл книги")
    }
    
})




router.put('/:id', async (req, res) => { //редактируем книгу
    const {id} = req.params;
    const {title, description, authors, favorite, fileCover, fileName} = req.body;

    try {
        await Books.findByIdAndUpdate({_id: id}, {
            title, 
            description, 
            authors, 
            favorite, 
            fileCover,
            fileName,
        })
        res.redirect(`/api/books/${id}`)
    } catch (e) {
        res.status(404).json(e)
    }

})

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        await Books.deleteOne({_id: id})
        res.json(true)
    } catch (e) {
        res.status(404).json(e)
    }   
})

export default router;
