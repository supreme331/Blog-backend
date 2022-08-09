import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'
import {commentCreateValidation, loginValidation, postCreateValidation, registerValidation} from "./validations.js"
import {checkAuth, handleValidationErrors} from './utils/index.js'
import {UserController, PostController, CommentController} from './controllers/index.js'

mongoose.connect('mongodb+srv://admin:qqqqqq@cluster0.nzksxgp.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.authMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.get('/comments', CommentController.getAll)
app.post('/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create)
app.patch('/comments/:id', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.update)
app.delete('/comments/:id', checkAuth, CommentController.remove)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server OK')
})