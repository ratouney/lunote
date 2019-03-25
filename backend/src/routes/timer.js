import { Router } from 'express'
import moment from 'moment'
import db from './../database'
import utils from './../utils'

const { Schemas: { Users, Timers }} = db;
const app = Router();

async function getTimers(req, res) {
    const token = utils.extractToken(req);

    if (token == null) {
        res.status(403).json({error: "Missing token"})
        return;
    }

    const tokenData = await utils.jwt.getTokenData(token);

    if (tokenData == null) {
        res.status(403).json({error: "Could not read given token"});
        return;
    }

    const u = await Users.findById(tokenData.userId);

    if (u == null) {
        res.status(400).json({error: "User id from token didn't match"});
        return;
    }

    const { userId } = req.body;

    if (userId && userId != tokenData.userId && u.role == "User") {
        res.status(400).json({error: "Only admins can access other users timers"})
        return;
    }

    if (userId) {
        const target = await Users.findById(userId);

        if (target == null) {
            res.status(400).json({error: "Targeted User not found", id: userId});
            return;
        }

        const tms = await Timers.find({user: u}, "-__v");

        res.status(200).json(tms);
    } else {
        const tmss = await Timers.find({user: tokenData.userId})

        res.status(200).json(tmss);
    }
}

async function createTimer(req, res) {
    const token = utils.extractToken(req);

    /* Once admins are setup, only those can get all tokens 
    if (token == null) {
        res.status(403).json({error: "Missing token"})
        return;
    }
    */

   const tokenData = await utils.jwt.getTokenData(token);

   if (tokenData == null) {
       res.status(403).json({error: "Could not read given token"});
       return;
   }

   const u = await Users.findById(tokenData.userId);

   if (u == null) {
       res.status(400).json({error: "User id from token didn't match"});
       return;
   }

    if (utils.isKeyMissing(req.body, "name", res))
        return;

    const { name } = req.body;

    const dt = await Date.now();

    Timers.create({user: u, name: name, active: false, lastActive: dt, tracked: 0}, function(err, result) {
        if (err) {
            res.status(400).send({ error: db.utils.getErrors(err)})
        } else {
            res.status(201).json(result)
        }
    });
}

async function startTimer(req, res) {
    const token = utils.extractToken(req);

    const tokenData = await utils.jwt.getTokenData(token);

    if (tokenData == null) {
        res.status(403).json({error: "Could not read given token"});
        return;
    }

    const u = await Users.findById(tokenData.userId);

    if (u == null) {
        res.status(400).json({error: "User id from token didn't match"});
        return;
    }

    if (utils.isKeyMissing(req.body, "timerId", res))
        return;

    const { timerId } = req.body;

    const t = await Timers.findById(timerId);

    if (t == null) {
        res.status(400).json({error: "Timer not found", id: timerId})
        return;
    }

    if (t.active == true) {
        res.status(400).json({error: "Timer is already running", id: timerId})
        return;
    }

    const data = {
        active: true,
        lastStarted: Date.now(),
    }

    Timers.findByIdAndUpdate(timerId, {$set: data}, {new: true}, function(err, result) {
        if (err) {
            res.status(400).send({ error: db.utils.getErrors(err)})
        } else {
            res.status(200).json(result)
        }
    })
}

async function stopTimer(req, res) {
    const token = utils.extractToken(req);

    const tokenData = await utils.jwt.getTokenData(token);

    if (tokenData == null) {
        res.status(403).json({error: "Could not read given token"});
        return;
    }

    const u = await Users.findById(tokenData.userId);

    if (u == null) {
        res.status(400).json({error: "User id from token didn't match"});
        return;
    }

    if (utils.isKeyMissing(req.body, "timerId", res))
        return;

    const { timerId } = req.body;

    const t = await Timers.findById(timerId);

    if (t == null) {
        res.status(400).json({error: "Timer not found", id: timerId})
        return;
    }

    if (t.active == false) {
        res.status(400).json({error: "Timer is already stopped", id: timerId})
        return;
    }
    
    /*
    console.log("Matched timer :", t);
    console.log("Started last time : ", t.lastStart.toString())
    */

    const started = moment(t.lastStart);
    const now = moment();

    const timedBefore = t.tracked || 0;
    const trackedNow = now.diff(started);

    /*
    console.log("Timer Started : ", started.toString());
    console.log("Now it's : ", now.toString());
    console.log("Timer already tracked : ", timedBefore);
    console.log("Add to that : ", trackedNow);

    console.log("Total Time Tracked :", timedBefore + trackedNow);
    */

    const data = {
        active: false,
        lastStart: Date.now(),
        tracked: timedBefore + trackedNow,
    }

    Timers.findByIdAndUpdate(timerId, {$set: data}, {new: true}, function(err, result) {
        if (err) {
            res.status(400).send({ error: db.utils.getErrors(err)})
        } else {
            res.status(200).json(result)
        }
    })
}

async function deleteTimer(req, res) {
    const token = utils.extractToken(req);

    const tokenData = await utils.jwt.getTokenData(token);

    if (tokenData == null) {
        res.status(403).json({error: "Could not read given token"});
        return;
    }

    const u = await Users.findById(tokenData.userId);

    if (u == null) {
        res.status(400).json({error: "User id from token didn't match"});
        return;
    }

    if (utils.isKeyMissing(req.body, "timerId", res))
        return;

    const { timerId } = req.body;

    const t = await Timers.findById(timerId).populate('user');

    if (t == null) {
        res.status(400).json({error: "Timer not found", id: timerId})
        return;
    }

    if (t.user._id != u._id && tokenData.role == "User") {
        res.status(403).json({error: "Only Admins can delete other users timers"})
        return;
    }

    Timers.findByIdAndDelete(timerId, function(err, result) {
        if (err) {
            res.status(400).json({error: err});
        } else {
            res.status(200).json(result);
        }
    })
}

app.get('/', getTimers);
app.post('/create', createTimer);
app.put('/start', startTimer);
app.put('/stop', stopTimer);
app.delete('/delete', deleteTimer);

export default app;