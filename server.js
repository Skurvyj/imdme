const express = require('express');
const session = require('express-session')
const path = require('path');
const app = express();
const mysql = require('mysql')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = process.env.PORT || 3000;
const axios =  require('axios');
require('dotenv').config();

//set up express so we can parse json
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


//set up pool connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.SQL_PWORD,
  database: 'imdmedata',
  multipleStatements: true
})

const pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL)


//set up the session
app.use(session({
  secret: 'idk if this matters',
  cookie: { 
    path    : '/',
    httpOnly: false,
    maxAge  : 24*60*60*1000}
}))

/*signs up a new user and then redirects them to their new dashboard*/

app.post('/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //salts and hashes the password, now we store hash
  bcrypt.hash(password, saltRounds, function(err, hash) {
      pool.query({
      sql: 'INSERT INTO user (email, password) VALUES(?, ?); SELECT LAST_INSERT_ID();',
      values:[email, hash],
      }, function(err, result){
       if(err) {
         console.error(err)
         res.send('could not create an account')
         return
       }
       //if we don't err, sign the user up and redirect them
       req.session.uid = result[1][0]['LAST_INSERT_ID()']
       res.redirect('/api/dashboard')

    })

})
});

/*logs the user in and redirects them to the dashboard*/
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
    //getting the user based on their unique email
    pool.query({
          sql: 'SELECT * FROM user WHERE user.email=?',
          values: [email],
      }, function (err, result) {
          if (err || !result[0]) {
              console.error(err)
              res.send('User does not exist')
              return
          }
          const hash = result[0]['password'];
          // If we do not error, then the account exists. Now we check the password with bcrypt
          bcrypt.compare(password, hash, function(err, password_result) {
            //if passwords don't match do not log the user in
            if(err || !password_result){
              console.error(err)
              res.send('Wrong password')
              //if they do match log the user in
            } else {
              req.session.uid = result[0]['id']
              res.redirect('/api/dashboard')
            }
         })    
        })
});

/* handles the creation of a new watchlist, enters the information, creates a watchlist object in an array
and then sends that back to the react app */
app.post('/dashboard/createwatchlist', (req,res) => {
  //makes sure the user is logged in
  if(req.session.uid!= null){
    const title = req.body.title;
      //insert the new watchlist into the database
      pool.query({
        sql: 'INSERT INTO watchlist (wl_title, user_id) VALUES(?, ?); SELECT LAST_INSERT_ID();',
        values: [title, req.session.uid]
      }, function(err, result) {
          if(err){
            console.error(err)
            res.send('Error With Creating Watchlist')
            return
          }
          //if we do not err, find our new watchlist, create an object, return it
          const watchlistID = result[1][0]['LAST_INSERT_ID()'];
          pool.query({
            sql: 'SELECT * FROM watchlist WHERE wl_id=?',
            values: [watchlistID]
          }, function(err, result) {
              if(err){
                console.error(err)
                res.send('Error With Finding Watchlist')
                return
              }
              //creating the object to send back
              watchlist = {
                id: result[0].wl_id,
                wl_title: result[0].wl_title,
                movies: []
              }
              res.json([watchlist]) 
            })        
      })
  } else {
    console.log("user not logged in")
    return
  }

});

/* handles */
app.post('/dashboard/addmovie', (req, res) => {
//makes sure the user is logged in
if(req.session.uid!= null){
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&language=en-US&query=${req.body.title}&page=1&include_adult=false`, { 
    }).then(function(response){
      //returns the first search result and adds it
      //come back and fix this later if there's time so user can choose from a few. (there was not time)

      //theoretically checks if the movie doesn't exist
      if(response.data.results[0] === undefined || response.data.results[0] === null){
        res.send("No such movie")
      }
      const data = response.data.results[0]
      const title = response.data.results[0].title

      //handles case where the movie exists, but there's no poster so it's value isn't null and SQL won't scream
      let posterpath = "404"
      if(response.data.results[0].poster_path !== null)
      {
        posterpath = response.data.results[0].poster_path
      }
      //inserts the movie into the database  
      pool.query({
        sql: 'INSERT INTO movie (movie_title, poster_address, parent_watchlist_id) VALUES(?, ?, ?); SELECT LAST_INSERT_ID();',
        values: [title, posterpath, req.body.wlID]
      }, function(err, result) {
          if(err){
            console.error(err)
            res.send('Error With Creating Movie')
            return
          }
          //if we do not err, create the movie object and return it
          const movieID = result[1][0]['LAST_INSERT_ID()'];
          pool.query({
            sql: 'SELECT * FROM movie WHERE movie_id=?',
            values: [movieID]
          }, function(err, result) {
              if(err){
                console.error(err)
                res.send('Error With Finding Movie')
                return
              }

              movie =  {
                movie_title: result[0].movie_title,
                //sets up the link to the poster from the tmdb database (woo)
                poster_link: 'https://image.tmdb.org/t/p/w500' + result[0].poster_address
                }
              res.json([movie]) 
            })    
      })
    }) 
  }
});

/* just loads the homepage */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

/* just loads the login page */
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

/* just loads the signup page */
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

/*loads the dashboard page if the user is logged in, else redirects to login */
app.get('/dashboard', (req,res) => {
  if(req.session.uid!= null){
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  } else {
    res.redirect('/login')
  }
});

/*Finds, assembles, nicely prepares, and returns all the watchlists and movies in those watchlists
  for a given user if logged in, else doesn't do that */
app.get('/api/dashdata', (req, res) => {
  if(req.session.uid!=null){
      //selects all watchlist ids, titles, userid and movie titles, poster addresses
      //then joins movies to their corresponding watchlists
      //so each instance in the table returned is a movie with the corresponding data
      //left join so that watchlists without movies still get processed
      pool.query({
              sql: `SELECT * FROM (SELECT watchlist.wl_id, watchlist.wl_title, movie.movie_title, movie.poster_address, watchlist.user_id
                    FROM watchlist
                    LEFT JOIN movie ON watchlist.wl_id=movie.parent_watchlist_id) AS userwatchlists
                    WHERE userwatchlists.user_id = ?;`,
              values: [req.session.uid]
          }, function (err, result) {
              if (err) {
                  console.error(err)
                  res.send('An error has occurred')
                  return
              }
              // If we do not error, compile each movie into its correct watchlist in the watchlist array
              let watchlists = []
              for(i = 0; i < result.length; i ++){
                //if we've already encountered this watchlist
                if(watchlists[result[i].wl_id]){
                  watchlists[result[i].wl_id].movies.push({movie_title: result[i].movie_title, poster_link: 'https://image.tmdb.org/t/p/w500' + result[i].poster_address})
                } else {
                  //if we haven't already encountered this watchlist
                  watchlists[result[i].wl_id] = {
                    id: result[i].wl_id,
                    wl_title: result[i].wl_title,
                    movies: result[i].movie_title ? [{
                      movie_title: result[i].movie_title,
                      poster_link: 'https://image.tmdb.org/t/p/w500' + result[i].poster_address
                    }] : []

                  }
                }

              }
              //getting rid of the inevitable garbage in the array
              watchlists = watchlists.filter(wl => wl!==null && wl!==undefined)
              res.json({watchlists})
          }
      )
 
  } else {
    res.send("Not logged in, no data for you")
  }

});

/*handles the redirects from signup/login to dashboard
  still not sure why this was necessary but the entire app broke without it
  I assume it has something to do with the interaction between
  react router and express*/
app.get('/api/dashboard', (req, res) => {
  let userstatus = false;
  if(req.session.uid!= null){
    userstatus = true;
  } else {
    console.log("No such user");
  }
  res.json({userstatus});
});

//listen at the assigned port
app.listen(port);