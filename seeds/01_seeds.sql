INSERT INTO users (name, email, password)
  VALUES ('Billy Brag', 'bb@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Almonso Timmins', 'allymonno@dmxlover.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('Tracy Jackson', 'tjax@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
  ('maxine Klickov', 'mklic@rus.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES (1, 'Billy Brags house of Shag', 'shagtastic', 'img.com', 'img.com', 1000, 1, 1, 1, 'Canada', 'Lovers Lane', 'London', 'Ontario', 'B2G 1Y9'),
  (2, 'a great stay', 'description', 'img.com', 'img.com', 2000, 2, 3, 2, 'Canada', 'Main street', 'London', 'Ontario', 'N4H 5H4'),
  (2, 'home away from home', 'description', 'img.com', 'img.com', 20000, 8, 3, 10, 'Canada', 'King street', 'Waterloo', 'Ontario', 'N4H 5H4');


INSERT INTO reservations (start_date, end_date, property_id, guest_id)
  VALUES ('1999-01-08', '1999-01-18', 10, 1),
  ('2013-11-08', '2015-01-18', 11, 1),
  ('2019-02-08', '2019-03-18', 12, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
  VALUES (3, 10, 19, 3, 'great scot'),
  (1, 11, 20, 1, 'good stuff'),
  (2, 12, 21, 5, 'yeah yeah yeah');