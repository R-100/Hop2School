# Hop2School

![License](https://img.shields.io/badge/License-MIT-blue?style=flat)
![Java](https://img.shields.io/badge/Java-21-blue?style=flat)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-21-brightgreen?style=flat)
![Angular](https://img.shields.io/badge/Angular-17-red?style=flat)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.3-lightblue?style=flat)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat)
![JWT](https://img.shields.io/badge/JWT-auth-orange?style=flat)
![Spring Security](https://img.shields.io/badge/Security-Spring%20Security-yellow?style=flat)

## Project Description

Hop2School is a full-stack web application for organizing school carpooling.
The system follows a computer-first (desktop-optimized) UI design, but is fully responsive and adapted for mobile devices.
It enables secure ride sharing with geo-based search, moderation, communication, and notification systems.

**Base authentication system:** https://github.com/R-100/JAS

## Technischer Stack
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

## Installation & Setup
Prerequisites
  - Java 21
  - Node.js >=18
  - npm / yarn
  - PostgreSQL
  - Maven

### 1. Clone Repository
````
git clone https://github.com/<USER>/hop2school.git
cd hop2school
````

### 2. Create Database
````
CREATE DATABASE hop2school;
````

### 3. Environment Variables (IntelliJ Run Configuration)
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

### 4. Start Backend
````
cd backend
mvn spring-boot:run
````
> ![Info](https://img.shields.io/badge/-INFO-blue)
> Liquibase will automatically create the tables.

### 5. Start Frontend
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
