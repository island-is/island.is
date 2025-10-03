import { TrWebApiServicesDomainEmployersModelsEmploymentStatusDto } from '../..'
import { GenericKeyValueDto } from './genericKeyValue.dto'

export interface EmploymentDto extends GenericKeyValueDto {}

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
