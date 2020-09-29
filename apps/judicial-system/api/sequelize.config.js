/* eslint-env node */

module.exports = {
  development: {
    username: 'dev_db',
    password: 'dev_db',
    database: 'dev_db',
    host: 'localhost',
    dialect: 'postgres',
    userSeed: [
      {
        id: 'a1fd62db-18a6-4741-88eb-a7b7a7e05833',
        national_id: '2510654469',
        name: 'Guðjón Guðjónsson',
        mobile_number: '8589030',
        role: 'PROSECUTOR',
      },
      {
        id: 'cef1ba9b-99b6-47fc-a216-55c8194830aa',
        national_id: '2408783999',
        name: 'Baldur Kristjánsson',
        mobile_number: '8949946',
        role: 'REGISTRAR',
      },
      {
        id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
        national_id: '1112902539',
        name: 'Ívar Oddsson',
        mobile_number: '6904031',
        role: 'JUDGE',
      },
    ],
  },
  test: {
    username: 'test_db',
    password: 'test_db',
    database: 'test_db',
    host: process.env.DB_HOST,
    dialect: 'postgres',
    userSeed: [
      {
        id: 'a1fd62db-18a6-4741-88eb-a7b7a7e05833',
        national_id: '2510654469',
        name: 'Guðjón Guðjónsson',
        mobile_number: '8589030',
        role: 'PROSECUTOR',
      },
    ],
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
}
