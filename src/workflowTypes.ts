// src/workflowTypes.ts

export type NodeKind = 'start' | 'task' | 'approval' | 'automation' | 'end';

export interface BaseWorkflowNodeData {
  label: string;
  type: NodeKind;
}

export interface StartNodeData extends BaseWorkflowNodeData {
  type: 'start';
  metadata: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseWorkflowNodeData {
  type: 'task';
  description: string;
  assignee: string;
  dueDate: string;
  customFields: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseWorkflowNodeData {
  type: 'approval';
  approverRole: string;
  autoApproveThreshold: number;
}

export interface AutomationNodeData extends BaseWorkflowNodeData {
  type: 'automation';
  actionId: string;
  params: Record<string, string>;
}

export interface EndNodeData extends BaseWorkflowNodeData {
  type: 'end';
  message: string;
  showSummary: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomationNodeData
  | EndNodeData;

export interface AutomationAction {
  id: string;
  name: string;
  params: string[];
}
