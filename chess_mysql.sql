-- Borrar BD
-- DROP DATABASE IF EXISTS chess_db;

-- create database
CREATE DATABASE chess_db;

use chess_db;

create table plays(
	id int auto_increment NOT NULL,
    mov_len int,
    end_game boolean,
    game_len int,
    x_axis int,
    y_axis int,
    playerplays_type varcharacter(2),
    depth int,
    winner varcharacter(10),
    end_game_mode varcharacter(22),
    primary key(id)
);

Select max(id) from plays;

Select * from plays LIMIT 50000;

SELECT * FROM plays ORDER BY id DESC LIMIT 50000;

Select sum(mov_len) from plays;

-- DELETE FROM plays Where id>49272;

Select mov_len from plays order by mov_len desc;

Select game_len from plays order by game_len desc;

Select avg(game_len) from plays;

Select * from plays where winner<>'';

-- Test Query
Select end_game_mode,count(playerplays_type) 
from plays 
where winner<>'' and game_len>1 and game_len<633 and depth=0 and playerplays_type="M2"
group by end_game_mode;
