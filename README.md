# Hop2School

![License](https://img.shields.io/badge/License-MIT-blue?style=flat)
![Java](https://img.shields.io/badge/Java-21-blue?style=flat)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-21-brightgreen?style=flat)
![Angular](https://img.shields.io/badge/Angular-17-red?style=flat)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.3-lightblue?style=flat)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat)
![JWT](https://img.shields.io/badge/JWT-auth-orange?style=flat)
![Spring Security](https://img.shields.io/badge/Security-Spring%20Security-yellow?style=flat)
![Docker](https://img.shields.io/badge/Docker-24.0-blue?logo=docker)

## Project Description

Hop2School is a full-stack web application for organizing school carpooling.
The system follows a computer-first (desktop-optimized) UI design, but is fully responsive and adapted for mobile devices.
It enables secure ride sharing with geo-based search, moderation, communication, and notification systems.

**Status:** Stable / Finished features, under continuous development for improvements
**Note:** Training and learning project – not intended for production use

**Base authentication system:** [https://github.com/R-100/JAS](https://github.com/R-100/JAS-Java.Angular.Security.git)

## Technischer Stack
- Docker
### Backend
- Java 21
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- Liquibase
- PostgreSQL
- SMTP Email Service

### Frontend
- Angular 17
- Tailwind CSS
- OpenStreetMap API
- GeoCoding API
- i18n (DE / EN)
- user documentation (mkDocs Material)

## Project Structure
````
Hop2School/
 ├── backend/               → Java Spring Boot
 │    └── Dockerfile
 ├── frontend/              → Angular
 │    └── Dockerfile
 ├── docker-compose.yml
 ├── Docs HTML              → convert html Documentation
 ├── mkDocs                 → mkDocs Material Documentation
 ├── diagram                → application diagram
 └── README.md
````

## Installation & Setup

Clone Repository
````
git clone https://github.com/<USER>/hop2school.git
cd hop2school
````

### Run Docker 
Prerequisites
- Docker Desktop

#### 1. Edit Docker Compose Variables 
````
Hop2School/
│── /docker-compose.yml 
````

Edit Variables
````
environment:
    - DB_SERVER=jas-postgres
    - POSTGRES_DB=jas
    - POSTGRES_USER=jas
    - POSTGRES_PASSWORD=jas
    - APPLICATION_NAME=JAS
    - MAIL_USERNAME=your_email@gmail.com
    - MAIL_PASSWORD=your_app_password
    - APPLICATION_MAIL=your_email@gmail.com
    - JWT_SECRET="my-super-secret-key-that-is-at-least-64-characters-long-123456"
    - GEOCODING_API_KEY="your_api_key"
````

#### 2. Start Docker 
Open the terminal the main objective of the project:

````
docker compose up
````

### Run locally 
Prerequisites
  - Java 21
  - Node.js >=18
  - npm / yarn
  - PostgreSQL
  - Maven

#### 1. Create Database
````
CREATE DATABASE hop2school;
````

#### 2. Environment Variables (IntelliJ Run Configuration)
The application attempts to reactivate the deactivated lines and deactivate the activated Docker lines by deleting them or converting them to comments.

````
JWT_SECRET=your_secret_key

DB_URL=jdbc:postgresql://localhost:5432/hop2school
DB_USERNAME=postgres
DB_PASSWORD=postgres

MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

APPLICATION_NAME=Hop2School
APPLICATION_MAIL=info@hop2school.com

GEOCODING_API_KEY=your_api_key
````

#### 3. Start Backend
````
cd backend
mvn spring-boot:run
````
> ![Info](https://img.shields.io/badge/-INFO-blue)
> Liquibase will automatically create the tables.

#### 4. Start Frontend
````
cd frontend
npm install
ng serve
````
> ![Info](https://img.shields.io/badge/-INFO-blue)
> Frontend runs at: http://localhost:4200

## Architecture
````
Frontend (Angular - Computer-first UI)
        ↓ REST / JWT
Backend (Spring Boot)
        ↓
Services:
- Auth (JWT / Security)
- Ride Management
- User Service
- Report System
- Email Service
        ↓
PostgreSQL + Liquibase
````

## GeoCoding / Open Street Map API
- GeoCoding features require a valid API key
- Without an API key, map and address services may be limited or unavailable

## Feature Overview

### Security
- JWT authentication
- Email verification
- BCrypt password hashing
- Role-based access control

### Ride System
- Create rides
- Search rides
- Accept rides
- Geo-based radius search

### Map System
- OpenStreetMap integration
- School & ride markers
- GeoCoding API support 

### Communication
- Ride-based chat system
- User-to-user messaging

### Notification System
- Email on booking
- Email on updates
- Email on account actions

### Moderation System
- User reporting system
- Automatic ban after threshold
- Manual unban by admin/team only

### Dashboard
- Ride overview
- Statistics (CO₂, costs, trips)
- Active ride management

### UI System
- Computer-first layout
- Mobile responsive design
- Dark / Light mode
- Tailwind styling system

## Media
- Project logo was generated using AI tools

## Project Status
- Training and learning project developed under predefined requirements
- Not intended for production or commercial use
- Demo Data for Legal Privacy

> ![Warning](https://img.shields.io/badge/-WARNING-red)  
> **No guarantee of 100% security in production environments.**
