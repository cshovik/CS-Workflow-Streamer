# 💙 CS Work Streamer – Workflow Builder

A visual workflow builder that lets users design automation sequences using drag-and-drop nodes.

Users can create steps, connect them, configure properties, and simulate execution.

---

## 🚀 Overview

**CS Work Streamer** is a dedicated workflow tool built specifically for the assignment to demonstrate **UI design** and **logical workflow execution**.

It provides:

* **Visual canvas** for graph editing
* **Workflow simulation** and logging
* **Validation rules** (Start/End required)
* **Node configuration forms** for custom properties
* **Simple UI** for testing and debugging workflows

---

## 🔥 Features

### 🎨 Visual Workflow Canvas

* **Drag & drop** nodes onto a grid
* Connect nodes with **arrows** (edges)
* **Zoom / pan** functionality (using **React Flow**)
* **Auto-fit** to viewport
* **Minimap** for quick navigation

### 🔢 Node Types Supported

| Node Type | Purpose |
| :--- | :--- |
| **Start** | Beginning of the workflow |
| **Task** | Manual action with an assignee |
| **Approval** | Manager or role-based approval step |
| **Automation** | System action (mock API execution) |
| **End** | Completion & summary |

### ⚙️ Node Configuration Panel

Clicking a node opens a dedicated configuration form. Editable properties include:

* ✔ Node label / title
* ✔ Metadata fields
* ✔ Role, assignee, summary, description, etc. (based on node type)

### 🧪 Test & Debug Panel

Includes:

* **Validation** (e.g., Start + End nodes required)
* **Simulation output panel**
* **Ordered logs** showing each execution step

> **Example Output:**
>
> ```text
> Step 1: [START] Start
> Step 2: [TASK] Task assigned
> Step 3: [APPROVAL] Approved
> Step 4: [AUTOMATION] Executed action
> Step 5: [END] Completed
> ✓ Workflow simulation completed
> ```

---

## 🏗️ Architecture Overview

### 1️⃣ Canvas Rendering (React Flow)

Used for:

* Node rendering
* Edge creation / connection
* Drag / zoom and minimap
> This is the most reliable solution for creating a graph editor UI.

### 2️⃣ State Management

The core workflow state is managed using React Flow's state hooks:

* `useNodesState()`
* `useEdgesState()`

Node updates happen efficiently in-place by calling `updateNodeData(id, newData)` to preserve graph layout.

### 3️⃣ Node Editing

Each node type supports a different set of configurable fields, ensuring the configuration panel is context-aware:

| Node Type | Editable Fields |
| :--- | :--- |
| **Start** | Metadata rows |
| **Task** | Description, assignee, due date |
| **Approval** | Role, approval threshold |
| **Automation** | Action dropdown, parameters |
| **End** | Summary text |

### 4️⃣ Mock API Layer

* Implemented in `mockApi.ts`.
* Simulates the **Automation** node with a small async delay.
* Generates the ordered log output used in the Test Panel.
* **No real network dependency**, ensuring fast and reliable testing.

---

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone [https://github.com/YOUR_USERNAME/CS-Work-Streamer.git](https://github.com/YOUR_USERNAME/CS-Work-Streamer.git)
cd CS-Work-Streamer

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
