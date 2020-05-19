\set test_db_user `echo $TEST_DB_USER`
\set test_db_password `echo $TEST_DB_PASS`
\set test_db_name `echo $TEST_DB_NAME`

CREATE DATABASE :test_db_name;

CREATE USER :test_db_user WITH PASSWORD :'test_db_password';

GRANT ALL PRIVILEGES ON DATABASE :test_db_name TO :test_db_user;
