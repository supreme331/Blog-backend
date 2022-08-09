import CommentModel from "../models/Comment.js"
import PostModel from "../models/Post.js";

export const getLastComments = async (req, res) => {
    try {
        const comments = await CommentModel.find().limit(5).exec()

        res.json(comments)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить комментарии'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const comments = await CommentModel.find().exec()

        res.json(comments)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить комментарии'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const commentId = req.params.id
        CommentModel.findOneAndDelete({
            _id: commentId
        }, (err, doc) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: 'Не удалось удалить комментарий'
                })
            }
            if (!doc) {
                return res.status(404).json({
                    message: 'Комментарий не существует'
                })
            }
            res.json({
                success: true
            })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить комментарий'
        })
    }
}

export const create = async (req, res) => {
    try {
        const postId = req.params.id
        const doc = new CommentModel({
            user: req.userId,
            postId: req.body.postId,
            text: req.body.text,
        })

        const comment = await doc.save()

        res.json(comment)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать комментарий'
        })
    }
}

export const update = async (req, res) => {
    try {
        const commentId = req.params.id
        // const postId = req.params.id
        await CommentModel.updateOne({
            _id: commentId
        },{
            user: req.userId,
            postId: req.body.postId,
            text: req.body.text,
        })
        res.json({
            success: true
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось отредактировать комментарий'
        })
    }
}