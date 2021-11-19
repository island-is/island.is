import { AccidentNotificationAnswers, utils, WorkAccidentTypeEnum } from '..'

export const shouldRequestReview = (
  answers: Partial<AccidentNotificationAnswers>,
): boolean => {
  const ishome = utils.isHomeActivitiesAccident(answers)
  const isagrigculture = utils.isOfWorkAccidentType(
    answers,
    WorkAccidentTypeEnum.AGRICULTURE,
  )

  const isEitherHomeOrAgriculture = ishome || isagrigculture

  return !isEitherHomeOrAgriculture
}
