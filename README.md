# 💙 CS Work Streamer – Workflow Builder

A visual workflow builder that lets users design automation sequences using drag-and-drop nodes.

Users can create steps, connect them, configure properties, and simulate execution.

---

## 🚀 Overview

**CS Work Streamer** is a dedicated workflow tool built specifically for the assignment.  
It provides:

* **Visual canvas** for graph editing  
* **Workflow simulation** and logging  
* **Validation rules** (Start/End required)  
* **Node configuration forms**

The goal is to demonstrate:
✔ UI design  
✔ Logical workflow execution  
✔ Simple UX for testing scenarios

---

## 🎨 Features

### 🖼️ Visual Workflow Canvas

* Drag & drop nodes onto a grid  
* Connect nodes with arrows  
* Zoom / pan (React Flow)  
* Auto-fit inside viewport

---

### 🔢 Node Types Supported

| Node Type     | Purpose                         |
|-------------- |-------------------------------- |
| **Start**     | Beginning of workflow           |
| **Task**      | Manual action with assignee     |
| **Approval**  | Manager approval step           |
| **Automation**| System action (mock API)        |
| **End**       | Completion + summary            |

---

### ⚙️ Node Configuration Panel

Each node has editable properties:

✔ **Label / Title**  
✔ **Properties based on node type**  
✔ **Metadata, parameters, custom fields**  
✔ **Dynamic input fields**

---

## 🧪 Test & Debug Panel

Includes:

* Validation (Start + End nodes required)
* Simulation output panel
* Colored log messages

Example output:
Start → Task → Approval → Automation → End
Workflow completed successfully


## 📁 Project Structure

```bash
CS-Workflow-Streamer/
├── public/
│   └── index.html            # HTML host
│
├── src/
│   ├── assets/               # Icons & images
│   ├── App.css               # Styling for app components
│   ├── App.tsx               # Main application & canvas
│   ├── index.css             # Global styles
│   ├── main.tsx              # React entry point
│   ├── mockApi.ts            # Simulated automation actions
│   └── workflowTypes.ts      # Node types and interfaces
│
├── vite.config.ts            # Vite build configuration
├── package.json              # Dependencies & scripts
├── package-lock.json         # Dependency lock file
├── tsconfig.json             # TypeScript config
├── tsconfig.app.json         # App TypeScript config
├── tsconfig.node.json        # Node TypeScript config
├── eslint.config.js          # ESLint rules
└── README.md                 # Documentation

```

## 🏗 Architecture Overview

### 1️⃣ Canvas Rendering

Built using **React Flow** for:

* Node rendering  
* Edge creation  
* Drag/zoom  
* Mini-map & controls

This is the most reliable solution for graph-based editors.

---

### 2️⃣ Node Storage

State managed using:
useNodesState()
useEdgesState()

Nodes update in-place via:
updateNodeData(id, newData)


---

### 3️⃣ Forms for Editing

Each node opens a configuration form on the right:

* **Start** → metadata rows  
* **Task** → description, due date  
* **Approval** → role, threshold  
* **Automation** → parameters  
* **End** → completion message  

---

## 🛠 Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/CS-Workflow-Streamer.git](https://github.com/cshovik/CS-Workflow-Streamer.git

# Install dependencies
npm install

# Run locally
npm run dev

# Open browser
http://localhost:5173

```

##🎯 How It Works

1️⃣ Drag nodes onto the canvas.\
2️⃣ Connect them with arrows.\
3️⃣ Edit configuration in the side panel.\
4️⃣ Click Test Workflo.\
5️⃣ Logs appear at the bottom.\

##🔮 Future Enhancements

1️⃣ Cycle detection (detect loops.\
2️⃣ Export / Import workflow JSON.\
3️⃣ Metrics dashboard.\
4️⃣ Real automation API calls.\

## Screenshot
<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/42436b73-9aa4-4084-8aed-7f2771084d01" />



