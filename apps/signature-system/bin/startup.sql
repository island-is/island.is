\set db_user `echo $DEV_DB_USER`
\set db_password `echo $DEV_DB_PASS`
\set db_name `echo $DEV_DB_NAME`

CREATE DATABASE :db_name;

CREATE USER :db_user WITH PASSWORD :'db_password';

GRANT ALL PRIVILEGES ON DATABASE :db_name TO :db_user;
