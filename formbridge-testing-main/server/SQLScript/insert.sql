INSERT INTO companies (name)
VALUES
    ('inet'),
    ('Komplett');

INSERT INTO forms (name, company_id)
VALUES
    ('inet form', 1),
    ('Komplett form', 2);


/* Products Tickets */
INSERT INTO tickets (firstname, lastname, email, message, subject, company_id)
VALUES
    ('John', 'Doe', 'john.doe@example.com', 'The printer is not connecting to Wi-Fi.', 'product', 1),
    ('Nathaniel', 'Fitzgerald', 'nathaniel.fitzgerald@example.com', 'My laptop screen flickers constantly when adjusting brightness, making it difficult to work on documents or watch videos.', 'product', 1),
    ('Robert', 'Williams', 'robert.williams@example.com', 'The phone battery drains extremely quickly even after a full charge, lasting only a few hours with minimal usage.', 'product', 2),
    ('Seraphina', 'Cunningham', 'seraphina.cunningham@example.com', 'Bluetooth headset keeps disconnecting.', 'product', 1),
    ('Michael', 'Anderson', 'michael.anderson@example.com', 'Certain keys on my keyboard are unresponsive or require extra pressure to function, which slows down my typing speed significantly.', 'product', 2);


/* Services Tickets */
INSERT INTO tickets (firstname, lastname, email, message, subject, company_id)
VALUES
    ('Maximilian', 'Montgomery', 'maximilian.montgomery@example.com', 'I noticed that my payment was charged twice for my recent order. I have checked my bank statement, and both transactions appear as completed. Please assist in refunding the duplicate charge.', 'service', 1),
    ('Emmeline', 'Martinez-Santiago', 'emma.martinez.santiago@example.com', 'It has been over two weeks, and I have still not received my shipment. The tracking number provided shows no updates. I need to know the status of my package as soon as possible.', 'service', 2),
    ('Anastasia', 'Harrington', 'anastasia.harrington@example.com', 'I submitted a refund request over a week ago, but it has not been processed yet. I was told it would take 3-5 business days. Can you provide an update on the status of my refund?', 'service', 1),
     ('Isabella', 'Wilson', 'isabella.wilson@example.com', 'I was charged for a product I never ordered.', 'service', 2);


INSERT INTO users (firstname, lastname, email, password, company_id)
VALUES
    ('John', 'Doe', 'john.doe@example.com', 'hashedpassword1', 1),
    ('Jane', 'Smith', 'jane.smith@example.com', 'hashedpassword2', 2),
    ('Alice', 'Johnson', 'alice.johnson@example.com', 'hashedpassword3', 1),
    ('Bob', 'Brown', 'bob.brown@example.com', 'hashedpassword4', 2),
    ('Charlie', 'Davis', 'charlie.davis@example.com', 'hashedpassword5', 2),
    ('Emily', 'Clark', 'emily.clark@example.com', 'hashedpassword6', 1),
    ('David', 'Moore', 'david.moore@example.com', 'hashedpassword7', 1),
    ('Sophia', 'Miller', 'sophia.miller@example.com', 'hashedpassword8', 2),
    ('James', 'Wilson', 'james.wilson@example.com', 'hashedpassword9', 2),
    ('Olivia', 'Anderson', 'olivia.anderson@example.com', 'hashedpassword10', 1);


INSERT INTO users (firstname, lastname, email, password, company_id, role)
VALUES
    ('David', 'Labett', 'davidlabett@example.com', 'hej123', 1, 'ADMIN'),
    ('Bob', 'Bobsen', 'admin1', 'a', 1, 'ADMIN'),
    ('Steve', 'Stevens', 'admin2', 'a', 2, 'ADMIN'),
    ('Mai', 'Maisan', 'support1', 'a', 1, 'SUPPORT'),
    ('Vern', 'Vernes', 'support2', 'a', 2, 'SUPPORT');

INSERT INTO chatbot (company_id)
VALUES
    (1),
    (2);