const express = require('express');
const path = require('path');

const router = require('./routes/routes');
const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname + '/public')))
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use('*', (req, res) => {
    res.redirect('/');
});


app.listen(3000, () => {
    console.log("Server started on port 3000...");
});