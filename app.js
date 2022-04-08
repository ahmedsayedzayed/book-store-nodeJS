// const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');     // Parse Body On Submit Form 
// const exphbs = require('express-handlebars');
const adminRoutes = require('./routes/admin.routes');
const shopRoutes = require('./routes/shop.routes');
const errorController = require('./controllers/error.controller')

const path = require('path');

// app.engine('hbs', exphbs.engine({  // HBS 
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layouts',
//     extname: 'hbs'
// }));   //Not Working

// app.set('view engine','pug') // add pug as templating enging
// app.set('view engine', 'hbs') // add handlebars as templating enging
app.set('view engine', 'ejs') // add eJs as templating enging

app.set('views', 'views') // define the views file and its ./views by default


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

// should be the last one as it not existing routes 
app.use(errorController.get404);


// const routes = require('./routes');
// console.log(routes.someText);
// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);