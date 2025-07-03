import { getServiceStatusText } from '@island.is/judicial-system/formatters'
import { ServiceStatus } from '@island.is/judicial-system/types'

export const mapServiceStatusTitle = (status?: ServiceStatus | null): string =>
  status ? getServiceStatusText(status) : 'Óbirt'
