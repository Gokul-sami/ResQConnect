# ResQConnect

ResQConnect is a disaster response coordination platform that connects the public, volunteers, rescue teams, NGOs, and admins in one workflow.

It helps users create crisis channels, raise requests, communicate in channel forums, assign rescue tasks, and track request status in real time.

## What This Project Does

- Public users can create and follow disaster channels.
- Users can post help requests with category, location, and description.
- Forum-style channel communication supports updates and coordination.
- NGOs can create rescue teams and assign members.
- NGOs can assign pending requests to rescue teams.
- Rescue members can update request status (taken, in progress, completed).
- Admins can review and approve newly created channels.

## Tech Stack

- Frontend: React + Vite
- Backend: Spring Boot (Java 21), Spring Web, Spring Data JPA
- Database: MySQL

## Project Structure

- frontend: React UI application
- resqconnect/resqconnect: Spring Boot backend API
- ER_diagram (Crisis management).pdf: database structure diagram

## Database Structure

Use the root diagram file below to understand the schema and table relationships:

- [ER_diagram (Crisis management).pdf](ER_diagram%20(Crisis%20management).pdf)

If your Markdown viewer supports inline PDF preview, use this embed:

<object data="ER_diagram%20(Crisis%20management).pdf" type="application/pdf" width="100%" height="600">
  <p>Open the diagram here: <a href="ER_diagram%20(Crisis%20management).pdf">ER_diagram (Crisis management).pdf</a></p>
</object>

## Prerequisites

- Java 21
- Node.js 18+ and npm
- MySQL 8+

## Setup Guide

### 1) Clone and enter the project

- Clone this repository
- Open the project root in VS Code

### 2) Create MySQL database

Create the database (schema) used by the backend:

- Database name should match backend config exactly.

Example:

mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS resqconnect;"

### 3) Configure backend datasource

File: resqconnect/resqconnect/src/main/resources/application.properties

Set your MySQL connection values:

- spring.datasource.url=jdbc:mysql://127.0.0.1:3306/resqconnect?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
- spring.datasource.username=your_mysql_username
- spring.datasource.password=your_mysql_password
- spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
- spring.jpa.hibernate.ddl-auto=update

Important:

- Use one exact database name consistently.
- In MySQL, schema and database are effectively the same.
- If table creation is inconsistent, ensure entity @Table schema values and datasource database name match.

### 4) Run backend

From project root:

cd resqconnect/resqconnect
./gradlew bootRun

On Windows PowerShell:

cd resqconnect\resqconnect
.\gradlew.bat bootRun

Backend runs on:

- http://localhost:8080

### 5) Run frontend

From project root:

cd frontend
npm install
npm run dev

Frontend runs on:

- http://localhost:5173

## API Base URL for Frontend

File: frontend/.env

Set:

VITE_APP_API_BASE_URL=http://localhost:8080

## First Run Notes

- If backend starts and keeps showing bootRun executing, that is normal for a running server.
- If tables are not created, check:
  - Database exists
  - Datasource URL database name is correct
  - MySQL user has create/alter permissions
  - spring.jpa.hibernate.ddl-auto is set to update (or create for first run)

## Common Commands

Backend:

- Build: .\gradlew.bat build
- Run: .\gradlew.bat bootRun

Frontend:

- Install: npm install
- Run dev: npm run dev
- Build: npm run build

## Contributors

Please update this README when adding major features, changing DB schema, or modifying setup steps.
