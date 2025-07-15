# final-project
# NowFit
# NOWFit - Full-Stack Fitness Coaching Platform

![NOWFit Admin Dashboard Screenshot](./public/readme-assets/dashboard-preview.png)

**NOWFit** is a comprehensive, full-stack SaaS platform designed to empower fitness coaches and personal trainers to manage their entire business from a single, intuitive application. The project features three distinct portals—for the Platform Admin, for Coaches, and for their Clients—all powered by a robust Node.js backend and a RESTful API.

The system moves beyond simple data tracking by providing dynamic, interactive "builder" interfaces for creating bespoke workout programs and nutrition plans, complete with live macronutrient tracking and customizable, drag-and-drop dashboards.

---

## ✨ Key Features

The platform is segregated into distinct portals, each with a rich feature set:

### 👑 **Admin Portal**
*   **Secure Dashboard:** At-a-glance overview of platform metrics like total coaches, active clients, and revenue.
*   **User Management:** Full CRUD (Create, Read, Update, Delete) capabilities for both Coaches and their Clients.
*   **Content Library Management:** Centralized control over the master libraries for Exercises, Ingredients, and Recipes, providing a baseline of high-quality content for all coaches.
*   **Package Management:** Create and manage subscription package templates that coaches can offer to their clients.
*   **Financial Oversight:** A complete log of all transactions with commission tracking.
*   **CMS & Category Control:** Manage static content (like Privacy Policy) and the platform's organizational categories.

![Admin User Management](./public/readme-assets/admin-table.png)

### 💪 **Coach Portal (The Core Product)**
*   **Interactive Client Dashboard:** A customizable, widget-based "cockpit" view for each client, featuring drag-and-drop panels for progress, plans, and goals. (Built with GridStack.js)
*   **Workout Program Builder:** A dynamic two-panel interface for creating reusable, day-by-day workout program templates from the exercise library.
*   **Meal Plan Builder:** An advanced tool for crafting detailed meal plans with a live-updating macronutrient and calorie counter, visualized with a Chart.js graph.
*   **Assignment Center:** A centralized hub to assign workout programs, meal plans, and daily habits to clients.
*   **Client Management:** A dedicated view for the coach's own roster of clients.

![Coach's Client Profile](./public/readme-assets/coach-client-profile.png)
![Meal Plan Builder](./public/readme-assets/meal-plan-builder.png)

### 🏋️ **Client Portal**
*   **Simple & Motivational Dashboard:** A clean interface focused on "today's tasks," showing the scheduled workout, nutrition targets, and habits.
*   **Program Viewing:** Detailed views for their assigned workout schedule and daily meal plans.
*   **Profile Management:** Clients can update their own profile information and profile picture.
*   **(Future) Progress Logging:** Designed to support logging workout performance (sets, reps, weight) and progress photos.

---

## 🛠️ Technology Stack

This project leverages a modern, full-stack JavaScript ecosystem.

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB with Mongoose (ODM)
*   **Frontend (Admin & Coach Portals):** EJS (Embedded JavaScript templates) for server-side rendering, styled with custom CSS.
*   **Frontend Libraries:** jQuery, AJAX for dynamic data fetching, Chart.js for data visualization, and GridStack.js for the draggable dashboard widgets.
*   **Authentication:** JWT (JSON Web Tokens) and bcrypt.js for password hashing.
*   **File Handling:** Multer for handling file uploads (e.g., exercise media, profile pictures).

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v14 or higher recommended)
*   npm (or yarn)
*   MongoDB (local instance or a cloud service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/nowfit-platform.git
    cd nowfit-platform
    ```

2.  **Install backend dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add your environment variables.
    ```env
    NODE_ENV=development
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  **Seed the database (Optional):** You can use a script or a tool like MongoDB Compass to import the dummy data located in `/data/seeds/`. This will populate your database with initial users, exercises, and recipes.

5.  **Run the server:**
    ```sh
    npm run start
    ```
    The application should now be running at `http://localhost:3000`.

---

## 📂 Project Structure

```
.
├── controllers/      # Handles business logic for API routes
│   ├── admin/
│   ├── coach/
│   └── client/
├── middleware/       # Custom middleware (e.g., authentication, error handling)
├── models/           # Mongoose schemas and models
├── public/           # Static assets (CSS, JS, images)
├── routes/           # Express route definitions
├── views/            # EJS templates
│   ├── admin/
│   ├── coach/
│   ├── client/
│   └── layouts/      # Partials (header, sidebar, etc.)
└── server.js         # The main server entry point
```

---

## 👤 Author

**[Your Name]**

*   GitHub: [@your-username](https://github.com/your-username)
*   LinkedIn: [linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)

If you have any questions or feedback, feel free to reach out!

---