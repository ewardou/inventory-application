const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const indexRouter = require('./routes/index');
const gamesRouter = require('./routes/gamesRoute');
const consolesRouter = require('./routes/consolesRoute');

const app = express();
require('dotenv').config();

async function connectToDB() {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected to db');
}
connectToDB().catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(gamesRouter);
app.use(consolesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000, () => console.log('Server started on port 3000'));

module.exports = app;
mongoose.set('strictQuery', false);
