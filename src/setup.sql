CREATE DATABASE imdmedata;
USE imdmedata;
CREATE TABLE `user` (id INTEGER PRIMARY KEY AUTO_INCREMENT);
ALTER TABLE `user` ADD email VARCHAR(255) NOT NULL UNIQUE;
ALTER TABLE `user` ADD password TEXT NOT NULL;

CREATE TABLE `watchlist`(
     wl_id INTEGER PRIMARY KEY AUTO_INCREMENT,
     wl_title TEXT NOT NULL,
     user_id INTEGER NOT NULL
      );

CREATE TABLE `movie` (
     movie_id INTEGER PRIMARY KEY AUTO_INCREMENT,
     movie_title TEXT NOT NULL,
     poster_address TEXT NOT NULL,
     parent_watchlist_id INTEGER NOT NULL
     );

ALTER TABLE watchlist
     ADD FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE;
ALTER TABLE movie
     ADD FOREIGN KEY(parent_watchlist_id) REFERENCES watchlist(wl_id) ON DELETE CASCADE;