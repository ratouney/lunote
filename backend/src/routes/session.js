import { Router } from 'express'
import db from './../database'
import utils from './../utils'

const { Schemas: { Users, Sessions } } = db;
const app = Router();

async function getSession(req, res) {
    Sessions.find({ ...req.query}, "-__v", (err, result) => {
        if (err) {
            res.status(417).send({ error: "I have failed you User, I have failed you." })
        } else {
            res.status(200).json(result)
        }
    })
}

async function createSession(req, res) {
    const { email, password, deviceName } = req.body;

    if (utils.isKeyMissing(req.body, "email", res))
        return;

    var u = await Users.findOne({email: email});

    if (u == null) {
        res.status(400).json({error: "User not found"})
        return;
    }

    if (utils.isKeyMissing(req.body, "password", res))
        return;

    if (u.password != password) {
        res.status(403).json({error: "Invalid password"})
        return;
    }

    if (utils.isKeyMissing(req.body, "deviceName", res))
        return;

    const token = utils.jwt.createToken({username: u.username, role: u.role, id: u._id});

    var s = await Sessions.findOne({user: u, deviceName: deviceName});

    if (s == null) {
        // No session exists currently, create one...

        const data = {
            userId: u._id,
            username: u.username,
        };

        const token = await utils.jwt.createToken(data);

        Sessions.create({user: u, deviceName: deviceName, jwt: token}, function(err, result) {
            if (err) {
                res.status(400).json({error: db.utils.getErrors(err)});
            } else {
                res.status(201).json({token: token})
            }
        })
    } else {
        // A session already exists for the given user/device

        // return the already existing token

        res.status(200).json({token: s.jwt});
    }
}

async function deleteSession(req, res) {
    
    if (utils.isKeyMissing(req.body, "token", res))
        return;

    const { token } = req.body;

    Sessions.findOneAndDelete({jwt: token}, function(err, result) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            if (result == null) {
                res.status(400).json({error: "Token not found", token: token});
            } else {
                res.status(200).json(result);
            }
        }
    });
}

app.get('/', getSession);
app.post('/login', createSession);
app.delete('/logout', deleteSession);

export default app;