// src/App.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  Handle,
  Position,
} from 'reactflow';

import type { Connection, Node, NodeProps } from 'reactflow';

import type {
  AutomationAction,
  NodeKind,
  WorkflowNodeData,
} from './workflowTypes';

import { fetchAutomationActions, simulateWorkflow } from './mockApi';

// ---------------------------
// Node labels & colors
// ---------------------------

const nodeTypeLabel: Record<NodeKind, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automation: 'Automated Step',
  end: 'End',
};

const nodeBackgroundColor: Record<NodeKind, string> = {
  start: '#dcfce7',
  task: '#e0f2fe',
  approval: '#fef9c3',
  automation: '#ede9fe',
  end: '#fee2e2',
};

// ---------------------------
// Custom node component
// ---------------------------

type WorkflowNodeProps = NodeProps<WorkflowNodeData>;

const WorkflowNode: React.FC<WorkflowNodeProps> = ({ data }) => {
  let metaPreview = '';

  if (data.type === 'start') {
    const pairs = data.metadata
      .filter((m) => m.key || m.value)
      .slice(0, 3)
      .map((m) => `${m.key}:${m.value}`);
    if (pairs.length > 0) {
      metaPreview = pairs.join(', ');
    }
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="wf-node">
        <div className="wf-node-header">
          <span className={`wf-pill wf-pill-${data.type}`}>
            {nodeTypeLabel[data.type]}
          </span>
        </div>
        <div className="wf-node-title">{data.label}</div>

        {data.type === 'start' && metaPreview && (
          <div className="wf-node-meta">
            <span className="wf-node-meta-label">Metadata:</span>{' '}
            <span className="wf-node-meta-value">{metaPreview}</span>
          </div>
        )}

        {data.type === 'task' && (
          <div className="wf-node-meta">
            <span className="wf-node-meta-label">Assignee:</span>{' '}
            <span className="wf-node-meta-value">
              {data.assignee || 'Unassigned'}
            </span>
          </div>
        )}

        {data.type === 'approval' && (
          <div className="wf-node-meta">
            <span className="wf-node-meta-label">Role:</span>{' '}
            <span className="wf-node-meta-value">{data.approverRole}</span>
          </div>
        )}

        {data.type === 'automation' && (
          <div className="wf-node-meta">
            <span className="wf-node-meta-label">Action:</span>{' '}
            <span className="wf-node-meta-value">
              {data.actionId || 'Not selected'}
            </span>
          </div>
        )}

        {data.type === 'end' && (
          <div className="wf-node-meta">
            <span className="wf-node-meta-label">Summary:</span>{' '}
            <span className="wf-node-meta-value">
              {data.showSummary ? 'Shown' : 'Hidden'}
            </span>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const nodeTypes = {
  workflow: WorkflowNode,
};

// ---------------------------
// Helpers
// ---------------------------

let idCounter = 1;
const getId = () => `node-${idCounter++}`;

function createDefaultData(kind: NodeKind): WorkflowNodeData {
  switch (kind) {
    case 'start':
      return {
        type: 'start',
        label: 'Start',
        metadata: [{ key: 'source', value: 'web' }],
      };
    case 'task':
      return {
        type: 'task',
        label: 'Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: [],
      };
    case 'approval':
      return {
        type: 'approval',
        label: 'Approval',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      };
    case 'automation':
      return {
        type: 'automation',
        label: 'Automated step',
        actionId: '',
        params: {},
      };
    case 'end':
    default:
      return {
        type: 'end',
        label: 'End',
        message: 'Workflow completed',
        showSummary: true,
      };
  }
}

// ---------------------------
// Main workflow app
// ---------------------------

function WorkflowAppInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  // THEME STATE (light / dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // set initial theme on mount
  useEffect(() => {
    document.body.setAttribute('data-theme', 'light');
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      return next;
    });
  };

  useEffect(() => {
    fetchAutomationActions().then(setActions);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<WorkflowNodeData>) => {
      setSelectedNodeId(node.id);
    },
    [],
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const addNode = (kind: NodeKind) => {
    const id = getId();
    const position = { x: 150 + nodes.length * 40, y: 80 + nodes.length * 40 };
    const data = createDefaultData(kind);

    const node: Node<WorkflowNodeData> = {
      id,
      position,
      data,
      type: 'workflow',
      style: {
        borderRadius: 16,
        padding: 0,
        border: '1px solid #cbd5f5',
        backgroundColor: nodeBackgroundColor[kind],
        minWidth: 180,
        boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
      },
    };

    setNodes((nds) => [...nds, node]);
    setSelectedNodeId(id);
  };

  const updateNodeData = (id: string, newData: Partial<WorkflowNodeData>) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== id) return n;
        return {
          ...n,
          data: { ...n.data, ...newData } as WorkflowNodeData,
        };
      }),
    );
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
    );
    setSelectedNodeId(null);
  };

  const validateWorkflow = (): string[] => {
    const problems: string[] = [];
    const startCount = nodes.filter((n) => n.data.type === 'start').length;
    const endCount = nodes.filter((n) => n.data.type === 'end').length;

    if (startCount === 0) problems.push('At least one Start node is required.');
    if (endCount === 0) problems.push('At least one End node is required.');

    if (nodes.length === 0)
      problems.push('Add some nodes to build a workflow.');

    const allNodeIds = new Set(nodes.map((n) => n.id));
    edges.forEach((e) => {
      if (!allNodeIds.has(e.source) || !allNodeIds.has(e.target)) {
        problems.push('Edge with invalid nodes detected.');
      }
    });

    return problems;
  };

  const handleTestWorkflow = async () => {
    const validationErrors = validateWorkflow();
    setErrors(validationErrors);
    setSimulationLog([]);

    if (validationErrors.length > 0) return;

    try {
      setTesting(true);
      const log = await simulateWorkflow(nodes, edges);
      setSimulationLog(log);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="app-root">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Nodes</h2>
        <p className="sidebar-subtitle">Click to add:</p>

        {(Object.keys(nodeTypeLabel) as NodeKind[]).map((kind) => (
          <button
            key={kind}
            className="sidebar-button"
            onClick={() => addNode(kind)}
          >
            + {nodeTypeLabel[kind]}
          </button>
        ))}

        <hr className="sidebar-divider" />

        <button
          className="sidebar-button danger"
          onClick={deleteSelectedNode}
          disabled={!selectedNodeId}
        >
          Delete selected
        </button>

        <div className="sidebar-hint">
          <strong>Hint:</strong>
          <br />
          Click nodes on the canvas to edit their configuration.
          <br />
          Drag from one node edge to another to connect them.
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <div className="canvas-header">
          <h1 className="app-title">
            CS Work Streamer <span className="love-icon">❤️</span>
          </h1>
          <div className="canvas-header-actions">
            <button
              className="test-button"
              onClick={handleTestWorkflow}
              disabled={testing}
            >
              {testing ? 'Testing...' : 'Test Workflow'}
            </button>
            <button
              className="theme-button"
              type="button"
              onClick={toggleTheme}
              title="Toggle light / dark theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        <div className="canvas-inner">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>

        {/* Errors + Simulation log */}
        <div className="sandbox-panel">
          <h3>Test & Debug</h3>
          {errors.length > 0 && (
            <div className="error-box">
              <strong>Validation issues:</strong>
              <ul>
                {errors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {simulationLog.length > 0 && (
            <div className="log-box">
              <strong>Simulation log:</strong>
              <ul>
                {simulationLog.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {errors.length === 0 && simulationLog.length === 0 && (
            <p className="sandbox-hint">
              Click <strong>Test Workflow</strong> to simulate the current
              workflow.
            </p>
          )}
        </div>
      </div>

      {/* Config panel */}
      <div className="config-panel">
        <h2>Node configuration</h2>
        {!selectedNode && <p>Select a node on the canvas to edit its details.</p>}
        {selectedNode && (
          <NodeConfigForm
            node={selectedNode}
            actions={actions}
            onChange={(data) => updateNodeData(selectedNode.id, data)}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------
// Right panel forms
// ---------------------------

interface NodeConfigFormProps {
  node: Node<WorkflowNodeData>;
  actions: AutomationAction[];
  onChange: (data: Partial<WorkflowNodeData>) => void;
}

const NodeConfigForm: React.FC<NodeConfigFormProps> = ({
  node,
  actions,
  onChange,
}) => {
  const { data } = node;

  const handleLabelChange = (value: string) => {
    onChange({ label: value });
  };

  if (data.type === 'start') {
    return (
      <div className="form">
        <label className="field">
          <span>Label</span>
          <input
            value={data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </label>

        <h4>Metadata</h4>
        {data.metadata.map((m, idx) => (
          <div className="kv-row" key={idx}>
            <input
              placeholder="key"
              value={m.key}
              onChange={(e) => {
                const metadata = [...data.metadata];
                metadata[idx] = { ...metadata[idx], key: e.target.value };
                onChange({ metadata } as any);
              }}
            />
            <input
              placeholder="value"
              value={m.value}
              onChange={(e) => {
                const metadata = [...data.metadata];
                metadata[idx] = { ...metadata[idx], value: e.target.value };
                onChange({ metadata } as any);
              }}
            />
          </div>
        ))}
        <button
          className="small-button"
          onClick={() =>
            onChange(
              { metadata: [...data.metadata, { key: '', value: '' }] } as any,
            )
          }
        >
          + Add metadata row
        </button>
      </div>
    );
  }

  if (data.type === 'task') {
    return (
      <div className="form">
        <label className="field">
          <span>Title</span>
          <input
            value={data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            value={data.description}
            onChange={(e) =>
              onChange({ description: e.target.value } as any)
            }
          />
        </label>

        <label className="field">
          <span>Assignee</span>
          <input
            value={data.assignee}
            onChange={(e) => onChange({ assignee: e.target.value } as any)}
          />
        </label>

        <label className="field">
          <span>Due date</span>
          <input
            type="date"
            value={data.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value } as any)}
          />
        </label>

        <h4>Custom fields</h4>
        {data.customFields.map((f, idx) => (
          <div className="kv-row" key={idx}>
            <input
              placeholder="key"
              value={f.key}
              onChange={(e) => {
                const customFields = [...data.customFields];
                customFields[idx] = { ...customFields[idx], key: e.target.value };
                onChange({ customFields } as any);
              }}
            />
            <input
              placeholder="value"
              value={f.value}
              onChange={(e) => {
                const customFields = [...data.customFields];
                customFields[idx] = { ...customFields[idx], value: e.target.value };
                onChange({ customFields } as any);
              }}
            />
          </div>
        ))}
        <button
          className="small-button"
          onClick={() =>
            onChange({
              customFields: [...data.customFields, { key: '', value: '' }],
            } as any)
          }
        >
          + Add custom field
        </button>
      </div>
    );
  }

  if (data.type === 'approval') {
    return (
      <div className="form">
        <label className="field">
          <span>Title</span>
          <input
            value={data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Approver role</span>
          <select
            value={data.approverRole}
            onChange={(e) =>
              onChange({ approverRole: e.target.value } as any)
            }
          >
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
          </select>
        </label>

        <label className="field">
          <span>Auto-approve threshold (amount / days etc.)</span>
          <input
            type="number"
            value={data.autoApproveThreshold}
            onChange={(e) =>
              onChange({ autoApproveThreshold: Number(e.target.value) } as any)
            }
          />
        </label>
      </div>
    );
  }

  if (data.type === 'automation') {
    const selectedAction = actions.find((a) => a.id === data.actionId);

    return (
      <div className="form">
        <label className="field">
          <span>Title</span>
          <input
            value={data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Action</span>
          <select
            value={data.actionId}
            onChange={(e) =>
              onChange({ actionId: e.target.value, params: {} } as any)
            }
          >
            <option value="">Select an action</option>
            {actions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        {selectedAction && (
          <>
            <h4>Parameters</h4>
            {selectedAction.params.map((paramName) => (
              <label className="field" key={paramName}>
                <span>{paramName}</span>
                <input
                  value={data.params[paramName] ?? ''}
                  onChange={(e) =>
                    onChange({
                      params: {
                        ...data.params,
                        [paramName]: e.target.value,
                      },
                    } as any)
                  }
                />
              </label>
            ))}
          </>
        )}
      </div>
    );
  }

  if (data.type === 'end') {
    return (
      <div className="form">
        <label className="field">
          <span>Title</span>
          <input
            value={data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Completion message</span>
          <textarea
            value={data.message}
            onChange={(e) => onChange({ message: e.target.value } as any)}
          />
        </label>

        <label className="field checkbox-field">
          <input
            type="checkbox"
            checked={data.showSummary}
            onChange={(e) =>
              onChange({ showSummary: e.target.checked } as any)
            }
          />
          <span>Show summary to user</span>
        </label>
      </div>
    );
  }

  return null;
};

// ---------------------------

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowAppInner />
    </ReactFlowProvider>
  );
};

export default App;
