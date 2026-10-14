Milestone A – Note-Taking App
Course: COMP 1350 – Web Administration
Student: Tina Shabestari and, Ria  Bhullar
Project: Milestone A – Note-Taking Application

1. Project Overview
For Milestone A, we are working on deploying a Note-Taking App using Node.js, Express, PM2, and Nginx.

The goal of this milestone is to learn how to deploy a web application and configure a server to keep it running.

2. Technologies Used
Node.js: Runs the backend application.

Express.js: Handles HTTP requests and application routes.

PM2: Manages the Node.js application process.

Nginx: Acts as a reverse proxy.

Ubuntu (WSL): Provides the Linux environment for local deployment.

GitHub: Stores the project files and source code.

Render: Cloud deployment platform being considered for the live application.

3. Application Features
The project focuses on deploying a basic note-taking application.

The main deployment requirements include:

Running the application using Node.js and Express.

Configuring PM2 to manage the application.

Setting up Nginx as a reverse proxy.

Making the application accessible through Nginx instead of exposing the Node.js port directly.

Configuring the application to restart automatically when needed.

4. Local Deployment Setup
We used Ubuntu through Windows Subsystem for Linux (WSL) to configure the local server.

Step 1: Install dependencies
npm install
Step 2: Start the application with PM2
pm2 start server.js --name note-taking-app
Step 3: Check PM2 status
pm2 list
Step 4: Save the PM2 process list
pm2 save
PM2 helps keep the application running and can restart it if the process crashes.

5. Nginx Reverse Proxy
We configured Nginx to forward incoming requests to the Express application running on 127.0.0.1:3000.

Example Nginx configuration:

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
After configuring Nginx, I can check the configuration using:

sudo nginx -t
Then restart Nginx:

sudo systemctl restart nginx
To test the reverse proxy:

curl -I http://localhost
The expected result is an HTTP response from the application through Nginx.

6. Deployment on Render
We selected Render as a possible platform for hosting the live version of the application.

Render provides managed hosting for Node.js applications. However, it does not use the same PM2 and Nginx setup as my local Ubuntu environment.

We plan to use the local setup to demonstrate PM2 and Nginx and the Render deployment to demonstrate public accessibility, subject to instructor approval.

7. Testing
The following commands are useful for checking the deployment:

Command	Purpose
pm2 list	Check the application process
pm2 logs	View application logs
sudo systemctl status nginx	Check Nginx status
sudo nginx -t	Test Nginx configuration
curl -I http://localhost	Test the reverse proxy
8. Challenges and Learning Experience
During this milestone, we experienced some challenges configuring PM2, Node.js, and Nginx in Ubuntu.

One issue was related to the Node.js installation path when configuring PM2 startup. We had to update the configuration so PM2 could use the correct Node.js version.

we also encountered a 502 Bad Gateway error while configuring Nginx. This helped us understand why the Express application needs to be running on the correct port for Nginx to forward requests successfully.

Overall, this milestone has helped me better understand how Node.js applications are deployed and managed on Linux servers.

9. Project Status
 Set up Ubuntu using WSL

 Install Node.js and npm

 Install and configure PM2

 Configure PM2 startup with systemd

 Install and configure Nginx

 Configure the Nginx reverse proxy

 Capture final deployment verification screenshots

 Confirm the Render deployment approach with the instructor

 Complete final testing and documentation

10. Conclusion
Milestone A has given me practical experience with deploying a Node.js application, managing processes with PM2, and configuring Nginx as a reverse proxy.

we learned how these tools work together to support a web application and how to troubleshoot common deployment issues.
                                                                               
                                                                              

