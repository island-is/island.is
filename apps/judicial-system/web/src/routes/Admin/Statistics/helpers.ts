import { ServiceStatus } from '@island.is/judicial-system/types'

export const serviceStatusLabels: Record<ServiceStatus, string> = {
  [ServiceStatus.DEFENDER]: 'Birt verjanda',
  [ServiceStatus.ELECTRONICALLY]: 'Birt rafrænt',
  [ServiceStatus.IN_PERSON]: 'Birt persónulega',
  [ServiceStatus.EXPIRED]: 'Rann út á tíma',
  [ServiceStatus.FAILED]: 'Árangurslaus birting',
}

export const mapServiceStatusTitle = (status?: ServiceStatus | null): string =>
  status ? serviceStatusLabels[status] ?? 'Óbirt' : 'Óbirt'
