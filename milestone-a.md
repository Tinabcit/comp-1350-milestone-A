# COMP 1350 – Milestone A: Note-Taking Application

**Course:** COMP 1350 – Web Administration  
**Project:** Note-Taking Application  
**Technologies:** HTML, CSS, JavaScript, Node.js, Express, PM2, Nginx, and Render

## 1. Project Overview

For our Milestone A project, we created a simple note-taking web application where users can add, view, edit, and delete their notes.

We used HTML, CSS, and JavaScript for the frontend and Node.js with Express for the backend. The notes are currently stored in a JSON file.

We also deployed our application to Render so it can be accessed online. Along with the live deployment, we set up PM2 and Nginx locally using Ubuntu WSL to practice managing a Node.js application and configuring a reverse proxy.

**Live Website:** https://comp-1350-milestone-a.onrender.com

**GitHub Repository:** https://github.com/Tinabcit/comp-1350-milestone-A

## 2. PM2 Setup

For our local setup, we used PM2 to keep the Node.js application running instead of manually starting it with `node server.js` every time.

We used the following commands to check and save our application process:

```bash
pm2 list
pm2 save
```

When we checked `pm2 list`, our `note-taking-app` showed an online status. We also configured PM2 to start automatically and tested that it was still working after restarting Ubuntu WSL.

This helped us understand how process managers can keep backend applications running.

## 3. Nginx Reverse Proxy

We also configured Nginx as a reverse proxy in our local Ubuntu WSL environment.

Instead of accessing the Express backend directly, Nginx receives the HTTP requests and forwards them to our application running on `127.0.0.1:3000`.

The main part of our reverse-proxy configuration is:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

In this configuration, `location /` tells Nginx which requests to handle, while `proxy_pass` sends those requests to our Express application.

We used `127.0.0.1` so the backend would only listen locally rather than directly on a public network interface.

To test the setup, we used:

```bash
curl -I http://localhost
```

Our earlier test returned `200 OK` with Nginx and Express headers, showing that the local reverse proxy was working.

Our live Render deployment uses Render's managed routing instead of our local Nginx configuration. We are confirming with our instructor whether we can use the local setup as evidence for this requirement.

## 4. Deployment to Render

After finishing our application locally, we uploaded our project to GitHub and connected the repository to Render.

For the deployment, we used:

- **Branch:** `main`
- **Build Command:** `npm ci`
- **Start Command:** `npm start`

We also updated our `server.js` file so it could work in both environments. Locally, Express listens on `127.0.0.1:3000`, while on Render it uses the assigned port and listens on `0.0.0.0`.

After deploying, we opened the live website and tested adding a note. The note appeared under Saved Notes and was still there after refreshing the page.

One limitation is that Render's standard filesystem is temporary, so saved notes may be lost after a restart or redeployment.

## 5. Problems We Encountered

We ran into a few problems while setting up and deploying our application.

**PM2 startup issue:** At first, PM2 was not starting properly through systemd. We had to check the service configuration, fix the environment settings, and restart the service. After that, we tested it again and confirmed that PM2 was running.

**Windows IIS conflict:** When we tried opening `localhost` in Chrome, the IIS welcome page appeared instead of our note-taking application. We realized that Windows IIS was also using port 80. To solve this, we accessed our Nginx application through the Ubuntu WSL IP address.

**Render deployment:** Our Express server was originally configured to listen only on `127.0.0.1:3000`. We needed to adjust the configuration so Render could access the application using its assigned port.

Working through these issues helped us better understand how web servers, reverse proxies, and process managers work together.

## 6. Conclusion

Overall, we were able to build and deploy our note-taking application successfully.

We learned how to use PM2 to manage a Node.js application, how Nginx forwards requests to an Express backend, and how to deploy a project from GitHub to Render.
