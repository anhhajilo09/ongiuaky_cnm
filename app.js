var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cors = require('cors');

var indexRouter = require('./routes/index');
var sanphamsRouter = require('./routes/sanphams');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/', indexRouter);
app.use('/api/v1/sanphams', sanphamsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    const statusCode = err.status || err.statusCode || 500;
    var status = false;
    if (statusCode == 200)
        status = true;
    res.status(statusCode);
    res.json({ status: status, statusCode: statusCode, message: err.message, errors: err.errors, data: err.data });
});

module.exports = app;