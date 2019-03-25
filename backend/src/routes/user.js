import { Router } from 'express'
import db from './../database'

const { Schemas: { Users }, utils } = db;
const app = Router();

async function getUsers(req, res) {
    Users.find({ ...req.query}, "-__v -password -email", (err, result) => {
        if (err) {
            res.status(417).send({ error: "I have failed you User, I have failed you." })
        } else {
            res.status(200).json(result)
        }
    })
}

async function createUser(req, res) {
    const { username, email, password } = req.body;

    Users.create({ username: username, email: email, password: password}, function(err, result) {
        if (err) {
            res.status(400).send({ error: utils.getErrors(err)})
        } else {
            res.status(201).json(result)
        }
    })
}

async function editUser(req, res) {
    const { id } = req.params;

    if (!utils.isObjectId(id)) {
        res.status(400).json({error: `Given ID is invalid : ${id}`})
        return;
    }

    const { username, password, email} = req.body;

    Users.findByIdAndUpdate(id, { $set: { ...req.body }}, {new: true}, function(err, result) {
        if (err) {
            res.status(400).send({ error: utils.getErrors(err)})
        } else {
            res.status(202).json(result)
        }
    })
}

async function deleteUser(req, res) {
    const { id } = req.params

    if (!utils.isObjectId(id)) {
        res.status(400).json({error: `Given ID is invalid : ${id}`})
        return;
    }

    Users.findByIdAndDelete(id, function(err, result) {
        if (err) {
            res.status(400).send({ error: err})
        } else {
            res.status(202).json(result)
        }
    })
}

app.get('/', getUsers);
app.post('/new', createUser)
app.put('/edit/:id', editUser)
app.delete('/remove/:id', deleteUser)

export default app;