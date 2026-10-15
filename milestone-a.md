# COMP 1350 – Milestone A: Note-Taking Application

**Course:** COMP 1350 – Web Administration  
**Project:** Note-Taking Application  
**Technologies:** HTML, CSS, JavaScript, Node.js, Express, PM2, Nginx, and Render

## 1. Project Overview

For our Milestone A project, we created a simple note-taking web application where users can add, view, edit, and delete their notes.

We used HTML, CSS, and JavaScript for the frontend and Node.js with Express for the backend. The notes are currently stored in a JSON file.

We also deployed our application to Render so it can be accessed online. Along with the live deployment, we set up PM2 and Nginx locally using Ubuntu WSL to practice managing a Node.js application and configuring a reverse proxy. We also configured Nginx on a Linux Mint machine to implement and test the reverse proxy, TLS, and getting the app to redirect HTTP to HTTPS.

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

We also configured Nginx as a reverse proxy in our local Ubuntu WSL and Linux Mint environment.

Instead of accessing the Express backend directly, Nginx receives the HTTP requests and forwards them to our application running on `127.0.0.1:3000`.

The main part of our reverse-proxy configuration is:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
}
```

In this configuration, `location /` tells Nginx which requests to handle, while `proxy_pass` sends those requests to our Express application.

We used `127.0.0.1` so the backend would only listen locally rather than directly on a public network interface.

Our live Render deployment uses Render's managed routing instead of our local Nginx configuration. We are confirming with our instructor whether we can use the local setup as evidence for this requirement.

For local testing on the Linux Mint machine, we used these server blocks.
The first server block is listening on port 80 and redirects HTTP to HTTPS. The second server listens on port 443 with a self-signed TLS certificate, and sends requests forwards to the express app at `127.0.0.1:3000` with `proxy_set_header` passing headers/information to the backend.

```nginx
    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        server_name localhost _;

        return 301 https://localhost$request_uri;
    }

    server {
        listen 443 ssl;
        listen [::]:443 ssl;

        server_name localhost;

        ssl_certificate /etc/nginx/ssl/localhost.crt;
        ssl_certificate_key /etc/nginx/ssl/localhost.key;

        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_cache_bypass $http_upgrade;
        }
    }
```

To test the handling, we first confirmed the nginx syntax was valid, and then ran some curl commands as tests. This first one curls the HTTP address, which shows it has redirected permanently.

```cli
curl -I http://localhost 
```

This next command curls the secure address and responds OK with headers, showing responses go here instead.

```cli
curl -k -I https://localhost
```

The certificate is self-signed and intended for local testing. The public Render deployment uses Render's managed routing, separate from this local Nginx configuration.

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
