import { buildForm, getValueViaPath, YES } from '@island.is/application/core'
import {
  ExternalData,
  Form,
  FormModes,
  FormValue,
} from '@island.is/application/types'
import { Jurisdiction } from '@island.is/clients/driving-license'
import { m } from '../lib/messages'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { B_FULL, B_FULL_RENEWAL_65, B_TEMP, BE, Pickup } from '../lib/constants'
import {
  isRedesignedBTempOrBFull,
  needsHealthCertificateCondition,
} from '../lib/utils'

const isRedesignedBFull = (answers: FormValue) =>
  answers.applicationFor === B_FULL && isRedesignedBTempOrBFull(answers)

const needsHealthCertificate = (
  answers: FormValue,
  externalData: ExternalData,
) => needsHealthCertificateCondition(YES)(answers, externalData)

const getDeliveryLocation = (
  answers: FormValue,
  externalData: ExternalData,
): string | undefined => {
  if (
    getValueViaPath(answers, 'delivery.deliveryMethod') !== Pickup.DISTRICT
  ) {
    return undefined
  }
  const jurisdictionId = getValueViaPath<string | number>(
    answers,
    'delivery.jurisdiction',
  )
  const jurisdictions =
    getValueViaPath<Jurisdiction[]>(externalData, 'jurisdictions.data') ?? []
  return jurisdictions.find(({ id }) => `${id}` === `${jurisdictionId}`)?.name
}

const redesignedBFullDescription = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const health = needsHealthCertificate(answers, externalData)
  const deliveryLocation = getDeliveryLocation(answers, externalData)
  if (deliveryLocation) {
    return {
      ...(health
        ? m.nextStepsDescriptionBFullHealthPickup
        : m.nextStepsDescriptionBFullNoHealthPickup),
      values: { deliveryLocation },
    }
  }
  return health
    ? m.nextStepsDescriptionBFullHealthPost
    : m.nextStepsDescriptionBFullNoHealthPost
}

export const done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      multiFieldTitle: m.applicationDone,
      alertTitle: m.applicationDone,
      alertMessage: ({ answers, externalData }) =>
        isRedesignedBFull(answers) &&
        needsHealthCertificate(answers, externalData)
          ? m.applicationDoneAlertMessageBFullHealthRedesigned
          : answers.applicationFor === B_TEMP
          ? m.applicationDoneAlertMessage
          : answers.applicationFor === BE
          ? m.applicationDoneAlertMessageBE
          : answers.applicationFor === B_FULL_RENEWAL_65
          ? getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true
            ? m.applicationDoneAlertMessage65RenewalRedesigned
            : m.applicationDoneAlertMessage65Renewal
          : m.applicationDoneAlertMessageBFull,
      expandableHeader: m.nextStepsTitle,
      expandableIntro: ({ answers }) =>
        isRedesignedBFull(answers)
          ? ''
          : answers.applicationFor === BE
          ? m.nextStepsIntroBE
          : answers.applicationFor === B_FULL_RENEWAL_65 &&
            getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true
          ? m.nextStepsIntro65RenewalRedesigned
          : m.nextStepsIntroDefault,
      expandableDescription: ({ answers, externalData }) =>
        isRedesignedBFull(answers)
          ? redesignedBFullDescription(answers, externalData)
          : answers.applicationFor === B_TEMP
          ? m.nextStepsDescription
          : answers.applicationFor === BE
          ? m.nextStepsDescriptionBE
          : answers.applicationFor === B_FULL_RENEWAL_65
          ? getValueViaPath(answers, 'is65RenewalRedesignEnabled') === true
            ? m.nextStepsDescription65RenewalRedesigned
            : m.nextStepsDescription65Renewal
          : needsHealthCertificateCondition(YES)(answers, externalData)
          ? m.nextStepsDescriptionBFull
          : m.nextStepsInfoLink,
    }),
  ],
})
