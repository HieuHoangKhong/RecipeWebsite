RecipeWebsite

A full-stack web application for browsing, searching, adding, editing, and deleting recipes. Designed with responsiveness, clean UI, and beginner-friendly React + Node.js architecture.

Features
---------------------------------------------------------------------------------------

- View recipe details including ingredients and step-by-step instructions
- Search recipes by name or ingredient
- Filter recipes by category (Breakfast, Entree, Desserts, etc.)
- Add new recipes with images
- Edit existing recipes
- Delete recipes
- View all ingredients and find recipes that use them


**Frontend:**
---------------------------------------------------------------------------------------
- React
- React Router
- Bootstrap/Tailwind (custom styling)

**Backend:**
----------------------------------------------------------------------------------------
- Node.js with Express
- MySQL (via MySQL dump format)
- Multer (for image uploads)
- CORS-enabled API

#Start
---------------------------------------------------------------------------------------

#1. Install Dependencies
- By Creating a new terminal, go to Bash and install dependencies by command:

npm install


2# May need these dependencies for full functionality:
npm install pluralize react react-dom react-router-dom


#3. Import the Database
------------------------------------------------------------------------------------------

The SQL file `recipes.sql` is included in this project folder.

Using phpMyAdimin...

1. Go to http://localhost/phpmyadmin or if you are using xampp, start apache and MySQL, then click "admin" on MySQL to open the url.
2. Create a new database called 'recipes'
3. Click on the new database, go to the **Import** tab
4. Choose the `recipes.sql` file and click **Go**


#4. Start the Server

1. In bash terminal in visual studio code, type 'npm run start' to start the server

2. In possibly another new bash terminal, type 'npm run dev' to start the website.

Server runs at `http://localhost:4000`.



*License*

MIT License — free to use and modify. <--- Not sure if this is true
***All images used are free to use and to modify***
I have use resources to re-learn/learn concepts.
Resources: Youtube, Chatgpt, W3schools,developer.mozilla.org, javascript.info, and more
