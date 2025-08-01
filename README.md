# flyticket

#init dev
flyticket/
│
├── config/
│ └── db.js # PostgreSQL DB connection config
│
├── controllers/
│ ├── AuthController.js # Authentication logic
│ ├── TicketController.js# Ticket booking logic
│ └── FlightController.js# Flight-related logic
│
├── models/
│ ├── User.js # User schema
│ ├── Flight.js # Flight schema
│ └── Ticket.js # Ticket schema
│
├── routes/
│ ├── auth.routes.js # Routes for login, register, etc.
│ ├── flight.routes.js # Routes for managing flights
│ └── ticket.routes.js # Routes for booking tickets
│
├── middlewares/
│ └── auth.middleware.js # For protecting routes
│
├── app.js # Main app entry
├── server.js # Starts the server
├── .env # Environment variables (DB creds, port, etc.)
└── package.json
