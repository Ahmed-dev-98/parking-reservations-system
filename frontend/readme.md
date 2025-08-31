# How to Run the Parking Reservations System

This guide provides step-by-step instructions to run the complete parking reservations system, which consists of a backend server and a frontend application.


## System Overview

The application consists of two main components:

1. **Backend Server** - Express.js with WebSocket support (runs on port 3000) MAKE SURE TO RUN THIS FIRST
2. **Frontend Application** - Next.js React application (runs on port 3001)

## Step-by-Step Setup Instructions

### 1. Clone and Navigate to Project

```bash
git clone <repository-url>
cd parking-reservations-system
```

### 2. Backend Setup and Start

First, set up and start the backend server:

```bash
# Install backend dependencies
npm install

# Start the backend server
npm start
```

The backend server will start on **http://localhost:3000** with API endpoints available at **http://localhost:3000/api/v1**

**Backend Features:**

- REST API endpoints for parking management
- WebSocket connection for real-time updates
- In-memory database with seeded data
- Authentication system
- Admin controls for zones and pricing

### 3. Frontend Setup and Start

Open a new terminal window/tab and set up the frontend:

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Create .env File at the root of your frontend application and add the following variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3000/api/v1/ws
# Start the development server
npm run dev
```

The frontend application will start on **http://localhost:3001** (or the next available port)

**Frontend Features:**

- Modern React/Next.js interface
- Real-time parking zone updates
- Gate selection and management
- Checkpoint system for ticket processing
- Admin dashboard for system control

### 4. Access the Application

Once both servers are running, you can access:

- **Main Application**: http://localhost:3001
- **Backend API**: http://localhost:3000/api/v1
- **WebSocket**: ws://localhost:3000/api/v1/ws

## Default Login Credentials

The system comes with pre-seeded user accounts:

### Admin Account

- **Username**: `admin`
- **Password**: `adminpass`
- **Access**: Full system control, reports, configuration

### Employee Account

- **Username**: `emp1`
- **Password**: `pass1`
- **Access**: Gate operations, ticket management

## Application Workflows

### For Gate Operators (Employee Role)

1. Login with employee credentials
2. Navigate to Gates section
3. Select a gate to manage
4. Process check-ins and check-outs
5. View real-time zone availability

### For Administrators (Admin Role)

1. Login with admin credentials
2. Access admin dashboard
3. Manage parking zones (open/close)
4. Configure pricing and rush hours
5. View system reports and analytics
6. Manage employee accounts


### WebSocket Connection Issues

- Ensure backend is running before starting frontend
- Check firewall settings for ports 3000 and 3001
- Verify WebSocket URL in frontend configuration

## Data Reset

The application uses in-memory storage. To reset all data to initial state:

1. Stop the backend server (Ctrl+C)
2. Restart with `npm start`

All parking zones, tickets, and user data will return to the seeded state defined in `seed.json`.
