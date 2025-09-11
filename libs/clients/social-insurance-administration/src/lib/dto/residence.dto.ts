import { TrWebApiServicesUseCaseDisabilityPensionModelsHousingTypesStatusDto } from '../..'
import { GenericKeyValueDto } from './genericKeyValue.dto'

export interface ResidenceDto
  extends Pick<GenericKeyValueDto, 'label' | 'needsFurtherInformation'> {
  value: number
}

export const mapResidenceDto = ({
  label,
  value,
}: TrWebApiServicesUseCaseDisabilityPensionModelsHousingTypesStatusDto): ResidenceDto | null => {
  if (!label || !value) {
    return null
  }

  return {
    label,
    value,
    needsFurtherInformation: value === 6,
  }
}
