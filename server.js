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


//`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&language=en-US&query=${values.title}&page=1&include_adult=false`

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.SQL_PWORD,
  database: 'imdmedata',
  multipleStatements: true
})


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
       req.session.uid = result[1][0]['LAST_INSERT_ID()']
       res.redirect('/api/dashboard')

    })

})
});

/*logs the user in */
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
            //if passwords don't match
            if(err || !password_result){
              console.error(err)
              res.send('Wrong password')
              //if they do match
            } else {
              req.session.uid = result[0]['id']
              res.redirect('/api/dashboard')
            }
         })    
        })
});

app.post('/dashboard/createwatchlist', (req,res) => {
  if(req.session.uid!= null){
    const title = req.body.title;
      pool.query({
        sql: 'INSERT INTO watchlist (wl_title, user_id) VALUES(?, ?); SELECT LAST_INSERT_ID();',
        values: [title, req.session.uid]
      }, function(err, result) {
          if(err){
            console.error(err)
            res.send('Error With Creating Watchlist')
            return
          }

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

              watchlist = {
                id: result[0].wl_id,
                wl_title: result[0].wl_title,
                movies: []
              }
              res.json([watchlist]) 
            })        
      })
  } else {
    console.log("something has gone terribly wrong")
    return
  }

});

app.post('/dashboard/addmovie', (req, res) => {
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_KEY}&language=en-US&query=${req.body.title}&page=1&include_adult=false`, { 
  }).then(function(response){
    //returns the first search result and adds it
    //come back and fix this later if there's time so user can choose from a few
    const data = response.data.results[0]
    const title = response.data.results[0].title
    const posterpath = response.data.results[0].poster_path
    pool.query({
      sql: 'INSERT INTO movie (movie_title, poster_address, parent_watchlist_id) VALUES(?, ?, ?); SELECT LAST_INSERT_ID();',
      values: [title, posterpath, req.body.wlID]
    }, function(err, result) {
        if(err){
          console.error(err)
          res.send('Error With Creating Movie')
          return
        }
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
              poster_link: 'https://image.tmdb.org/t/p/w500' + result[0].poster_address
              }
            res.json([movie]) 
          })    
    })
  }) 
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.get('/dashboard', (req,res) => {
  if(req.session.uid!= null){
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  } else {
    res.redirect('/login')
  }
});

app.get('/api/dashdata', (req, res) => {
  if(req.session.uid!=null){
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
              // If we do not error, compile watchlists
              let watchlists = []
              for(i = 0; i < result.length; i ++){
                if(watchlists[result[i].wl_id]){
                  watchlists[result[i].wl_id].movies.push({movie_title: result[i].movie_title, poster_link: 'https://image.tmdb.org/t/p/w500' + result[i].poster_address})
                } else {
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
              watchlists = watchlists.filter(wl => wl!==null && wl!==undefined)
              res.json({watchlists})
          }
      )
 
  } else {
    res.send("Not logged in, no data for you")
  }

});

//handles the redirects from signup/login to dashboard
app.get('/api/dashboard', (req, res) => {
  let userstatus = false;
  if(req.session.uid!= null){
    userstatus = true;
  } else {
    console.log("No such user");
  }
  res.json({userstatus});
});

app.listen(port);