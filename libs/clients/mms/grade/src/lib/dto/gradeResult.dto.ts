import { GradeResultViewModel } from '../../../gen/fetch'

export interface GradeResultDto {
  title: string
  grade: string
  /** The weight value for calculating the importance of a grade (isl: Vægi) */
  weight: number
}

export const mapGradeResultDto = (
  data: GradeResultViewModel,
): GradeResultDto => {
  return {
    title: data.heiti,
    grade: data.einkunn,
    weight: data.vaegi,
  }
}
