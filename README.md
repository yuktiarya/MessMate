# MessMate - Full Stack Project

This project is a complete Hostel Mess Feedback Analyzer built with a Vanilla JavaScript frontend and a Node.js/Express.js backend using MongoDB Atlas.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, Chart.js
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas

## 🚀 Setup Instructions

### 1. Database Setup
1. Log into your [MongoDB Atlas](https://cloud.mongodb.com/) account.
2. Create a cluster and get your connection string (URI).
3. Open `backend/.env` and replace the placeholder `<username>:<password>@cluster0...` with your actual MongoDB URI.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   npm run dev
   ```
   You should see messages saying `Server running on port 5000` and `MongoDB Connected`.

### 3. Frontend Setup
Because this project now uses the `fetch` API to communicate with the backend, you need to run the frontend through a local development server (not just double-clicking the `index.html` file).

1. In VS Code, install the **Live Server** extension.
2. Right-click on `index.html` and select **"Open with Live Server"**.
3. It should open in your browser (usually at `http://127.0.0.1:5500`).
4. Click on **Login** or **Explore Dashboard**.
5. Register a new student account, login, and explore!

## 📡 API Routes Available

### Auth
- `POST /api/auth/register` - Register a student
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Feedback
- `GET /api/feedback` - Get all feedbacks
- `POST /api/feedback` - Submit new feedback

### Complaints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - File a complaint
- `PUT /api/complaints/:id` - Update status

### Polls
- `GET /api/polls` - Get active polls
- `POST /api/polls/vote` - Vote in a poll
- `POST /api/polls` - Create a poll

### Menu
- `GET /api/menu` - Fetch today's menu
- `POST /api/menu` - Upload a new menu

### Analytics
- `GET /api/analytics` - Fetch statistics for Chart.js dashboards

---
**Designed by Yukti** | Built for College Portfolio Projects
