import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
  getValueViaPath,
  buildAlertMessageField,
  buildKeyValueField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { requirementsMet } from '../lib/utils'
import { format as formatNationalId } from 'kennitala'
import { DistrictCommissionersServiceProviderLogo } from '@island.is/application/assets/institution-logos'

export const declined: Form = buildForm({
  id: 'declined',
  mode: FormModes.REJECTED,
  renderLastScreenButton: true,
  logo: DistrictCommissionersServiceProviderLogo,
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
          value: ({ externalData }) =>
            getValueViaPath(externalData, 'nationalRegistry.data.fullName') ??
            '',
        }),
        buildKeyValueField({
          label: m.applicantsNationalId,
          width: 'half',
          marginBottom: 'gutter',
          value: (application: Application) =>
            formatNationalId(application.applicant),
        }),
        buildCustomField({
          id: 'currentLicense',
          component: 'CurrentLicense',
        }),
        buildDescriptionField({
          id: 'rejectedAlertTitle',
          title: m.requirementsTitle,
          titleVariant: 'h4',
          marginTop: 'gutter',
        }),
        buildAlertMessageField({
          id: 'rejectedAlertForPhoto',
          title: m.rejectedImageTitleNew,
          message: m.rejectedImageMessageNew,
          alertType: 'warning',
          marginBottom: 'gutter',
        }),
        buildDescriptionField({
          id: 'rejected.extraSpace',
          space: 'gutter',
        }),
      ],
    }),
  ],
})
