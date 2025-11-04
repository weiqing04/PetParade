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


#### B. Configure the Backend
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

#### C. Run the Backend
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
