import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  //buildTitleField,
  YES,
} from '@island.is/application/core'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import * as m from '../../lib/messages'

export const confirmReadSection = buildSection({
  id: 'confirmReadSectionSection',
  tabTitle: m.confirmReadMessages.title,
  children: [
    buildMultiField({
      id: 'confirmRead',
      title: m.confirmReadMessages.title,
      description: m.confirmReadMessages.description,
      children: [
        buildCheckboxField({
          id: 'confirmReadPrivacyPolicy',
          options: [
            {
              label: m.confirmReadMessages.confirmReadPrivacyPolicy,
              value: YES,
            },
          ],
        }),
        buildCheckboxField({
          id: 'confirmReadFireCompensationInfo',
          options: [
            {
              label: m.confirmReadMessages.confirmReadFireCompensationInfo,
              value: YES,
            },
          ],
        }),
        // Dev/local-only escape hatch so the payment flow can be tested without
        // a reachable charge-FJS service. Ticking this persists
        // `shouldUseMockPayment`, which makes the shared `Payment.createCharge`
        // action fabricate a fulfilled charge. The field is omitted entirely in
        // production, and `createCharge` additionally refuses mock payments
        // there — so it cannot affect real payments.
        ...(!isRunningOnEnvironment('production')
          ? [
              buildCheckboxField({
                id: 'shouldUseMockPayment',
                options: [
                  {
                    label: 'Enable mock payment (dev only)',
                    value: YES,
                  },
                ],
              }),
            ]
          : []),
        // TODO: put this back in when properties can be fetched without national id
        // buildTitleField({
        //   title: m.realEstateMessages.otherPropertiesTitle,
        // }),
        // buildCheckboxField({
        //   id: 'otherPropertiesThanIOwnCheckbox',
        //   options: [
        //     {
        //       label: m.realEstateMessages.applyingForOtherProperty,
        //       value: YES,
        //     },
        //   ],
        // }),
      ],
    }),
  ],
})
