# Sky Tracker

Problem Statement:
Develop a system to provide real-time flight status updates and notifications to
passengers.
Requirements:

a. Real-time Updates: Display current flight status (delays, cancellations, gate
changes).
b. Push Notifications: Send notifications for flight status changes via SMS, email, or
app notifications you can use kafka, RabbitMQ , etc.
c. Integration with Airport Systems: Pull data from airport databases for accurate
information, we will give you mock data.

........................................................................................................................................................................................................................

Solution:

The Sky Tracker project is designed to offer real-time flight status updates and notifications to passengers using a modern tech stack. Built with ReactJS on the frontend and NodeJS with ExpressJS on the backend, this system integrates seamlessly with MongoDB for data storage. The system handles various aspects of flight information, including real-time status updates on delays, cancellations, and gate changes.

For notifications, the project supports email notifications. This tools ensure that passengers receive timely updates about their flights.

The User model tracks essential passenger details and their associated flights, while the Flight model stores comprehensive flight information. Notifications are managed through a dedicated schema, which records updates and timestamps for effective communication.

The installation and deployment are streamlined, with the backend hosted on Render and the frontend on Netlify, ensuring robust and accessible user experiences. For detailed setup, environment variables must be configured correctly, and both frontend and backend components are built and run independently.

## Tech Stack Used:

ReactJS, NodeJS, ExpressJS, MongoDB

## Entity Relationship Diagram:

[User]

```
\*\_id [ ObjectId ]

\*username [ String, not null, Index ]

firstname [ String, not null, Index ]

lastname [ String, Index ]

\*email [ String, not null, Index ]

password [ String, not null ]

flights [ Array, Ref: Flight ]

\*created [ Date ]

\*updated [ Date ]
```

[Flight]

```
\*\_id [ ObjectId ]

\*flight_id [ String, not null, Unique ]

\*airline [ String, not null ]

\*status [ String, not null ]

\*departure_gate [ String, not null ]

\*arrival_gate [ String, not null ]

\*scheduled_departure [ Date, not null ]

\*scheduled_arrival [ Date, not null ]

actual_departure [ Date ]

actual_arrival [ Date ]

\*created [ Date ]

\*updated [ Date ]
```

[Notification]

```
\*\_id [ ObjectId ]

\*notification_id [ String, not null, Unique ]

\*flight_id [ String, not null, Ref: Flight ]

\*message [ String, not null ]

\*timestamp [ Date, not null ]
```

## Installation

Install my-project with npm

For Backend:

```bash
$ cd backend   // go to server folder
$ npm i       // npm install packages
$ npm run server // run it locally
```

For Frontend:

```bash
$ cd frontend   // go to client folder
$ npm i       // npm install packages
$ npm start // run it locally
$ npm run build // this will build the server code to es5 js codes and generate a dist file
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

BACKEND:

`DATABASE_URL` MongoDB Database URL

`BASE_URL` Frontend URL

`PORT` PORT Number of Server

`TOKEN_SECRET` JWT Secret

FRONTEND:

`REACT_APP_BACKEND_URL` Backend URL

## Deployment

Backend is deployed on Render.
Frontend is deployed on Netlify.

Hosted Link :
https://skyytracker.netlify.app/

Github Link :
https://github.com/HarshTondak/Sky-Tracker
