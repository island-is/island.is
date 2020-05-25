\set db_user `echo $DB_USER`
\set db_password `echo $DB_PASS`
\set db_name `echo $DB_NAME`
\set test_db_user `echo $TEST_DB_USER`
\set test_db_password `echo $TEST_DB_PASS`
\set test_db_name `echo $TEST_DB_NAME`

CREATE DATABASE :db_name;
CREATE DATABASE :test_db_name;

CREATE USER :db_user WITH PASSWORD :'db_password';
CREATE USER :test_db_user WITH PASSWORD :'test_db_password';

GRANT ALL PRIVILEGES ON DATABASE :db_name TO :db_user;
GRANT ALL PRIVILEGES ON DATABASE :test_db_name TO :test_db_user;
