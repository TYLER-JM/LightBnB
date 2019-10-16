/* SELECT id, title, cost_per_night, (SELECT AVG(rating)
FROM property_reviews
JOIN properties
ON (property_id = properties.id)
WHERE property_id = 4)
FROM properties
WHERE city = 'Vancouver'
ORDER BY cost_per_night ASC
LIMIT 2; */

-- SELECT id, title, cost_per_night
-- FROM properties
-- WHERE city = 'Vancouver';

SELECT properties.*, AVG(rating)
FROM properties
JOIN property_reviews
ON (properties.id = property_id)
WHERE city LIKE '%Vancouver%'
GROUP BY properties.id
HAVING AVG(rating) >= 4
ORDER BY cost_per_night
LIMIT 10;
