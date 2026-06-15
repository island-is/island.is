import {
  coreMessages,
  FormBuilder,
  YES,
} from '@island.is/application/core'
import { DefaultEvents, FormModes, UserProfileApi } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import { NationalRegistryApi, propertiesApi } from '../../dataProviders'
import { dataSchema } from '../../lib/dataSchema'
import * as m from '../../lib/messages'

export const Prerequisites = new FormBuilder<typeof dataSchema>(
  'PrerequisitesDraft',
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
      section.addPage(
        'confirmRead',
        m.confirmReadMessages.title,
        (page) => {
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

          // Dev/local-only escape hatch so the payment flow can be tested without
          // a reachable charge-FJS service. Ticking this persists
          // `shouldUseMockPayment`, which makes the shared `Payment.createCharge`
          // action fabricate a fulfilled charge. The field is omitted entirely in
          // production, and `createCharge` additionally refuses mock payments
          // there — so it cannot affect real payments.
          if (!isRunningOnEnvironment('production')) {
            page.addCheckboxField('shouldUseMockPayment', '', {
              options: [
                {
                  label: 'Enable mock payment (dev only)',
                  value: YES,
                },
              ],
            })
          }
          // TODO: put this back in when properties can be fetched without national id
          // Before re-enabling, verify the by-code flow end to end:
          // `calculateAmount` and `sendNotificationToAllInvolved` resolve the
          // property via `getSelectedRealEstate` (externalData
          // `fetchPropertiesByCode.data`), and the owner notifications need
          // `thinglystirEigendur` on the property returned by
          // `hmsPropertyByPropertyCode` — confirm the HMS endpoint includes it.
          // .addCheckboxField('otherPropertiesThanIOwnCheckbox', '', {
          //   options: [
          //     {
          //       label: m.realEstateMessages.applyingForOtherProperty,
          //       value: YES,
          //     },
          //   ],
          // })
        },
      )
    },
    { tabTitle: m.confirmReadMessages.title },
  )
  .addSection(
    'conditions',
    '',
    (section) => {
      section.addExternalDataProvider('approveExternalData', m.prereqMessages.prereqTitle, {
        subTitle: m.prereqMessages.subTitle,
        checkboxLabel: m.prereqMessages.checkboxLabel,
        dataProviders: [
          {
            provider: UserProfileApi,
            title: m.prereqMessages.userProfileTitle,
            subTitle: m.prereqMessages.userProfileSubtitle,
          },
          {
            provider: NationalRegistryApi,
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
      })
    },
    { tabTitle: m.prereqMessages.tabTitle },
  )
  .build()
