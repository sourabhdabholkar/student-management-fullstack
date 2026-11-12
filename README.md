# Student Management System (Full Stack)

| Layer    | Technology                                                  |
|----------|-------------------------------------------------------------|
| Frontend | Angular 17 (standalone components, signals, reactive forms) |
| Backend  | Java 17, Spring Boot 3, Spring Web (REST)                   |
| Data     | Spring Data JPA, Hibernate, MySQL 8                         |
| DevOps   | Docker, Docker Compose, GitHub                              |

## Project structure
```
backend/    Spring Boot REST API (model, repository, service, controller, config)
frontend/   Angular single-page app (models, services, components, routes)
docker-compose.yml   MySQL + backend
```

## 1. Run MySQL and the backend (Docker)
```bash
docker compose up --build
```
The API runs at http://localhost:8080/api/students

Quick test: `curl http://localhost:8080/api/students`

## 2. Run the frontend
```bash
cd frontend
npm install
npm start
```
Open http://localhost:4200

## Without Docker
1. Start a local MySQL and create the database: `CREATE DATABASE sms_db;`
2. Set the password in `backend/src/main/resources/application.properties` (default is `root`), or export `SPRING_DATASOURCE_PASSWORD`.
3. `cd backend && mvn spring-boot:run`

## REST API
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| GET    | /api/students         | List all students  |
| GET    | /api/students/{id}    | Get one student    |
| POST   | /api/students         | Create a student   |
| PUT    | /api/students/{id}    | Update a student   |
| DELETE | /api/students/{id}    | Delete a student   |

## Environment variables (for deployment)
| Variable                    | Example                                              |
|-----------------------------|------------------------------------------------------|
| SPRING_DATASOURCE_URL       | jdbc:mysql://host:3306/sms_db?useSSL=true&serverTimezone=UTC |
| SPRING_DATASOURCE_USERNAME  | your_db_user                                         |
| SPRING_DATASOURCE_PASSWORD  | your_db_password                                     |
| CORS_ALLOWED_ORIGINS        | https://your-frontend.netlify.app                    |
