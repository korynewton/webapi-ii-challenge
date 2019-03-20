const express = require('express');

const db = require('../data/db.js')

const router = express.Router();

router.use(express.json());


router.get('/', (req, res) => {
    db.find()
        .then( (posts) => {
            res.status(200).json(posts)   
        } )
        .catch( (error) => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    db.findById(id)
        .then( post => {
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
            else {
                res.status(200).json(post)   
            }
        })
        .catch( err => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.post('/', (req , res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch( err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    db.findById(id)
        .then(post => {
            if (post[0]) {
                db.remove(id)
                    .then( ()  => {
                        res.status(200).json(post[0])
                    })
            }
            else {
                res.status(404).json({ message: "The post with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post could not be removed" })
        })  

        // .then( del => {
        //     if (!del) {
        //         res.status(404).json({ message: "The post with the specified ID does not exist." })
        //     }
        //     else {
        //         res.status(200).json(del)
        //     }
        // })
        // .catch( err => {
        //     res.status(500).json({ error: "The post could not be removed" })
        // })
    
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const { title, contents } = req.body
    const edits = req.body
    if (!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db.update(id, edits)
        .then(editted => {
            if (!editted) {
                return res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
            else {
                db.findById(id)
                    .then(editted => {
                        res.status(200).json(editted)
                    })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be modified." })
        })
})
module.exports = router;