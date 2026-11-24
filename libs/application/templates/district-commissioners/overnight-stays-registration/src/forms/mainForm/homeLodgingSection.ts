import {
  buildAlertMessageField,
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { applicationMessages as m } from '../../lib/messages'
import {
  getAdvertisementUrls,
  getHomeLodgings,
  getReportingYears,
  hasActiveAdvertisement,
} from '../../utils/homeLodgings'

export const homeLodgingSection = buildSection({
  id: 'firstSection',
  title: m.homeLodgingSectionTitle,
  children: [
    buildMultiField({
      id: 'firstSection',
      title: m.homeLodgingSectionTitle,
      children: [
        buildAlertMessageField({
          id: 'homeLodgingInfo',
          alertType: 'info',
          title: m.homeLodgingInfoTitle,
          message: m.homeLodgingInfoMessage,
          marginBottom: 4,
        }),
        buildSelectField({
          id: 'year',
          title: m.grantYearTitle,
          description: m.yearSelectionTitle,
          placeholder: m.yearPlaceholder,
          required: true,
          width: 'full',
          marginBottom: 4,
          clearOnChange: ['homeLodgingId'],
          setOnChange: [
            {
              key: 'visits',
              value: [],
            },
            {
              key: 'pricing',
              value: {
                method: 'monthly',
                monthlyAmounts: {},
                perVisitAmounts: {},
              },
            },
          ],
          options: ({ externalData }: Application) =>
            getReportingYears(getHomeLodgings(externalData)).map(
              ({ year, allReturned }) => ({
                value: String(year),
                label: allReturned
                  ? {
                      ...m.submittedYearLabel,
                      values: { year },
                    }
                  : String(year),
                disabled: allReturned,
              }),
            ),
        }),
        buildCustomField({
          id: 'homeLodgingPicker',
          component: 'HomeLodgingPicker',
          doesNotRequireAnswer: true,
          childInputIds: ['homeLodgingId'],
        }),
        // The multi-field only submits answers whose id matches one of its
        // children, so the values written by the custom field above need a
        // field of their own to be persisted.
        buildHiddenInput({ id: 'homeLodgingId' }),
        // Saves the visits cleared by the year select's `setOnChange`, so the
        // previous year's visits do not come back after a reload.
        buildCustomField({
          id: 'visits',
          component: 'PersistAnswer',
          doesNotRequireAnswer: true,
        }),
        buildDescriptionField({
          id: 'advertisementInfo',
          title: m.advertisementTitle,
          titleVariant: 'h4',
          description: m.advertisementDescription,
          marginTop: 5,
          marginBottom: 2,
        }),
        buildCheckboxField({
          id: 'noActiveAdvertisement',
          large: false,
          backgroundColor: 'white',
          marginBottom: 2,
          clearOnChange: ['advertisements'],
          clearOnChangeDefaultValue: [],
          options: [
            {
              value: 'true',
              label: m.noActiveAdvertisementLabel,
            },
          ],
        }),
        buildFieldsRepeaterField({
          id: 'advertisements',
          defaultValue: (application: Application) =>
            getAdvertisementUrls(application.answers).map((url) => ({ url })),
          formTitleNumbering: 'none',
          minRows: 1,
          hideRemoveButton: false,
          addItemButtonText: m.addAdvertisementLink,
          marginTop: 0,
          condition: hasActiveAdvertisement,
          fields: {
            url: {
              component: 'input',
              label: m.advertisementUrlLabel,
              placeholder: m.advertisementUrlPlaceholder,
              width: 'full',
              required: true,
            },
          },
        }),
      ],
    }),
  ],
})
