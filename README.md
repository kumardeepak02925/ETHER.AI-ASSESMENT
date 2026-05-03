# 📌 ETHER.AI - Team Task Manager
## Full-Stack Web Application

A complete project and task management system with role-based access control, team collaboration, and real-time task tracking.

---

## 🚀 Key Features
++
### ✅ **Authentication System**
- **Signup/Login** with email and password
- **JWT Token-based** authentication
- **Role-based access** (Admin/Member)
- **Secure token storage** in localStorage
- **Automatic logout** on invalid/expired tokens

### ✅ **Project Management**
- **Create projects** (Admin only)
- **Add team members** to projects
- **Manage member roles** (Admin/Member)
- **View all assigned projects**
- **Project details** with member list

### ✅ **Task Management**
- **Create tasks** with title, description, priority, and due date
- **Assign tasks** to team members
- **Update task status** (To Do → In Progress → Completed)
- **Overdue task detection** (automatic highlighting)
- **Priority levels** (Low, Medium, High)
- **Task filtering** by status

### ✅ **Dashboard & Analytics**
- **Task overview** with stats (Total, Todo, In Progress, Completed, Overdue)
- **Personal task dashboard** for each user
- **Visual task board** (Kanban-style) per project
- **Overdue tasks alert** section
- **Project-based task tracking**

### ✅ **Role-Based Access Control**
- **Admin**: Create projects, add/remove members, create/delete tasks, manage roles
- **Member**: View projects, see assigned tasks, update task status
- **Route protection**: Unauthorized access is blocked

---

## 🏗️ **Tech Stack**

### Backend
- **Node.js + Express.js** - Server framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **dotenv** - Environment variables

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

---

## 📂 **Project Structure**

```
BACKEND/
├── models/
│   ├── User.js          # User schema
│   ├── Project.js       # Project schema with members
│   └── Task.js          # Task schema with status & assignments
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── projectController.js  # Project CRUD & member management
│   └── taskController.js     # Task CRUD & dashboard
├── middleware/
│   └── authMiddleware.js     # JWT verification & role-based access
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── projectRoutes.js      # Project endpoints
│   └── taskRoutes.js         # Task endpoints
├── config/
│   └── db.js            # MongoDB connection
├── server.js            # Main server file
└── .env                 # Environment variables

FRONTEND/
├── src/
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── Dashboard.jsx       # Projects list
│   │   ├── TaskBoard.jsx       # Kanban board for project tasks
│   │   └── TaskDashboard.jsx   # Personal task overview
│   ├── componets/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── TaskCard.jsx        # Individual task card
│   │   └── Members.jsx         # Project members management
│   ├── services/
│   │   └── api.js              # Axios configuration with interceptors
│   ├── App.jsx                 # Routes definition
│   └── main.jsx                # App entry point
```

---

## 🔐 **API Endpoints**

### Authentication
```
POST   /api/auth/signup        - Create new account
POST   /api/auth/login         - Login and get JWT token
```

### Projects
```
GET    /api/projects           - Get all user's projects
POST   /api/projects           - Create new project
GET    /api/projects/:id       - Get project details
POST   /api/projects/:id/add-member         - Add team member
DELETE /api/projects/:id/remove-member      - Remove team member
PUT    /api/projects/:id/update-member-role - Change member role
```

### Tasks
```
POST   /api/tasks                    - Create task
GET    /api/tasks/project/:projectId - Get project tasks
GET    /api/tasks/:id                - Get task details
PUT    /api/tasks/:id                - Update task (status, assign, etc)
DELETE /api/tasks/:id                - Delete task (admin only)
GET    /api/tasks/dashboard/overview - Get user's task overview
```

---

## 🎯 **User Workflows**

### **Admin Workflow**
1. **Sign Up** → Create account as Admin
2. **Create Project** → Add name and description
3. **Add Members** → Search and add team members
4. **Create Tasks** → Assign tasks to members
5. **Monitor** → Track progress on task board and dashboard
6. **Manage** → Update task status, reassign, or delete

### **Member Workflow**
1. **Sign Up** → Create account as Member
2. **View Projects** → See assigned projects
3. **View Tasks** → See tasks assigned to you
4. **Update Status** → Move tasks across board (if allowed)
5. **Track Progress** → View task dashboard

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- npm or yarn

### Installation

**1. Clone & Setup Backend**
```bash
cd BACKEND
npm install
cp .env.example .env
# Update .env with MongoDB URI and JWT secret
npm start
```

**2. Clone & Setup Frontend**
```bash
cd FRONTEND/vite-project
npm install
npm run dev
```

**3. Access Application**
- Frontend: `http://localhost:5175`
- Backend: `http://localhost:5000`

---

## 🔧 **Environment Variables**

**.env (Backend)**
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key
```

---

## 📊 **Database Schema**

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/member),
  createdAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  createdBy: User ref,
  members: [{
    user: User ref,
    role: String (admin/member)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (todo/in-progress/completed),
  priority: String (low/medium/high),
  assignedTo: User ref,
  project: Project ref,
  createdBy: User ref,
  dueDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✨ **Features in Detail**

### Task Status Management
- **To Do** (default) - New tasks
- **In Progress** - Currently being worked on
- **Completed** - Done and closed

### Priority Levels
- **Low** - Can wait
- **Medium** - Normal priority (default)
- **High** - Urgent, needs attention

### Overdue Detection
- Automatically highlights tasks past due date
- Shows overdue count in dashboard
- Special overdue tasks section for users

### Role-Based Permissions
| Feature | Admin | Member |
|---------|-------|--------|
| Create Project | ✅ | ❌ |
| Add Members | ✅ | ❌ |
| Create Task | ✅ | ❌ |
| Update Task Status | ✅ | ✅ |
| Delete Task | ✅ | ❌ |
| View Dashboard | ✅ | ✅ |

---

## 🧪 **Testing Checklist**

- [ ] **Auth**: Signup, Login, Logout
- [ ] **Projects**: Create, View, Add members
- [ ] **Tasks**: Create, Update status, Delete
- [ ] **Dashboard**: View stats, See overdue tasks
- [ ] **Task Board**: Kanban board view, Drag & drop
- [ ] **Role-based**: Admin can delete, Member cannot
- [ ] **Token**: Refresh on page reload, Logout on expiry

---

## 🐛 **Troubleshooting**

### 401 Unauthorized
- Clear localStorage and login again
- Check if JWT_SECRET matches between frontend/backend

### Tasks not loading
- Verify user is member of project
- Check browser console for API errors
- Ensure backend is running on port 5000

### MongoDB connection error
- Verify MONGO_URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure internet connection

---

## 📝 **Future Enhancements**

- [ ] Task comments & collaboration
- [ ] Email notifications
- [ ] Task attachments
- [ ] Advanced filters & search
- [ ] Export to PDF/CSV
- [ ] Real-time updates with WebSocket
- [ ] Mobile app
- [ ] Dark mode

---

## 📄 **License**

MIT License - Feel free to use this project!

---

## 👨‍💻 **Support**

For issues or questions, please check the console logs and API responses first.

**Made with ❤️ by ETHER.AI Team**