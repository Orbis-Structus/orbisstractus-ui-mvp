import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { EmployeeRole } from '../../../domain/auth';
import { EMPLOYEE_ROLE_OPTIONS } from '../../../domain/auth';
import type { AccessLevel, ProjectStepKey } from '../../../domain/projectAccess';
import { PROJECT_STEP_KEYS, PROJECT_STEP_LABEL } from '../../../domain/projectAccess';
import ProjectAccessMatrix from '../../../shared/components/ProjectAccessMatrix';
import { useToast } from '../../../shared/store/toastStore';
import { useProjects } from '../../client-portal/api';
import { pageTitleSx, subsectionTitleSx } from '../../insightx/shared/pageStyles';
import {
  useProjectAccessOverview,
  useUpdateProjectStepAccess,
  useUpdateProjectTeam,
} from '../../insightx/administration/subviews/projectAccess/api';
import { useCompanies } from '../api';

const ROLE_LABEL = new Map(EMPLOYEE_ROLE_OPTIONS.map((option) => [option.value, option.label]));

export default function PlatformProjectAccessPage() {
  const toast = useToast();
  const { data: companies } = useCompanies();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [companyFilter, setCompanyFilter] = useState('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  const companyName = new Map((companies ?? []).map((company) => [company.id, company.name]));
  const filteredProjects = (projects ?? []).filter(
    (project) => companyFilter === 'all' || project.companyId === companyFilter,
  );
  const activeProjectId = selectedProjectId ?? filteredProjects[0]?.id;

  const { data: rows, isLoading: accessLoading } = useProjectAccessOverview(activeProjectId);
  const updateTeam = useUpdateProjectTeam(activeProjectId);
  const updateAccess = useUpdateProjectStepAccess(activeProjectId);

  function toggleTeam(employeeId: string, employeeName: string, onTeam: boolean) {
    updateTeam.mutate(
      { employeeId, onTeam: !onTeam },
      {
        onSuccess: () => toast(`${employeeName} ${!onTeam ? 'added to' : 'removed from'} the project team.`),
      },
    );
  }

  function setAccess(employeeId: string, step: ProjectStepKey, level: AccessLevel | null) {
    const employeeName = rows?.find((row) => row.employeeId === employeeId)?.employeeName ?? employeeId;
    updateAccess.mutate(
      { employeeId, step, accessLevel: level },
      {
        onSuccess: () =>
          toast(`${employeeName} → ${PROJECT_STEP_LABEL[step]}: ${level ?? 'reverted to default'}.`),
      },
    );
  }

  return (
    <Box>
      <Typography component="h1" sx={{ ...pageTitleSx, mb: 0.5 }}>
        Project Access
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 900 }}>
        Manage per-project, per-step access for any employee at any company on Orbisstractus. Administration and
        Orbisstractus Platform Admin accounts always have full edit access and aren&apos;t shown here.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }}>
        <TextField
          select
          size="small"
          label="Company"
          value={companyFilter}
          onChange={(event) => {
            setCompanyFilter(event.target.value);
            setSelectedProjectId(undefined);
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All companies</MenuItem>
          {(companies ?? []).map((company) => (
            <MenuItem key={company.id} value={company.id}>
              {company.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Project"
          value={activeProjectId ?? ''}
          onChange={(event) => setSelectedProjectId(event.target.value)}
          disabled={projectsLoading || filteredProjects.length === 0}
          sx={{ minWidth: 320 }}
        >
          {filteredProjects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.buildingName} — {project.serviceLine} ({companyName.get(project.companyId) ?? 'Company'})
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {accessLoading || projectsLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading…
        </Typography>
      ) : !activeProjectId ? (
        <Typography variant="body2" color="text.secondary">
          No project is available for this company.
        </Typography>
      ) : (
        <Stack spacing={2.5}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ ...subsectionTitleSx, mb: 1.5 }}>Project Team</Typography>
              {(rows ?? []).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No configurable employees at this company.
                </Typography>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 1 }}>
                  {(rows ?? []).map((row) => (
                    <FormControlLabel
                      key={row.employeeId}
                      control={
                        <Checkbox
                          checked={row.onTeam}
                          onChange={() => toggleTeam(row.employeeId, row.employeeName, row.onTeam)}
                        />
                      }
                      label={`${row.employeeName} — ${ROLE_LABEL.get(row.employeeRole as EmployeeRole) ?? row.employeeRole}`}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ ...subsectionTitleSx, mb: 1.5 }}>Step Access Matrix</Typography>
              <ProjectAccessMatrix
                rows={rows ?? []}
                steps={PROJECT_STEP_KEYS}
                stepLabel={(step) => PROJECT_STEP_LABEL[step]}
                onSetAccess={setAccess}
              />
            </CardContent>
          </Card>
        </Stack>
      )}
    </Box>
  );
}
