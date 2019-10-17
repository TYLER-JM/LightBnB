
const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: 123,
  host: 'localhost',
  database: 'lightbnb'
});


module.exports = {
  getUserWithEmail: (email) => {
    const values = [email];
    const queryString = `
    SELECT id, name, email, password
    FROM users
    WHERE email = $1
    `;
    return pool.query(queryString, values)
      .then(res => {
        if (res.rows[0]) {
          return (res.rows[0]);
        } else {
          return null;
        }
      })
      .catch(err => console.error('query error', err.stack));
  },
  getUserWithId: (id) => {
    const values = [id];
    const queryString = `
    SELECT id, name, email, password
    FROM users
    WHERE id = $1
    `;
    return pool.query(queryString, values)
      .then(res => {
        if (res.rows[0]) {
          return (res.rows[0]);
        } else {
          return null;
        }
      })
      .catch(err => console.error('query error', err.stack));
  },
  addUser: (user) => {
    const values = [user.name, user.email, user.password];
    const queryString = `
    INSERT INTO users(name, email, password)
    VALUES ($1, $2, $3)
    RETURNING*;
    `;
    
    return pool.query(queryString, values)
      .then(res => {
        if (res.rows[0]) {
          return res.rows[0];
        } else {
          return null;
        }
      })
      .catch(err => console.error('query error', err.stack));
  },
  getAllReservations: (guest_id, limit = 10) => {
    return pool.query(`
    SELECT properties.*, reservations.*, AVG(rating) as average_rating
    FROM reservations
    JOIN properties ON (reservations.property_id = properties.id)
    JOIN property_reviews ON (properties.id = property_reviews.property_id)
    WHERE reservations.guest_id = ${guest_id}
    AND end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY start_date
    LIMIT ${limit};
    `)
      .then(res => res.rows)
      .catch(err => console.error(('query error', err.stack)));
  },
  getAllProperties: (options, limit = 10) => {
    let queryParams = [];
    let queryStr = `
    SELECT properties.*, AVG(property_reviews.rating) as average_rating
    FROM properties
    LEFT JOIN property_reviews
    ON properties.id = property_id
    `;

    let flag = false;
    if (options.city) {
      queryParams.push(`%${options.city}%`);
      queryStr += `WHERE city LIKE $${queryParams.length} `;
      flag = true;
    }
    if (options.minimum_price_per_night) {
      queryParams.push(`${options.minimum_price_per_night * 100}`);
      queryStr += `${flag ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length} `;
      flag = true;
    }
    if (options.maximum_price_per_night) {
      queryParams.push(`${options.maximum_price_per_night * 100}`);
      queryStr += `${flag ? 'AND' : 'WHERE'} cost_per_night <= $${queryParams.length} `;
      flag = true;
    }
    if (options.owner_id) {
      queryParams.push(`${options.owner_id}`);
      queryStr += `${flag ? 'AND' : 'WHERE'} owner_id = $${queryParams.length}`;
      console.log('user_id is present', options.owner_id);
    }

    queryStr += `
    GROUP BY properties.id
    `;

    if (options.minimum_rating) {
      queryParams.push(`${options.minimum_rating}`);
      queryStr += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
    }
    
    queryParams.push(limit);
    queryStr += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
    console.log(queryStr, queryParams);

    return pool.query(queryStr, queryParams)
      .then(res => res.rows)
      .catch(err => console.error('query error', err.stack));
  },
  addProperty: (property) => {
    const values = [
      property.owner_id,
      property.title,
      property.description,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.parking_spaces,
      property.number_of_bathrooms,
      property.number_of_bedrooms,
      property.country,
      property.street,
      property.city,
      property.province,
      property.post_code,
    ];
    const queryString = `
    INSERT INTO properties(
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms,
      country,
      street,
      city,
      province,
      post_code
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING*;
    `;
    return pool.query(queryString, values)
      .then(res => res.rows[0])
      .catch(err => console.error('query error', err.stack));
  }
};



/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

 
// const getUserWithEmail = function(email) {
//   const values = [email];
//   const queryString = `
//   SELECT id, name, email, password
//   FROM users
//   WHERE email = $1
//   `;
//   return pool.query(queryString, values)
//     .then(res => {
//       if (res.rows[0]) {
//         return (res.rows[0]);
//       } else {
//         return null;
//       }
//     })
//     .catch(err => console.error('query error', err.stack));
//   // let user;
//   // for (const userId in users) {
//   //   user = users[userId];
//   //   if (user.email.toLowerCase() === email.toLowerCase()) {
//   //     break;
//   //   } else {
//   //     user = null;
//   //   }
//   // }
//   // return Promise.resolve(user);
// };
// exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithId = function(id) {
//   const values = [id];
//   const queryString = `
//   SELECT id, name, email, password
//   FROM users
//   WHERE id = $1
//   `;
//   return pool.query(queryString, values)
//     .then(res => {
//       if (res.rows[0]) {
//         return (res.rows[0]);
//       } else {
//         return null;
//       }
//     })
//     .catch(err => console.error('query error', err.stack));
//   // return Promise.resolve(users[id]);
// };
// exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
// const addUser =  function(user) {
//   const values = [user.name, user.email, user.password];
//   const queryString = `
//   INSERT INTO users(name, email, password)
//   VALUES ($1, $2, $3)
//   RETURNING*;
//   `;
  
//   return pool.query(queryString, values)
//     .then(res => {
//       if (res.rows[0]) {
//         return res.rows[0];
//       } else {
//         return null;
//       }
//     })
//     .catch(err => console.error('query error', err.stack));

//   // const userId = Object.keys(users).length + 1;
//   // user.id = userId;
//   // users[userId] = user;
//   // return Promise.resolve(user);
// };
// exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// const getAllReservations = function(guest_id, limit = 10) {
//   return pool.query(`
//   SELECT properties.*, reservations.*, AVG(rating) as average_rating
//   FROM reservations
//   JOIN properties ON (reservations.property_id = properties.id)
//   JOIN property_reviews ON (properties.id = property_reviews.property_id)
//   WHERE reservations.guest_id = ${guest_id}
//   AND end_date < now()::date
//   GROUP BY properties.id, reservations.id
//   ORDER BY start_date
//   LIMIT ${limit};
//   `)
//     .then(res => res.rows)
//     .catch(err => console.error(('query error', err.stack)));
//   // return getAllProperties(null, 2);
// };
// exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   let queryParams = [];
//   let queryStr = `
//   SELECT properties.*, AVG(property_reviews.rating) as average_rating
//   FROM properties
//   LEFT JOIN property_reviews
//   ON properties.id = property_id
//   `;

//   let flag = false;
//   if (options.city) {
//     queryParams.push(`%${options.city}%`);
//     queryStr += `WHERE city LIKE $${queryParams.length} `;
//     flag = true;
//   }
//   if (options.minimum_price_per_night) {
//     queryParams.push(`${options.minimum_price_per_night * 100}`);
//     queryStr += `${flag ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length} `;
//     flag = true;
//   }
//   if (options.maximum_price_per_night) {
//     queryParams.push(`${options.maximum_price_per_night * 100}`);
//     queryStr += `${flag ? 'AND' : 'WHERE'} cost_per_night <= $${queryParams.length} `;
//     flag = true;
//   }
//   if (options.owner_id) {
//     queryParams.push(`${options.owner_id}`);
//     queryStr += `${flag ? 'AND' : 'WHERE'} owner_id = $${queryParams.length}`;
//     console.log('user_id is present', options.owner_id);
//   }

//   queryStr += `
//   GROUP BY properties.id
//   `;

//   if (options.minimum_rating) {
//     queryParams.push(`${options.minimum_rating}`);
//     queryStr += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
//   }
  
//   queryParams.push(limit);
//   queryStr += `
//   ORDER BY cost_per_night
//   LIMIT $${queryParams.length};
//   `;
//   console.log(queryStr, queryParams);

//   return pool.query(queryStr, queryParams)
//     .then(res => res.rows)
//     .catch(err => console.error('query error', err.stack));

//   // const limitedProperties = {};
//   // for (let i = 1; i <= limit; i++) {
//   //   limitedProperties[i] = properties[i];
//   // }
//   // return Promise.resolve(limitedProperties);
// };
// exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function(property) {
//   const values = [
//     property.owner_id,
//     property.title,
//     property.description,
//     property.thumbnail_photo_url,
//     property.cover_photo_url,
//     property.cost_per_night,
//     property.parking_spaces,
//     property.number_of_bathrooms,
//     property.number_of_bedrooms,
//     property.country,
//     property.street,
//     property.city,
//     property.province,
//     property.post_code,
//   ];
//   const queryString = `
//   INSERT INTO properties(
//     owner_id,
//     title,
//     description,
//     thumbnail_photo_url,
//     cover_photo_url,
//     cost_per_night,
//     parking_spaces,
//     number_of_bathrooms,
//     number_of_bedrooms,
//     country,
//     street,
//     city,
//     province,
//     post_code
//   )
//   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
//   RETURNING*;
//   `;
//   return pool.query(queryString, values)
//     .then(res => res.rows[0])
//     .catch(err => console.error('query error', err.stack));

//   // const propertyId = Object.keys(properties).length + 1;
//   // property.id = propertyId;
//   // properties[propertyId] = property;
//   // console.log(property);
//   // return Promise.resolve(property);
// };
// exports.addProperty = addProperty;
