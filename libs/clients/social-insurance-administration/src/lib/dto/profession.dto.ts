import { TrWebApiServicesDomainProfessionsModelsProfessionDto } from '../..'
import { GenericKeyValueDto } from './genericKeyValue.dto'

export type ProfessionDto = GenericKeyValueDto

export const mapProfessionDto = ({
  description,
  value,
}: TrWebApiServicesDomainProfessionsModelsProfessionDto): ProfessionDto | null => {
  if (!description || !value) {
    return null
  }

  return {
    label: description,
    value: value,
    needsFurtherInformation: value === 'ANNAD',
  }
}
