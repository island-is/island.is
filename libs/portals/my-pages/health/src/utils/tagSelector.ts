import {
  HealthDirectoratePermitStatus,
  HealthDirectorateVaccinationStatusEnum,
} from '@island.is/api/schema'
import { isDefined } from 'class-validator'
import type { TagVariant } from '@island.is/island-ui/core'
import { messages } from '../lib/messages'
import { FormatMessage } from '@island.is/localization'

// Tag selector for expandable, sorting table in vaccinations
export const tagSelector = (
  status?: HealthDirectorateVaccinationStatusEnum,
): TagVariant => {
  if (!isDefined(status)) return 'blue'

  switch (status) {
    case HealthDirectorateVaccinationStatusEnum.complete:
      return 'mint'
    case HealthDirectorateVaccinationStatusEnum.valid:
      return 'mint'
    case HealthDirectorateVaccinationStatusEnum.unvaccinated:
      return 'red'
    case HealthDirectorateVaccinationStatusEnum.expired:
      return 'blue'
    case HealthDirectorateVaccinationStatusEnum.incomplete:
      return 'blue'
    case HealthDirectorateVaccinationStatusEnum.rejected:
      return 'blue'
    case HealthDirectorateVaccinationStatusEnum.undetermined:
      return 'purple'
    case HealthDirectorateVaccinationStatusEnum.undocumented:
      return 'purple'

    default:
      return 'blue'
  }
}

export const permitTagSelector = (
  status: HealthDirectoratePermitStatus,
  formatMessage: FormatMessage,
): {
  label: string
  variant?: TagVariant | undefined
  outlined?: boolean
  renderTag?: (tagEl: React.ReactNode) => React.ReactNode
} => {
  switch (status) {
    case HealthDirectoratePermitStatus.active:
      return {
        label: formatMessage(messages.active),
        variant: 'blue',
        outlined: true,
      }
    case HealthDirectoratePermitStatus.expired:
      return {
        label: formatMessage(messages.expired),
        variant: 'red',
        outlined: true,
      }
    case HealthDirectoratePermitStatus.inactive:
      return {
        label: formatMessage(messages.withdrawn),
        variant: 'purple',
        outlined: true,
      }
    case HealthDirectoratePermitStatus.awaitingApproval:
      return {
        label: formatMessage(messages.awaitingApproval),
        variant: 'darkerBlue',
        outlined: true,
      }
    default:
      return {
        label: formatMessage(messages.unknown),
        variant: 'purple',
        outlined: true,
      }
  }
}
