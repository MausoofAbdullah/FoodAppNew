const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs= require('express-handlebars')  
const session=require('express-session')
const mongoose=require('mongoose')



// var indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const adminRouter=require('./routes/admin')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({helpers:{inc:function(value,options){return parseInt(value)+1;}},extname:'hbs',defaultLayout:'user-layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true,},}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
  res.header('Cache-Control','no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0');
  next();
})




app.use(session({
  secret: "secretkey",
  cookie:{maxAge:600000}
}))


mongoose
  .connect("mongodb+srv://MausoofAbdullah2:9686327955@cluster0.79bwqcz.mongodb.net/FoodZone?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{
    console.log("database connected")
  })

app.use('/',usersRouter);
app.use('/admin', adminRouter);

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
