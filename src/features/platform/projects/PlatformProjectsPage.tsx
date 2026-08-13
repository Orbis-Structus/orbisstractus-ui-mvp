import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ApiError } from '../../../api/client';
import type { CreateAssessmentRequest } from '../../../api/contracts/operations';
import type { DeliveryMethod, ProjectStatus, ServiceLine } from '../../../domain/projects';
import DataTable from '../../../shared/components/DataTable';
import DetailDrawer from '../../../shared/components/DetailDrawer';
import StatusChip from '../../../shared/components/StatusChip';
import { useToast } from '../../../shared/store/toastStore';
import { useCreateAssessment, useDeleteProject, useProjects } from '../../client-portal/api';
import { pageTitleSx, subsectionTitleSx } from '../../insightx/shared/pageStyles';
import { useCompanies } from '../api';

const SERVICE_LINES: ServiceLine[] = ['BCA', 'EnvelopeX', 'ReserveX', 'EnergyX'];
const STATUS_OPTIONS: ProjectStatus[] = ['planned', 'active', 'complete'];
const HORIZON_OPTIONS = [5, 10, 15, 20];
const DELIVERY_METHODS: DeliveryMethod[] = ['Portal', 'Email', 'Both'];
const STATUS_TONE: Record<ProjectStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  planned: 'warning',
  complete: 'neutral',
};

interface NewProjectForm {
  companyId: string;
  clientOrganization: string;
  propertyAddress: string;
  projectOwner: string;
  pEngReviewerName: string;
  inspectorName: string;
  siteVisitDate: string;
  assessmentHorizonYears: number;
  deliveryMethod: DeliveryMethod;
}

function emptyNewProject(companyId = ''): NewProjectForm {
  return {
    companyId,
    clientOrganization: '',
    propertyAddress: '',
    projectOwner: '',
    pEngReviewerName: '',
    inspectorName: '',
    siteVisitDate: '',
    assessmentHorizonYears: 10,
    deliveryMethod: 'Portal',
  };
}

export default function PlatformProjectsPage() {
  const toast = useToast();
  const { data: companies } = useCompanies();
  const { data: projects, isLoading } = useProjects();
  const createAssessment = useCreateAssessment();
  const deleteProject = useDeleteProject();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<NewProjectForm>(() => emptyNewProject());
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [serviceFilter, setServiceFilter] = useState<ServiceLine | 'all'>('all');

  const companyName = new Map((companies ?? []).map((company) => [company.id, company.name]));
  const allRows = (projects ?? []).map((project) => ({
    ...project,
    companyLabel: companyName.get(project.companyId) ?? project.companyId,
  }));
  const rows = allRows.filter((project) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      project.buildingName.toLowerCase().includes(term) ||
      project.consultantLead.toLowerCase().includes(term);
    const matchesCompany = companyFilter === 'all' || project.companyId === companyFilter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesService = serviceFilter === 'all' || project.serviceLine === serviceFilter;
    return matchesSearch && matchesCompany && matchesStatus && matchesService;
  });
  const selected = allRows.find((project) => project.id === selectedId) ?? null;
  const canSubmit = Boolean(
    form.companyId &&
      form.clientOrganization &&
      form.propertyAddress &&
      form.projectOwner &&
      form.siteVisitDate,
  );

  function openCreateDialog() {
    setForm(emptyNewProject(companies?.[0]?.id ?? ''));
    setCreateOpen(true);
  }

  function submitNewProject() {
    if (!canSubmit) return;

    const payload: CreateAssessmentRequest = {
      companyId: form.companyId,
      projectOwner: form.projectOwner,
      clientOrganization: form.clientOrganization,
      clientContact: '',
      purpose: 'Lender requirement — refinancing',
      portfolioName: '',
      portfolioType: '',
      assetsInPortfolio: '',
      propertyAddress: form.propertyAddress,
      yearBuilt: new Date().getFullYear(),
      grossFloorAreaSqm: 0,
      storeys: 0,
      occupancyType: '',
      structureType: '',
      envelopeType: '',
      assessmentType: 'Full BCA (visual)',
      pEngReviewerName: form.pEngReviewerName,
      inspectorName: form.inspectorName,
      siteVisitDate: form.siteVisitDate,
      assessmentHorizonYears: form.assessmentHorizonYears,
      deliveryMethod: form.deliveryMethod,
      assessmentScope: ['Full BCA (visual)'],
      requiredDeliverables: ['Excel Capital Plan', 'Word Narrative Report', 'PDF Package'],
      applicableCodes: ['Ontario Building Code (OBC)', 'CSA Standards'],
    };

    createAssessment.mutate(payload, {
      onSuccess: (result) => {
        toast(
          `${result.project.buildingName} created for ${companyName.get(form.companyId) ?? 'the company'}.`,
        );
        setCreateOpen(false);
      },
      onError: (error) => toast(error instanceof ApiError ? error.message : 'Unable to create the project.'),
    });
  }

  function confirmDelete() {
    if (!selected) return;
    deleteProject.mutate(selected.id, {
      onSuccess: () => {
        toast(`${selected.buildingName} — ${selected.serviceLine} project deleted.`);
        setDeleteConfirmOpen(false);
        setSelectedId(null);
      },
      onError: (error) => toast(error instanceof ApiError ? error.message : 'Unable to delete the project.'),
    });
  }

  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 0.5, justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Typography component="h1" sx={pageTitleSx}>
          All Projects
        </Typography>
        <Button variant="contained" onClick={openCreateDialog}>
          + New Project
        </Button>
      </Stack>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Every assessment project across every company on Orbisstractus, with cross-company filtering and controls.
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
        <TextField
          size="small"
          placeholder="Search building or consultant…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ minWidth: 235 }}
        />
        <TextField
          select
          size="small"
          label="Company"
          value={companyFilter}
          onChange={(event) => setCompanyFilter(event.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All Companies</MenuItem>
          {(companies ?? []).map((company) => (
            <MenuItem key={company.id} value={company.id}>
              {company.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as ProjectStatus | 'all')}
          sx={{ minWidth: 135 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          label="Service"
          value={serviceFilter}
          onChange={(event) => setServiceFilter(event.target.value as ServiceLine | 'all')}
          sx={{ minWidth: 145 }}
        >
          <MenuItem value="all">All Services</MenuItem>
          {SERVICE_LINES.map((service) => (
            <MenuItem key={service} value={service}>
              {service}
            </MenuItem>
          ))}
        </TextField>
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          {rows.length} of {allRows.length} projects
        </Typography>
      </Stack>

      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <DataTable
            loading={isLoading}
            columns={[
              { field: 'buildingName', headerName: 'Building', flex: 1, minWidth: 175 },
              { field: 'companyLabel', headerName: 'Company', width: 185 },
              { field: 'serviceLine', headerName: 'Service', width: 120 },
              {
                field: 'status',
                headerName: 'Status',
                width: 115,
                renderCell: (params) => (
                  <StatusChip
                    label={String(params.value)}
                    tone={STATUS_TONE[params.value as ProjectStatus]}
                  />
                ),
              },
              { field: 'currentStage', headerName: 'Current Stage', width: 155 },
              { field: 'consultantLead', headerName: 'Consultant Lead', width: 170 },
              { field: 'targetDeliveryDate', headerName: 'Target Delivery', width: 145 },
            ]}
            rows={rows}
            height={520}
            onRowClick={(row) => setSelectedId(row.id)}
          />
        </CardContent>
      </Card>

      <DetailDrawer
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        title={selected?.buildingName ?? 'Project'}
        subtitle={selected ? `${selected.companyLabel} · ${selected.serviceLine}` : undefined}
      >
        {selected && (
          <Stack spacing={2.5}>
            <Box>
              <Typography sx={{ ...subsectionTitleSx, mb: 1 }}>Project</Typography>
              <Stack spacing={0.65}>
                <Typography variant="body2">Status: {selected.status}</Typography>
                <Typography variant="body2">Current Stage: {selected.currentStage}</Typography>
                <Typography variant="body2">Consultant Lead: {selected.consultantLead}</Typography>
                <Typography variant="body2">Site Visit: {selected.siteVisitDate}</Typography>
                <Typography variant="body2">Target Delivery: {selected.targetDeliveryDate}</Typography>
                <Typography variant="body2">P.Eng. Reviewer: {selected.pEngReviewerName}</Typography>
                <Typography variant="body2">Inspector: {selected.inspectorName}</Typography>
                <Typography variant="body2">Delivery Method: {selected.deliveryMethod}</Typography>
                <Typography variant="body2">Assessment Horizon: {selected.assessmentHorizonYears} years</Typography>
              </Stack>
            </Box>
            <Button color="error" variant="outlined" onClick={() => setDeleteConfirmOpen(true)}>
              Delete Project
            </Button>
          </Stack>
        )}
      </DetailDrawer>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete project?</DialogTitle>
        <DialogContent>
          <Typography>
            Delete {selected?.buildingName} — {selected?.serviceLine}? This removes the project and its related
            workflow data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleteProject.isPending}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Project</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <TextField
              select
              label="Company"
              value={form.companyId}
              onChange={(event) => setForm((current) => ({ ...current, companyId: event.target.value }))}
              required
            >
              {(companies ?? []).map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Client Organization"
              value={form.clientOrganization}
              onChange={(event) => setForm((current) => ({ ...current, clientOrganization: event.target.value }))}
              required
            />
            <TextField
              label="Property Address"
              value={form.propertyAddress}
              onChange={(event) => setForm((current) => ({ ...current, propertyAddress: event.target.value }))}
              required
            />
            <TextField
              label="Project Owner"
              value={form.projectOwner}
              onChange={(event) => setForm((current) => ({ ...current, projectOwner: event.target.value }))}
              required
            />
            <TextField
              label="P.Eng. Reviewer"
              value={form.pEngReviewerName}
              onChange={(event) => setForm((current) => ({ ...current, pEngReviewerName: event.target.value }))}
            />
            <TextField
              label="Inspector"
              value={form.inspectorName}
              onChange={(event) => setForm((current) => ({ ...current, inspectorName: event.target.value }))}
            />
            <TextField
              label="Site Visit Date"
              type="date"
              value={form.siteVisitDate}
              onChange={(event) => setForm((current) => ({ ...current, siteVisitDate: event.target.value }))}
              slotProps={{ inputLabel: { shrink: true } }}
              required
            />
            <TextField
              select
              label="Assessment Horizon"
              value={form.assessmentHorizonYears}
              onChange={(event) =>
                setForm((current) => ({ ...current, assessmentHorizonYears: Number(event.target.value) }))
              }
            >
              {HORIZON_OPTIONS.map((years) => (
                <MenuItem key={years} value={years}>
                  {years} years
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Delivery Method"
              value={form.deliveryMethod}
              onChange={(event) =>
                setForm((current) => ({ ...current, deliveryMethod: event.target.value as DeliveryMethod }))
              }
            >
              {DELIVERY_METHODS.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitNewProject} disabled={!canSubmit || createAssessment.isPending}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
