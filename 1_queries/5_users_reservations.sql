SELECT properties.*, reservations.*, AVG(rating) as average_rating
FROM reservations
JOIN properties ON (reservations.property_id = properties.id)
JOIN property_reviews ON (properties.id = property_reviews.property_id)
WHERE reservations.guest_id = 1
AND end_date < now()::date
GROUP BY properties.id, reservations.id
ORDER BY start_date
LIMIT 10;


--OLD IMPLEMENTAION--
--AVG DID NOT COME OUT WITH THE CORRECT NUMBER--
--TESTING--

--WRONG--
-- SELECT title, cost_per_night, start_date, AVG(rating)
-- FROM property_reviews
-- JOIN properties ON (property_id = properties.id)
-- JOIN reservations ON (reservation_id = reservations.id)
-- WHERE reservations.guest_id = 1
-- AND end_date < now()::date
-- GROUP BY title, cost_per_night, start_date
-- ORDER BY start_date
-- LIMIT 10;

--RIGHT--
-- SELECT title, cost_per_night, start_date, AVG(rating)
-- FROM reservations
-- JOIN properties ON (reservations.property_id = properties.id)
-- JOIN property_reviews ON (properties.id = property_reviews.property_id)
-- WHERE reservations.guest_id = 1
-- AND end_date < now()::date
-- GROUP BY title, cost_per_night, start_date
-- ORDER BY start_date
-- LIMIT 10;

--CODE TO HELP SOLVE--
-- SELECT AVG(rating), title
-- FROM property_reviews
-- JOIN properties ON (property_id = properties.id)
-- WHERE properties.id = 994
-- GROUP BY title;

-- SELECT *
-- FROM reservations
-- WHERE end_date < now()::date
-- AND guest_id = 1;