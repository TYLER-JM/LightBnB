const { Pool } = require('pg');


const pool = new Pool({
  user: 'vagrant',
  password: 123,
  host: 'localhost',
  database: 'lightbnb'
});

const values = [process.argv[2], process.argv[3], process.argv[4]];
const queryString = `
INSERT INTO users(name, email, password)
VALUES ($1, $2, $3)
RETURNING*;
`;

pool.query(queryString, values)
  .then(res => {
    if (res.rows[0]) {
      console.log(res.rows[0]);
    } else {
      console.log(null);
    }
  })
  .catch(err => console.error('query error', err.stack));