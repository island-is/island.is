import { coreMessages, FormBuilder, YES } from '@island.is/application/core'
import {
  DefaultEvents,
  FormModes,
  IdentityApi,
  UserProfileApi,
} from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'

import { propertiesApi } from '../../dataProviders'
import { dataSchema } from '../../lib/dataSchema'
import * as m from '../../lib/messages'

export const PrerequisitesProcureForm = new FormBuilder<typeof dataSchema>(
  'PrerequisitesProcureForm',
  '',
  {
    mode: FormModes.NOT_STARTED,
    logo: HmsLogo,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
  },
)
  .addSection(
    'confirmReadSectionSection',
    '',
    (section) => {
      section.addPage('confirmRead', m.confirmReadMessages.title, (page) => {
        page
          .setDescription(m.confirmReadMessages.description)
          .addCheckboxField('confirmReadPrivacyPolicy', '', {
            options: [
              {
                label: m.confirmReadMessages.confirmReadPrivacyPolicy,
                value: YES,
              },
            ],
          })
          .addCheckboxField('confirmReadFireCompensationInfo', '', {
            options: [
              {
                label: m.confirmReadMessages.confirmReadFireCompensationInfo,
                value: YES,
              },
            ],
          })
      })
    },
    { tabTitle: m.confirmReadMessages.title },
  )
  .addSection(
    'conditions',
    '',
    (section) => {
      section.addExternalDataProvider(
        'approveExternalData',
        m.prereqMessages.prereqTitle,
        {
          subTitle: m.prereqMessages.subTitle,
          checkboxLabel: m.prereqMessages.checkboxLabel,
          dataProviders: [
            {
              provider: UserProfileApi,
              title: m.prereqMessages.userProfileTitle,
              subTitle: m.prereqMessages.userProfileSubtitle,
            },
            {
              provider: IdentityApi,
              title: m.prereqMessages.nationalRegistryTitle,
              subTitle: m.prereqMessages.nationalRegistrySubtitle,
            },
            {
              provider: propertiesApi,
              title: m.prereqMessages.propertiesTitle,
              subTitle: m.prereqMessages.propertiesSubtitle,
            },
          ],
          submitField: {
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          },
        },
      )
    },
    { tabTitle: m.prereqMessages.tabTitle },
  )
  .build()
