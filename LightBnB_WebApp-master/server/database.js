

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