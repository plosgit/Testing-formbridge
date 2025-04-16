DROP TABLE forms
CASCADE;

DROP TABLE tickets
CASCADE;

DROP TABLE ratings
CASCADE;

DROP TABLE chats
CASCADE;

DROP TABLE companies
CASCADE;

DROP TABLE users
CASCADE;

DROP TABLE chatbot
CASCADE;

DROP TYPE role;

DROP TYPE subject;


CREATE TABLE companies (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE forms (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id INT NOT NULL,
    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
);

CREATE TYPE subject AS ENUM ('product', 'service');

CREATE TABLE tickets (
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    message VARCHAR(255),
    subject subject,
    created_at TIMESTAMP DEFAULT now(),
    resolved BOOLEAN DEFAULT false,
    company_id INT NOT NULL,
    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
);

CREATE TABLE ratings (
    id SERIAL NOT NULL PRIMARY KEY,
    rating int NOT NULL,
    ticket_id INT NOT NULL UNIQUE,
    CONSTRAINT fk_ticket
        FOREIGN KEY (ticket_id)
            REFERENCES tickets(id)
);

CREATE TABLE chats (
    id SERIAL NOT NULL PRIMARY KEY,
    ticket_id INT NOT NULL,
    support_id INT,
    created_at TIMESTAMP DEFAULT now(),
    message VARCHAR NOT NULL,
    from_support BOOLEAN NOT NULL DEFAULT false,
    from_ai BOOLEAN DEFAULT false,
    CONSTRAINT fk_ticket
        FOREIGN KEY (ticket_id)
            REFERENCES tickets(id)
);

CREATE TYPE role AS ENUM ('SUPPORT', 'ADMIN');

CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) DEFAULT '123',
    company_id INT NOT NULL,
    role role DEFAULT 'SUPPORT',
    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
);

CREATE TABLE chatbot (
    id SERIAL NOT NULL PRIMARY KEY,
    modelfile VARCHAR DEFAULT 'You will refer to yourself as Billy the ChatBot. You are a customer support assistant. Respond professionally, empathetically. Your responses must be short and concise, and related to customer inquiries. Stay focused on support-related topics and do not answer questions outside of customer service. Provide clear, helpful solutions or direct users to appropriate resources when needed. This is your prompt from your customer service agent:',
    company_id INT NOT NULL,
    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
            REFERENCES companies(id)
);

CREATE VIEW tickets_company_name AS
    SELECT
        tickets.id,
        tickets.firstname,
        tickets.lastname,
        tickets.email,
        tickets.message,
        tickets.subject,
        tickets.created_at,
        tickets.resolved,
        ratings.rating AS rating,
        companies.id   AS company_id,
        companies.name AS company
    FROM tickets
         JOIN companies ON tickets.company_id = companies.id
            LEFT JOIN ratings on tickets.id = ratings.ticket_id;

CREATE VIEW users_company_name AS
    SELECT
        users.id,
        users.firstname,
        users.lastname,
        users.email,
        users.password,
        users.company_id,
        users.role,
        companies.name AS company
    FROM users
        JOIN companies ON users.company_id = companies.id;
