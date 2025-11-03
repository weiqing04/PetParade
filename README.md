Markdown

# Pet Parade - E-commerce Website

This is a full-stack e-commerce application for pet supplies, built with a React frontend and a Spring Boot backend.

* **Frontend (src):** React, React Router, Context API
* **Backend (backend):** Spring Boot, Spring Data JPA, MySQL

## Prerequisites

Before you begin, you will need the following installed on your system:
* **Java JDK 8** (or 11)
* **Node.js** (which includes npm)
* **MySQL Server** (like MySQL Community Server or XAMPP)
* **Git**

---

## How to Run the Project

You will need to run two separate processes in two separate terminals:
1.  **Backend Server** (Spring Boot on port 8080)
2.  **Frontend App** (React on port 3000)

### 1. Backend Setup (Terminal 1)

**A. Clone the Repository**
```bash
git clone <your-repository-url>
cd petparade-master
B. Set Up the Database

Open your MySQL client (e.g., MySQL Workbench, DBeaver).

Run the following SQL script to create the database and tables:

SQL

-- Create the database
CREATE DATABASE IF NOT EXISTS pet_parade_db;
USE pet_parade_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) DEFAULT 'customer'
);

-- Insert the default Admin user
INSERT INTO users (username, password, email, role) 
VALUES ('Admin', 'admin123', 'admin@petparade.com', 'admin')
ON DUPLICATE KEY UPDATE password='admin123', email='admin@petparade.com', role='admin';

-- Create the products table (with image support)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    image LONGBLOB,        -- Stores the image data
    image_type VARCHAR(50) -- Stores the MIME type (e.g., "image/png")
);

-- Create the favourites table (links users to products)
CREATE TABLE favourites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  productId INT NOT NULL,
  UNIQUE KEY uq_user_product (userId, productId),
  CONSTRAINT fk_fav_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fav_product FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;


C. Configure the Backend

Navigate to the backend folder:

Bash

cd backend
Open the file: backend/src/main/resources/application.properties

Edit the spring.datasource properties to match your local MySQL username and password:

Properties

# ...
spring.datasource.url=jdbc:mysql://localhost:3306/pet_parade_db
spring.datasource.username=your_mysql_username  # <-- EDIT THIS
spring.datasource.password=your_mysql_password  # <-- EDIT THIS
# ...
D. Run the Backend

In the same backend directory, run the application using the Maven wrapper:

On Windows (PowerShell):

PowerShell

.\mvnw spring-boot:run
On macOS/Linux:

Bash

./mvnw spring-boot:run
Leave this terminal running. The backend API is now live at http://localhost:8080/api.

2. Frontend Setup (Terminal 2)
A. Open a new terminal

Navigate to the project's root frontend folder (petparade-master):

Bash

cd petparade-master 
(If you are still in the backend folder from the last step, just type cd ..)

B. Configure the Frontend

Create a new file in this directory named .env

Add the following line to the .env file. This is required to fix a known issue with the proxy setting in package.json.

DANGEROUSLY_DISABLE_HOST_CHECK=true
C. Install Dependencies

Run npm install to download all the React libraries.

Bash

npm install
D. Run the Frontend

Start the React development server:

Bash

npm start
This command should automatically open your web browser to http://localhost:3000. The application is now fully running.

Troubleshooting
Error: npm : File C:\... \npm.ps1 cannot be loaded...

If you see this error in your frontend terminal, your PowerShell is blocking scripts. Run this command in your PowerShell terminal and press Y to confirm:

PowerShell

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
Then, try npm install or npm start again.