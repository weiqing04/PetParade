# 🐾 Pet Parade - E-Commerce Website

**Pet Parade** is a full-stack e-commerce application for pet supplies, built with a **React frontend** and a **Spring Boot backend**.

---

## 🧱 Tech Stack

- **Frontend (src):** React, React Router, Context API  
- **Backend (backend):** Spring Boot, Spring Data JPA, MySQL

---

## ⚙️ Prerequisites

Before running this project, make sure you have the following installed:

- **Java JDK 8** (or 11)  
- **Node.js** (includes npm)  
- **MySQL Server** (e.g., MySQL Community Server or XAMPP)  
- **Git**

---

## 🚀 How to Run the Project

You will need to run **two separate processes** in **two terminals**:
1. **Backend Server** – Spring Boot (port **8080**)  
2. **Frontend App** – React (port **3000**)

---

### 🖥️ 1. Backend Setup (Terminal 1)

#### A. Clone the Repository
```bash
git clone <your-repository-url>
cd petparade-master
```

#### B. Set Up the Database
Open your MySQL client (e.g., MySQL Workbench or DBeaver), then run the following SQL script:

```sql
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
```

#### C. Configure the Backend
Navigate to the backend folder:
```bash
cd backend
```

Open this file:  
`backend/src/main/resources/application.properties`

Edit the following lines to match your MySQL username and password:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pet_parade_db
spring.datasource.username=your_mysql_username  # <-- EDIT THIS
spring.datasource.password=your_mysql_password  # <-- EDIT THIS
```

#### D. Run the Backend
Run the Spring Boot application using the Maven wrapper:

**On Windows (PowerShell):**
```bash
.\mvnw spring-boot:run
```

**On macOS/Linux:**
```bash
./mvnw spring-boot:run
```

✅ The backend API will now be running at:
> http://localhost:8080/api

---

### 🌐 2. Frontend Setup (Terminal 2)

#### A. Open a New Terminal
From the project’s root folder:
```bash
cd petparade-master
```
(If you’re still in the backend folder, type `cd ..`)

#### B. Configure the Frontend
Create a new file named `.env` in the project root folder and add this line:
```env
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

> ⚠️ This fixes a known proxy issue with `package.json`.

#### C. Install Dependencies
Install all necessary React dependencies:
```bash
npm install
```

#### D. Run the Frontend
Start the React development server:
```bash
npm start
```

Your browser should automatically open to:
> http://localhost:3000

---

## 🧰 Troubleshooting

### ❌ PowerShell Script Error
If you see this error in your frontend terminal:
```
npm : File C:\... \npm.ps1 cannot be loaded because running scripts is disabled...
```

Run this command in **PowerShell** and press **Y** to confirm:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then, rerun:
```bash
npm install
npm start
```

---

## 🐶 Project Status
The application should now be fully running:  
- Backend API → **http://localhost:8080/api**  
- Frontend UI → **http://localhost:3000**

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
