const express = require('express');
const router = express.Router();
const Student = require('../models/Student')
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sessionStore = new session.MemoryStore;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Express session
router.use(cookieParser('secret'));
router.use(session({
    cookie: { maxAge: 3000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
// Connect flash
router.use(flash());
// Global variables
router.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});


//Get all students ->PRIVATE
router.get('/', ensureAuthenticated, (req, res) => {
    Student.find({}).exec((err, students) => {
        if (err) {
            console.log("Error : ", err);
        } else {
            res.render("../views/students/index", { students: students });
            req.flash('success_msg', 'You`re already Logged in !');
        }
    });
});

// // Get single student by id ->PRIVATE
router.get('/show/:id', ensureAuthenticated, (req, res) => {
    Student.findOne({ _id: req.params.id }).exec((err, student) => {
        if (err) {
            console.log("Error : ", err);
        } else {
            res.render("../views/students/show", { student: student });
        }
    });

})

// //create a student ->PRIVATE
router.get("/create", ensureAuthenticated, (req, res) => {
    res.render('students/create')
});


// save student
router.post("/save", (req, res) => {

    Student.findOne({ name: req.body.name })
        .then(student => {
            if (student) {
                req.flash('error_msg', 'Name already Exits');
                return res
                    .status(400)
                    .redirect('/students/create');

            } else {
                const newStudent = new Student({
                    name: req.body.name,
                    address: req.body.address,
                    batch: req.body.batch,
                    work_Experience: req.body.work_Experience
                })
                newStudent
                    .save()
                    .then(student => res.redirect('/students/show/' + student._id))
                    .catch(err => console.log(err));

                req.flash('success_msg', 'Student added!');

            }
        })
        .catch(err => console.log(err));
});
// //Edit student ->PRIVATE
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Student.findOne({ _id: req.params.id }).exec((err, student) => {
        if (err) {
            console.log("Error : ", err);
        } else {
            res.render("../views/students/edit", { student: student })
        }
    });
});

// //Update a student
router.post('/update/:id', (req, res) => {
    Student.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            address: req.body.address,
            batch: req.body.batch,
            work_Experience: req.body.work_Experience
        }

    }, { new: true }, (err, student) => {
        if (err) {
            console.log("Error : ", err);
            res.render("../views/students/edit", { student: req.body });
        }
        req.flash('success_msg', 'Student Detail Updated!');
        res.redirect('/students/show/' + student._id);

    });

})

// // delete student
router.post('/delete/:id', (req, res, next) => {
    Student.remove({ _id: req.params.id }, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success_msg', "Deleted")
            console.log("Student deleted!");
            res.redirect("/students");
        }
    });

});

module.exports = router;