# 🚀 Quick Start Guide - ETHER.AI

## 5-Minute Setup

### Step 1: Start Backend
```bash
cd BACKEND
npm start
```
Expected output: `Server running on port 5000` + `MongoDB Connected`

### Step 2: Start Frontend
```bash
cd FRONTEND/vite-project
npm run dev
```
Expected output: `VITE ... ready in ... ms` + `Local: http://localhost:517X`

### Step 3: Open Browser
Visit: `http://localhost:517X` (check terminal for exact port)

---

## 🔑 First Time Setup

### 1️⃣ **Create Admin Account**
- Click "Sign Up"
- Enter name, email, password
- Submit
- Role is automatically set to "admin" for first user (edit backend if needed)

### 2️⃣ **Login**
- Use your email and password
- Token is saved automatically

### 3️⃣ **Create a Project**
- Click "+ Create Project"
- Enter project name and description
- Click "Create"

### 4️⃣ **Add Team Members**
- Click on your project
- Click "Members" or scroll down
- Enter member email (they must have signed up)
- Select role (admin/member)
- Click "Add"

### 5️⃣ **Create Tasks**
- Click on project to open Task Board
- Click "+ New Task"
- Fill in details:
  - **Title** (required)
  - **Description** (optional)
  - **Due Date** (optional)
  - **Priority** (Low/Medium/High)
  - **Assign To** (select from project members)
- Click "Create"

### 6️⃣ **Manage Tasks**
- **Move task**: Click ⋮ on task card → Select new status
- **Delete task**: Click ⋮ on task card → Click "Delete"
- **View overview**: Click "📋 Tasks" in navbar

---

## 📋 Key Pages

### Login / Signup
- First page you see
- Create account or login
- Token saved automatically

### Dashboard (Projects)
- Shows all projects you're part of
- Click project to see tasks
- "+" button to create new project (admin only)

### Task Board
- Kanban-style board with 3 columns
- **To Do** | **In Progress** | **Completed**
- Drag tasks between columns (click ⋮ to change status)
- Create new tasks (admin only)

### Task Overview
- Click "📋 Tasks" in navbar
- See all your assigned tasks
- Stats: Total, To Do, In Progress, Completed, Overdue
- Overdue tasks highlighted in red

---

## 👥 User Types

### Admin
- Create projects ✅
- Add/remove members ✅
- Create tasks ✅
- Delete tasks ✅
- Update task status ✅
- See dashboard ✅

### Member
- View assigned projects ✅
- See assigned tasks ✅
- Update own task status ✅
- View dashboard ✅
- Cannot create projects ❌
- Cannot delete tasks ❌

---

## ⏰ Task Priority & Dates

### Priority Levels
- **🔴 High** - Urgent, needs attention ASAP
- **🟡 Medium** - Normal priority (default)
- **🟢 Low** - Can wait

### Overdue Tasks
- Tasks with past due date show red alert
- Automatically listed in "Overdue" section
- Only counted if status ≠ "Completed"

---

## 🔐 Authentication

### Tokens & Security
- JWT tokens valid for 1 day
- Automatic login on page refresh (if token valid)
- Logout clears token from localStorage
- 401 errors = token invalid/expired → auto redirects to login

---

## ⚠️ Common Issues

### Can't see projects?
→ You must be added to project as member first

### Can't create tasks?
→ Only admins can create tasks

### 401 Unauthorized?
→ Token expired - click Logout and login again

### Tasks not showing?
→ Refresh page or check browser console for errors

---

## 📊 Example Workflow

```
1. Admin creates project "Q1 Planning"
   ↓
2. Admin adds John & Sarah as members
   ↓
3. Admin creates tasks:
   - "Setup Database" (assign to John, due: Mar 15)
   - "Design UI" (assign to Sarah, due: Mar 20)
   - "Write Docs" (unassigned, due: Mar 25)
   ↓
4. John starts task "Setup Database"
   - Clicks ⋮ → Changes status to "In Progress"
   ↓
5. Sarah completes task "Design UI"
   - Clicks ⋮ → Changes status to "Completed"
   ↓
6. Admin monitors on Dashboard
   - Sees 1 To Do, 1 In Progress, 1 Completed
   - Sees "Write Docs" is overdue
```

---

## 🛠️ API Testing (Optional)

### Login & Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Get Projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ✅ You're Ready!

Start building! Remember:
- Admins create projects & tasks
- Everyone can update task status
- Check navbar for quick navigation
- Use Task Overview to see all your work

**Happy task managing! 🎯**