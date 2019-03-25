import db from './database'

// Connect to the database
db.connect();

import express from 'express'
import bodyParser from 'body-parser'
import { userRoutes, sessionRoutes, timerRoutes } from './routes'

const app = express()

/* Configurations */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

/* The API Endpoints for the REST api */
app.use('/users', userRoutes)
app.use('/sessions', sessionRoutes);
app.use("/timers", timerRoutes)

/* Because why not */
app.use(['/teapot', '/tea', '/pot', '/418'], function(req, res) {
    res.status(418).send("I'm a teapot...")
})

/* 
    The default page... 
    will be replaced with the swagger doc at some point
*/
app.use('*', function(req, res) {
    res.status(404).json({error: "It ough to be there, but it isn't"});
})

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
            "code": 404,
            "error": res.locals.error,
            "message": res.locals.message
        });
});

app.listen(4200, function() {
    console.log("Server running")
})
