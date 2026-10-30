import { TrWebApiServicesDomainEmployersModelsEmploymentStatusDto } from '../..'
import { GenericKeyValueDto } from './genericKeyValue.dto'

export type EmploymentDto = GenericKeyValueDto

export const mapEmploymentDto = ({
  displayName,
  value,
}: TrWebApiServicesDomainEmployersModelsEmploymentStatusDto): EmploymentDto | null => {
  if (!displayName || !value) {
    return null
  }

  return {
    label: displayName,
    value: value,
    needsFurtherInformation: value === 'ANNAD',
  }
}
