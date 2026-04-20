import { getValueViaPath } from '@island.is/application/core'
import { conclusion } from '../../../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import {
  ApplicationPeriod,
  checkIsFreshman,
  getDateWordStr,
} from '../../../utils'

export const conclusionSection = buildFormConclusionSection({
  alertTitle: conclusion.general.alertTitle,
  alertMessage: (application, locale) => {
    const isFreshman = checkIsFreshman(application.answers)
    const applicationPeriodInfo = getValueViaPath<ApplicationPeriod>(
      application.externalData,
      'applicationPeriodInfo.data',
    )

    const message = isFreshman
      ? conclusion.general.alertMessageWithValuesFreshman
      : conclusion.general.alertMessageWithValuesGeneral

    const registrationEndDate = isFreshman
      ? applicationPeriodInfo?.registrationEndDateFreshman
      : applicationPeriodInfo?.registrationEndDateGeneral

    return {
      ...message,
      values: {
        registrationEndDateStr: getDateWordStr(registrationEndDate, locale),
      },
    }
  },
  expandableHeader: conclusion.general.accordionTitle,
  expandableIntro: '',
  expandableDescription: (application, locale) => {
    const isFreshman = checkIsFreshman(application.answers)
    const applicationPeriodInfo = getValueViaPath<ApplicationPeriod>(
      application.externalData,
      'applicationPeriodInfo.data',
    )

    const message = isFreshman
      ? conclusion.general.accordionTextWithValuesFreshman
      : conclusion.general.accordionTextWithValuesGeneral

    const registrationEndDate = isFreshman
      ? applicationPeriodInfo?.registrationEndDateFreshman
      : applicationPeriodInfo?.registrationEndDateGeneral
    const reviewStartDate = isFreshman
      ? applicationPeriodInfo?.reviewStartDateFreshman
      : applicationPeriodInfo?.reviewStartDateGeneral

    return {
      ...message,
      values: {
        registrationEndDateStr: getDateWordStr(registrationEndDate, locale),
        reviewStartDateStr: getDateWordStr(reviewStartDate, locale),
      },
    }
  },
})
