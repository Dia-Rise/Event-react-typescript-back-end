const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

//Modules used to create sessions and cookies.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session');

//Encryption modules, Used to protect passwords.
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');


//automaticly pass every app function through express
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
    'Access-Control-Allow-Origin': "*"
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Set session details
app.use(session({
    key: "userID",
    secret: "fart", //could be anything
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}));


//database details - SQL
const db = mysql.createConnection({
    user: "admin",
    host: "localhost",
    password: "admin",
    database: "shv2"
});

//----//

//!register users to site - START
app.post('/register', (req, res) => {
    //define variable given from react front end form
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const registeredAt = new Date();
    const lastLogin = new Date();
    //encrypt password and pass it into the database
    bcrypt.hash(password, saltRounds, (err, hash) => {
        //Grab error if one occers
        if (err) {
            console.log(err);
        }
        
        //inserts details into database using SQL.
        db.query("INSERT INTO user (firstName, lastName, email, passwordHash, registeredAt, lastLogin) VALUES (?,?,?,?,?,?)", [firstName, lastName, email, hash, registeredAt, lastLogin], (err, result) => {
            db.query("SELECT * FROM user WHERE email = ?;", email, (err, result) => {
                if (err) {
                    res.send({
                        err: err
                    });
                }
                //If a match is found and it's not empty = success, otherwise user doesn't exist
                if (result.length > 0) {
                    //compare the password on the database with the password in the input field.
                            req.session.user = result;

                            const id = result[0].id;
                            const firstName = result[0].firstName;
                            const lastName = result[0].lastName
                            const token = jwt.sign({
                                id
                            }, "envFile", {
                                expiresIn: 300,
                            });
        
                            req.session.user = result;
                            const lastLogin = new Date();
                            db.query("UPDATE user SET lastLogin = ? WHERE id = ?", [lastLogin, id], (err, result) => {
                                console.log(err);
                            });
        
                            res.json({
                                auth: true,
                                login: true,
                                token: token,
                                result: result,
                                response: {
                                    id: id,
                                    user: email,
                                    firstName: firstName,
                                    lastName: lastName
                                }
                            }); //success
                } else {
                    res.json({
                        auth: false,
                        login: false,
                        message: "no user exist"
                    }); // fail 
                }
            });
        });
    });
});
//!register users to site - END  

//----//

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"]

    if (!token) {
        res.send("We need a token, try again in the future");
    } else {
        jwt.verify(token, "envFile", (err, decoded) => { //! ENV FILE
            if (err) {
                res.json({
                    auth: false,
                    message: "U FAILED"
                });
            } else {
                req.userId = decoded.id;
                next();
            }
        })
    }
}

app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.json({
        auth: true,
        userID: req.userId
    })
})

//--//

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({
            loggedIn: true,
            user: req.session.user
        });
    } else {
        res.send({
            loggedIn: false
        });
    }
});

//--//

//!Log in the site - START
app.post('/login', (req, res) => {
    //define variable given from react front end form
    const email = req.body.email
    const password = req.body.password

    //finds matching details from database using SQL.
    db.query("SELECT * FROM user WHERE email = ?;", email, (err, result) => { //!DB QUERY START
        //Grab error if one occers

        if (err) {
            res.send({
                err: err
            });
        }
        //If a match is found and it's not empty = success, otherwise user doesn't exist
        if (result.length > 0) {
            //compare the password on the database with the password in the input field.
            bcrypt.compare(password, result[0].passwordHash, (error, response) => {

                if (response) {
                    req.session.user = result;

                    const id = result[0].id;
                    const firstName = result[0].firstName;
                    const lastName = result[0].lastName
                    const token = jwt.sign({
                        id
                    }, "envFile", {
                        expiresIn: 300,
                    });

                    req.session.user = result;
                    const lastLogin = new Date();
                    db.query("UPDATE user SET lastLogin = ? WHERE id = ?", [lastLogin, id], (err, result) => {
                        console.log(err);
                    });

                    res.json({
                        auth: true,
                        login: true,
                        token: token,
                        result: result,
                        response: {
                            id: id,
                            user: email,
                            firstName: firstName,
                            lastName: lastName
                        }
                    }); //success
                } else {
                    res.json({
                        auth: false,
                        login: false,
                        message: "wrong user/password"
                    }); // fail
                }
            });
        } else {
            res.json({
                auth: false,
                login: false,
                message: "no user exist"
            }); // fail 
        }
    }); //! BD QUERY END 
});
//!Log in the site - END

//----//


app.post('/createEvent', (req, res) => {
    //define variable given from react front end form
    const creatorId = req.body.creatorId;
    const title = req.body.title;
    const summary = req.body.summary;
    const eventDate = req.body.eventDate;
    const eventTime = req.body.eventTime;
    const date = new Date();

    //inserts details into database using SQL.
    db.query("INSERT INTO events (createdBy, title, summary, eventDate, eventTime, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)", [creatorId, title, summary, eventDate, eventTime, date, date], (err, result) => {
        console.log(err);
    });

});

app.get('/getEvents', (req, res) => {
    db.query("SELECT * FROM events", (err, result) => {
        if (err) {
            res.send({
                err: err
            })
        }
        res.json({
            result: result,
        });
    });
});

app.post('/getAttendingEvents', (req, res) => {
    const user_Id = req.body.user_Id;
    let events = [];
    db.query("SELECT * FROM event_member WHERE userId = ?", [user_Id], (err, result) => {
        if (err) {
            res.send({
                err: err
            })
        }
        const list = result;
        let counter = 0
        list.forEach((e, i) => {
            db.query("SELECT * FROM events WHERE id = ?", [list[i].eventId], (err, result) => {
                if (err) {
                    res.send({
                        err: err
                    })
                }
                events.push(result[0]);
                counter++;
                if (counter == list.length) {
                    res.json(events);
                }
            });

        });
        // res.json(result);
    });
});

app.post('/getSelectedEvent', (req, res) => {
    const selectedEventId = req.body.selectedEvent;
    db.query("SELECT * FROM events WHERE id = ?", [selectedEventId], (err, result) => {
        if (err) {
            res.send({
                err: err
            })
        }
        res.json(result);
    });
});

app.post('/deleteEvent', (req, res) => {
    const event_Id = req.body.event_Id;
    db.query("DELETE FROM event_member WHERE eventId = ?", [event_Id], (err, result) => {
        db.query("DELETE FROM events WHERE id = ?", [event_Id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("success");
            }
        });
    });
});


app.post('/addAttendee', (req, res) => {
    const userId = req.body.userId;
    const event_Id = req.body.event_Id;
    const date = new Date();
    db.query("INSERT INTO event_member (eventId, userId, type, createdAt, updatedAt) VALUES (?,?,?,?,?)", [event_Id, userId, "0", date, date], (err, result) => {
        if (err) {
            res.send({
                err: err
            })
        }
        res.send({ 
            isAttending: true
        });
    });
});

app.post('/checkAttend', (req, res) => {
    const user_Id = req.body.user_Id;
    const event_Id = req.body.event_Id;
    db.query("SELECT * FROM event_member WHERE userId = ? AND eventId = ?", [user_Id, event_Id], (err, result) => {
        if (err) {
            res.send({
                err: err
            })
        }
        if (result.length > 0) {
            res.send({
                isAttending: true
            });
        } else {
            res.send({
                isAttending: false 
            });
        }
    });
});

app.post('/unAttend', (req, res) => {
    const user_Id = req.body.user_Id;
    const event_Id = req.body.event_Id;
    db.query("DELETE FROM event_member WHERE userId = ? AND eventId = ?", [user_Id, event_Id], (err, result) => {
        if (err) {
            res.send({
                err: err
            })
        }
        res.send({
            isAttending: false
        });
    });
});

app.post('/getAttendees', (req, res) => {
    const event_Id = req.body.event_Id;
    let attendees = [];
    db.query("SELECT * FROM event_member WHERE eventId = ?", [event_Id], (err, result) => {
        if (err) {
            res.send({
                err: err
            })
        }
        const list = result;
        let counter = 0
        list.forEach((e, i) => {
            db.query("SELECT * FROM user WHERE id = ?", [list[i].userId], (err, result) => {
                if (err) {
                    res.send({
                        err: err
                    }) 
                }
                
                const info = {
                    id: result[0].id,
                    firstName: result[0].firstName,
                    lasttName: result[0].lastName,
                }
                attendees.push(info);
                counter++;
                if (counter == list.length) {
                    res.json(attendees); 
                }
            });

        });
        // res.json(result);
    });
});












//--//

//run app on port 3001 from localhost
app.listen(3001, () => {
    console.log("Server running... on port 3001")
});