import type { Application } from '@island.is/application/types'

const PREVIEW_APPLICATION_BASE: Application = {
  id: 'preview',
  typeId: '' as Application['typeId'],
  state: 'draft',
  status: 'draft' as Application['status'],
  applicant: '',
  assignees: [],
  applicantActors: [],
  answers: {},
  externalData: {},
  created: new Date(),
  modified: new Date(),
}

export const createWorkspacePreviewApplication = (
  templateTypeId: string | undefined,
): Application => ({
  ...PREVIEW_APPLICATION_BASE,
  typeId: (templateTypeId ?? '') as Application['typeId'],
})
