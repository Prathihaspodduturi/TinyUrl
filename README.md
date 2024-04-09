#TinyURL

This project is a full-stack application that mimics the functionality of TinyURL, allowing users to shorten URLs for easier sharing and management. It includes a React-based frontend, a Spring Boot backend, and uses MySQL for data storage.



#Features

User Authentication: Sign up, log in, and log out functionality.
URL Shortening: Convert long URLs into short, manageable links.
URL Management: View, edit, and delete your shortened URLs.



#Tech Stack

Frontend: React, CSS Modules for styling
Backend: Spring Boot, Spring Security for authentication, JWT for session management
Database: MySQL
Other Tools: JWT for secure authentication, Fetch API for HTTP requests


#Getting Started

#Prerequisites

React and npm
Java Development Kit (JDK)
Maven
MySQL Server

#Setting Up the Database

Start your MySQL server.
Create the necessary tables by running the SQL scripts located in createUrlTable.sql and createUserTable.sql.

#Setting Up the Backend

Navigate to the backend directory: cd path/to/backend
Update the application.properties file with your MySQL username and password.
Start the Spring Boot application: ./mvnw spring-boot:run

#Setting Up the Frontend

Navigate to the frontend directory: cd path/to/frontend
Install dependencies: npm install
Start the React development server: npm start
Your default web browser should open automatically to http://localhost:3000.


#Usage

Signing Up: To use the application, first sign up by navigating to the /tinyurl-signup route and entering a username and password.
Logging In: If you already have an account, log in at the /tinyurl-login route.
Shortening a URL: Once logged in, you can shorten a URL by entering it into the form on the homepage and clicking "Submit".
Managing URLs: View your shortened URLs by navigating to the /tinyurl-myurls route, where you can also edit or delete them.
Logging Out: Log out via the /tinyurl-logout route.


#Security

This application uses Spring Security and JWT tokens to handle authentication and protect routes.


#Testing

This project includes unit tests for both the frontend and backend, ensuring the reliability and functionality of the application.

#Running Frontend Tests

The frontend tests are written using Jest and React Testing Library. To run these tests, navigate to the frontend directory and use the following command: npm test
This will run all available test suites and output the results, including coverage information.
This project tests has a coverage of 85%.

#Running Backend Tests

The backend tests utilize JUnit and Mockito for testing the Spring Boot application. To execute these tests, navigate to the backend directory and run: ./mvnw test
For Maven projects, this command will trigger all tests in the project and display the results, including test coverage statistics.


#Coverage

This project aims for high test coverage to ensure code quality and reliability. Current test coverage stands at approximately 85% for both frontend and backend, covering major functionalities such as user authentication, URL shortening, and URL management.




