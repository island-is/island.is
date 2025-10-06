import { TrWebApiServicesUseCaseDisabilityPensionModelsMaritalStatusDto } from '../..'
import { GenericKeyValueDto } from './genericKeyValue.dto'

export interface MaritalStatusDto
  extends Pick<GenericKeyValueDto, 'label' | 'needsFurtherInformation'> {
  value: number
}

export const mapMaritalStatusDto = ({
  label,
  value,
}: TrWebApiServicesUseCaseDisabilityPensionModelsMaritalStatusDto): MaritalStatusDto | null => {
  if (!label || !value) {
    return null
  }

  return {
    label,
    value,
  }
}
