import { connect } from './database'

// Connect to the database
connect();

import express from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(['/teapot', '/tea', '/pot', '/418'], function(req, res) {
    res.status(418).send("I'm a teapot...")
})

app.use("/", function(req, res) {
    console.log("Hello there");
    res.json({cyka: "blyat"})
})

app.listen(4200, function() {
    console.log("Server running")
})