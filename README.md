# Milestone A – Note-Taking App

## 📋 Project Details
* **Course:** COMP 1350 – Web Administration
* **Students:** Tina Shabestari & Ria Bhullar
* **Project:** Milestone A – Note-Taking Application

---

## 1. Project Overview
For **Milestone A**, we are deploying a Note-Taking App using **Node.js**, **Express**, **PM2**, and **Nginx**. The goal of this milestone is to learn how to deploy a web application, manage backend processes, and configure a server to ensure continuous uptime.

## 2. Technologies Used
* **Node.js**: Runs the backend application.
* **Express.js**: Handles HTTP requests and application routes.
* **PM2**: Manages the Node.js application process and ensures process persistence.
* **Nginx**: Acts as a reverse proxy to handle incoming web traffic securely.
* **Ubuntu (WSL)**: Provides the Linux environment for local server deployment.
* **GitHub**: Stores the project files and source code version history.
* **Render**: Cloud deployment platform being considered for the live application.

## 3. Application Features & Requirements
The project focuses on the robust deployment of a basic note-taking application. The core deployment configurations include:
* Running the application smoothly using Node.js and Express.
* Configuring **PM2** to manage, monitor, and maintain the application process.
* Setting up **Nginx** as a reverse proxy.
* Securing the environment by making the application accessible through Nginx instead of exposing the raw Node.js port directly to the internet.
* Configuring the process manager to restart the application automatically if it crashes or the server reboots.

---

## 4. Local Deployment Setup
We utilized **Ubuntu** through **Windows Subsystem for Linux (WSL)** to configure the local deployment environment. 

### Step 1: Install dependencies
```bash
npm install
```

### Step 2: Start the application with PM2
```bash
pm2 start server.js --name note-taking-app
```

### Step 3: Check PM2 status
```bash
pm2 list
```

### Step 4: Save the PM2 process list
```bash
pm2 save
```
*Note: PM2 monitors the application background tasks, ensuring it restarts immediately if the process unexpectedly crashes.*

---

## 5. Nginx Reverse Proxy Configuration
We configured Nginx to securely forward incoming external requests to the Express application running locally on `127.0.0.1:3000`.

Below is the server configuration snippet used:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}
```

                                                                              

