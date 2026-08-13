export interface ProjectDeliverable {
  output: string;
  status: string;
  tone: 'green' | 'amber';
}

export interface ClientAction {
  text: string;
  complete: boolean;
}

export const PROJECT_DELIVERABLES: ProjectDeliverable[] = [
  { output: 'InsightX Final Report PDF', status: 'Pending QA', tone: 'amber' },
  { output: 'Capital Planning Excel', status: 'Ready', tone: 'green' },
  { output: 'Photo Appendix', status: 'Ready · Preview', tone: 'green' },
];

export const EXECUTION_STATUS = 'Available after QA';

export const CLIENT_ACTIONS: ClientAction[] = [
  { text: 'Upload roof warranty documents.', complete: false },
  { text: 'Confirm building access contact for follow-up inspection.', complete: false },
  { text: 'Capital planning Excel template received.', complete: true },
];
