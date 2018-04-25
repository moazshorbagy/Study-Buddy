USE `studybuddy` ;

INSERT INTO book(book_status, book_code, book_author, book_title, book_edition, book_duration, donor_id) VALUES
('AVAILABLE', 'CMP', 'Thomas H. Cormen', 'Introduction to Algorithms', 5, 0, 1),
('AVAILABLE', 'CMP', 'Andrew S. Tanenbaum', 'Modern Operating Systems', 4, 3, 1),
('AVAILABLE', 'CMP', 'Steve McConnell', 'Code Complete', 7, 12, 1),
('AVAILABLE', 'CMP', 'James F. Kurose', 'Computer Networking: A Top-Down Approach ', 1, 6, 1),
('AVAILABLE', 'CMP', 'John L. Bentley', 'Programming Pearls', 2, 3, 1),
('AVAILABLE', 'CMP', 'Tom M. Mitchell', 'Machine Learning', 8, 12, 1),
('AVAILABLE', 'MTH', 'Joseph Gallian', 'Contemporary Abstract Algebra', 5, 0, 1),
('AVAILABLE', 'MTH', 'David S. Dummit and Richard M. Foote', 'Abstract Algebra', 6, 0, 1),
('AVAILABLE', 'MTH', 'Thomas H. Cormen, Charles E. Leiserson and Ronald L. Rivest', 'Introduction to Algorithms', 3, 0, 1),
('AVAILABLE', 'MTH', 'Silvanus P. Thompson', 'Calculus Made Easy', 4, 0, 1);