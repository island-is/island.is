import { TrWebApiServicesDomainProfessionsModelsActivityOfProfessionDto } from '../..'
import { GenericKeyValueDto } from './genericKeyValue.dto'

export type ProfessionActivityDto = GenericKeyValueDto

export const mapProfessionActivityDto = ({
  description,
  value,
}: TrWebApiServicesDomainProfessionsModelsActivityOfProfessionDto): ProfessionActivityDto | null => {
  if (!description || !value) {
    return null
  }

  return {
    label: description,
    value: value,
    needsFurtherInformation: value === 'ANNAD',
  }
}
