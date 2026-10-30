import { getServiceStatusText } from '@island.is/judicial-system/formatters'
import type { ServiceStatus } from '@island.is/judicial-system-web/src/graphql/schema'

export const mapServiceStatusTitle = (status?: ServiceStatus | null): string =>
  status ? getServiceStatusText(status) : 'Óbirt'
