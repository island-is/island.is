import { AccidentNotificationAnswers, utils, WorkAccidentTypeEnum } from '..'

export const shouldRequestReview = (
  answers: Partial<AccidentNotificationAnswers>,
): boolean => {
  const ishome = utils.isHomeActivitiesAccident(answers)
  const isAgriculture = utils.isOfWorkAccidentType(
    answers,
    WorkAccidentTypeEnum.AGRICULTURE,
  )

  const isEitherHomeOrAgriculture = ishome || isAgriculture

  return !isEitherHomeOrAgriculture
}
