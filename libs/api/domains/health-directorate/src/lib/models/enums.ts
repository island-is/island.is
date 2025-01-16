import { registerEnumType } from '@nestjs/graphql'

export enum VaccinationStatusEnum {
  valid = 'valid', // mint
  expired = 'expired', // blue
  complete = 'complete', //  mint
  incomplete = 'incomplete', // blue
  undocumented = 'undocumented', // purple
  unvaccinated = 'unvaccinated', // red
  rejected = 'rejected', // purple
  undetermined = 'undetermined', // purple
}
registerEnumType(VaccinationStatusEnum, {
  name: 'HealthDirectorateVaccinationStatusEnum',
})
