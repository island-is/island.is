import { Einstaklingur18IDagItemDTO } from '../../gen/fetch'

export type BirthdayIndividual = {
  name: string | null
  ssn: string | null
}
export const mapBirthdayIndividual = (
  individual: Einstaklingur18IDagItemDTO,
): BirthdayIndividual => {
  return {
    name: individual.nafn,
    ssn: individual.kennitala,
  }
}
