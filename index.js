var sha256 = require('js-sha256');
const pg = require('pg');

// this is a value that is the same for every user and is throughout the whole app
const SALT = 'banana';

// Initialise postgres client
const config = {
  user: 'akira',
  host: '127.0.0.1',
  database: 'sei22db',
  port: 5432,
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

const cookieParser = require('cookie-parser')
const express = require('express');
const app = express();

// tell your app to use the module
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static('public'))
// this line below, sets a layout look to your express project
const reactEngine = require('express-react-views').createEngine();
app.engine('jsx', reactEngine);

// this tells express where to look for the view files
app.set('views', __dirname + '/views');

// this line sets react to be the default view engine
app.set('view engine', 'jsx');

app.use(cookieParser());

const methodOverride = require('method-override')
app.use(methodOverride('_method'));

///// create a row in the users table

///// registration
// app.get('/users/new', (request, response) => {
app.get('/registration', (request, response) => {
  // send response with some data (a string)
  response.render('users-new');
});

app.post('/registration', (request, response) => {

  // TODO : check to make sure that the name is unique in the db:
  // SELECT * FROM users WHERE name=request.body.name

  // send response with some data (a string)
  response.send("WORKSS");
  let registerQuery = "INSERT INTO users (name, password) VALUES ($1, $2)";

  var hashedPassword = sha256(request.body.password);

  const values = [request.body.name, hashedPassword];

  pool.query(registerQuery, values, (error, result)=>{
    if( error ){
      console.log("ERRRRRRRRRROR");
      console.log(error);
    }
    console.log("YAAAYYYYY");
  })

});

app.get('/login', (request, response) => {
  // send response with some data (a string)
  response.render('login');
});

app.post('/login', (request, response) => {
  console.log(request.body)

  let getUserQuery = "SELECT * FROM users WHERE name=$1";

  const values = [request.body.name];

  pool.query(getUserQuery, values, (error, result)=>{
    if( error ){
      console.log("ERRRRRRRRRROR");
      console.log(error);
    }
    console.log("YAAAYYUUUUUUUYYYYYY");
    console.log("SELECT RESULT:")
    console.log(result.rows);

    // if there is a result in the array
    if( result.rows.length > 0 ){
      // we have a match with the name
      // response.send("heeeyyyy");heeeyyyy

      let requestPassword = request.body.password;

      if(sha256( requestPassword) === result.rows[0].password){

        let user_id = result.rows[0].id;

        // set a secret code in the cookie that we can verify
        var hashedCookie = sha256(SALT + user_id);

        response.cookie('logged in', hashedCookie);
        response.cookie('user_id', user_id);
        response.send("you are you!");
      }else{

        response.status(403);
        response.send("sorry!!!!!!!");
      }

    }else{
      // nothing matched
      response.status(403);
      response.send("sorry!");
    }

  })




  // send response with some data (a string)
});




app.get('/dashboard', (request, response) => {

  let user_id = request.cookies['user_id'];

  let recreatedCookieValue = sha256(SALT + user_id);

  if( request.cookies['logged in'] === recreatedCookieValue ){

    response.send("your dashboard");
  }else{

    response.status(403);
    response.send("not allowed");
  }
});

app.delete('/logout', (request, response)=>{
  response.clearCookie('logged in');
  response.clearCookie('user_id');
  response.send("WOW Delerte");

});







app.get('/', (request, response) => {

  const data = {
    loggedIn : false
  };

 let user_id = request.cookies['user_id'];

  let recreatedCookieValue = sha256(SALT + user_id);

  if( request.cookies['logged in'] === recreatedCookieValue ){
    data.loggedIn = true;
  }

  let getUserQuery = "SELECT * FROM users WHERE id=$1";

  const values = [request.cookies['user_id']];

  pool.query(getUserQuery, values, (error, result)=>{
    data.user = result.rows[0];

    response.render('home', data);
  });


  // send response with some data (a string)
});

app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));