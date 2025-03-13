import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  getValueViaPath,
  buildAlertMessageField,
  buildKeyValueField,
  YES,
  NO,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { HasQualityPhotoData } from '../fields/QualityPhoto/hooks/useQualityPhoto'
import { HasQualitySignatureData } from '../fields/QualitySignature/hooks/useQualitySignature'
import { m } from '../lib/messages'
import { allowFakeCondition, requirementsMet } from '../lib/utils'
import { NationalRegistryUser } from '@island.is/api/schema'
import { format as formatNationalId } from 'kennitala'

export const declined: Form = buildForm({
  id: 'declined',
  title: m.rejected,
  mode: FormModes.REJECTED,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'listRejected',
      title: m.rejectedTitle,
      description: m.rejectedSubtitle,
      condition: (application, externalData) =>
        !requirementsMet(application, externalData),
      children: [
        buildKeyValueField({
          label: m.applicantsName,
          width: 'half',
          value: ({ externalData: { nationalRegistry } }) =>
            (nationalRegistry.data as NationalRegistryUser).fullName,
        }),
        buildKeyValueField({
          label: m.applicantsNationalId,
          width: 'half',
          value: (application: Application) =>
            formatNationalId(application.applicant),
        }),
        buildCustomField({
          id: 'currentLicense',
          component: 'CurrentLicense',
        }),
        buildDescriptionField({
          id: 'rejected.signatureTitle',
          title: m.requirementsTitle,
          titleVariant: 'h4',
        }),
        buildAlertMessageField({
          id: 'rejectedAlertForPhoto',
          title: m.rejectedImageTitle,
          message: m.rejectedImageMessage,
          alertType: 'warning',
          condition: (answers, externalData) => {
            if (allowFakeCondition(YES)(answers)) {
              const hasQualityPhoto = getValueViaPath<string>(
                answers,
                'fakeData.qualityPhoto',
              )
              return hasQualityPhoto === NO
            }
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === false
            )
          },
        }),
        buildAlertMessageField({
          id: 'rejectedAlertForSignature',
          title: m.rejectedSignatureTitle,
          message: m.rejectedSignatureMessage,
          alertType: 'warning',
          condition: (answers, externalData) => {
            if (allowFakeCondition(YES)(answers)) {
              const hasQualitySig = getValueViaPath<string>(
                answers,
                'fakeData.qualitySignature',
              )
              return hasQualitySig === NO
            }
            return (
              (externalData.qualitySignature as HasQualitySignatureData)?.data
                ?.hasQualitySignature === false
            )
          },
        }),
        buildDescriptionField({
          id: 'rejected.space',
          space: 'containerGutter',
        }),
        buildDescriptionField({
          id: 'rejected.space1',
          space: 'containerGutter',
        }),
      ],
    }),
  ],
})
