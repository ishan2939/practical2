const express = require('express');
const path = require('path');

const app = express();

app.use(express());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname + '/public')))
app.use(express.urlencoded({extended: true}));

app.listen(3000, () => {
    console.log("Server started on port 3000...");
});