import { MinistryResponseDto } from '../../../gen/fetch'

export interface MinistryDto {
  code: string
  name: string
}

export const mapMinistryDto = (
  ministry: MinistryResponseDto,
): MinistryDto | null => {
  if (!ministry.code || !ministry.name) {
    return null
  }

  return {
    code: ministry.code,
    name: ministry.name,
  }
}
