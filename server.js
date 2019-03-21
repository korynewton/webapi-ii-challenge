const express = require('express');

const postsRouter = require('./routes/posts-router')

const server = express();

server.get('/', (req, res) => {
    res.send("connected")
})

server.use('/api/posts', postsRouter)

module.exports = server;