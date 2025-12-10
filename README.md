💙 CS Work Streamer – Workflow Builder

A visual workflow builder that lets users design automation sequences using drag-and-drop nodes.
Users can create steps, connect them, configure properties, and simulate execution.

🚀 Overview

CS Work Streamer provides:

Visual canvas

Workflow simulation

Validation rules

Node configuration forms

Simple UI for testing workflows

It was built specifically for the assignment to demonstrate UI design + logical workflow execution.

🔥 Features
🎨 Visual Workflow Canvas

Drag & drop nodes onto a grid

Connect nodes with arrows

Zoom / pan (React Flow)

Auto-fit to viewport

Minimap for navigation

🔢 Node Types Supported
Node Type	Purpose
Start	Beginning of workflow
Task	Manual action with assignee
Approval	Manager approval step
Automation	System action (mock API)
End	Completion & summary
⚙️ Node Configuration Panel

Clicking a node opens a configuration form

Editable properties include:

✔ Node label / title
✔ Metadata fields
✔ Role, assignee, summary, etc.

🧪 Test & Debug Panel

Includes:

Validation (Start + End nodes required)

Simulation output panel

Ordered logs showing each step

Example output:

Step 1: [START] Start
Step 2: [TASK] Task assigned
Step 3: [APPROVAL] Approved
Step 4: [AUTOMATION] Executed action
Step 5: [END] Completed
✓ Workflow simulation completed

📁 Project Structure
src/
│
├─ App.tsx              # Main UI & workflow renderer
├─ workflowTypes.ts     # TypeScript models
├─ mockApi.ts           # Workflow simulation + async actions
├─ index.css            # Global styles
├─ main.tsx             # App mount
└─ index.html           # Vite entry file

🏗️ Architecture Overview
1️⃣ Canvas Rendering (React Flow)

Used for:

Node rendering

Edge creation

Drag / zoom

Minimap & viewport controls

This is the most reliable solution for graph editors.

2️⃣ State Management

State is managed using:

useNodesState()
useEdgesState()


Node updates happen in-place by:

updateNodeData(id, newData)

3️⃣ Node Editing

Each node type supports different fields:

Node Type	Editable Fields
Start	Metadata rows
Task	Description, assignee, due date
Approval	Role, threshold
Automation	Action dropdown, parameters
End	Summary text
4️⃣ Mock API Layer

Implemented in mockApi.ts.

Simulates automation with async delay

Generates ordered log output

No real network dependency

5️⃣ Workflow Testing

When user clicks Test Workflow:

✔ Validate structure
✔ Simulate step execution
✔ Display log results

Validation includes:

At least 1 Start

At least 1 End

(Advanced validation like cycle detection is not added to avoid complexity.)

🛠️ Installation & Setup
# Clone repository
git clone https://github.com/YOUR_USERNAME/CS-Work-Streamer.git
cd CS-Work-Streamer

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:5173

🎯 How It Works

Drag nodes onto canvas

Connect them with arrows

Click node to configure

Click Test Workflow

Logs appear on bottom panel

⚡ Completed vs Future Work
✅ Completed

Visual workflow editor

Node connections

Node editing panel

Simulation with logs

Light/Dark theme toggle

Clean UI

🚧 Future Enhancements

Cycle detection

Export/Import workflow JSON

Real automation API

Dashboard metrics

Permissions & roles

🧾 Assignment Requirements
Requirement	Status
Workflow canvas	✅ Done
Node editing panel	✅ Done
Mock API layer	✅ Done
Testing / Sandbox panel	✅ Done
Architecture explanation	✅ Done
