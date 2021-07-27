import { FormValue } from '@island.is/application/core'
import { AccidentTypeEnum, WorkAccidentTypeEnum } from '../types'
import { isWorkAccident } from './isWorkAccident'

// Specific case check here since the accident can be a sports accident if he picks sports in the first question where
// he is asked what the circumstances of the accident were. But that user could also select work and then a sport related
// accident since the question can be missunderstood by the user so we are funneling both cases into the same flow
export const isProfessionalAthleteAccident = (formValue: FormValue) => {
  const workAccidentType = (formValue as {
    accidentType: { radioButton: AccidentTypeEnum }
  })?.accidentType?.radioButton

  const workAccidentSecondaryType = (formValue as {
    workAccident: { type: WorkAccidentTypeEnum }
  })?.workAccident?.type

  return (
    workAccidentType === AccidentTypeEnum.SPORTS ||
    (workAccidentSecondaryType === WorkAccidentTypeEnum.PROFESSIONALATHLETE &&
      isWorkAccident(formValue))
  )
}
