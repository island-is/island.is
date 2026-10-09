import type {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'

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

export type WorkspacePreviewApplicationPatch = {
  answers?: FormValue
  externalData?: ExternalData
}

export const createWorkspacePreviewApplication = (
  templateTypeId: string | undefined,
  patch?: WorkspacePreviewApplicationPatch | null,
): Application => ({
  ...PREVIEW_APPLICATION_BASE,
  typeId: (templateTypeId ?? '') as Application['typeId'],
  answers: patch?.answers ?? {},
  externalData: patch?.externalData ?? {},
})
