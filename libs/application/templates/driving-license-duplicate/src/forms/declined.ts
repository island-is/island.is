import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { HasQualityPhotoData } from '../fields/QualityPhoto/hooks/useQualityPhoto'
import { HasQualitySignatureData } from '../fields/QualitySignature/hooks/useQualitySignature'
import { m } from '../lib/messages'
import { allowFakeCondition, requirementsMet } from '../lib/utils'
import { NO, YES } from '../lib/constants'

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
        buildCustomField({
          id: 'categories',
          title: '',
          component: 'CurrentLicense',
        }),
        buildDescriptionField({
          id: 'rejected.signatureTitle',
          title: m.requirementsTitle,
          titleVariant: 'h3',
          description: '',
          space: 'gutter',
        }),
        buildDescriptionField({
          id: 'rejected.space',
          title: '',
          description: '',
          space: 'gutter',
        }),
        buildCustomField(
          {
            id: 'qphotoRejetedAlert',
            title: '',
            component: 'Alert',
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
          },
          {
            title: m.rejectedImageTitle,
            type: 'warning',
            message: m.rejectedImageMessage,
          },
        ),
        buildCustomField(
          {
            id: 'qSignatureRejetedAlert',
            title: '',
            component: 'Alert',
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
          },
          {
            title: m.rejectedSignatureTitle,
            type: 'warning',
            message: m.rejectedSignatureMessage,
          },
        ),
      ],
    }),
  ],
})
