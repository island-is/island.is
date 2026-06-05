import {
  buildDateField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { mainForm } from '../../lib/messages'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  title: mainForm.title,
  logo: DirectorateOfLabourLogo,
  children: [
    buildMultiField({
      id: 'mainFormMultiField',
      title: mainForm.title,
      description: mainForm.description,
      children: [
        buildDescriptionField({
          id: 'dateDescription',
          title: mainForm.dateTitle,
          titleVariant: 'h5',
        }),
        buildDateField({
          id: 'date.from',
          title: mainForm.dateFrom,
          placeholder: mainForm.datePlaceholder,
          width: 'half',
          required: true,
          clearOnChange: ['date.to'],
          minDate: (application) => {
            const minFromDate =
              getValueViaPath<string>(
                application.externalData,
                'eligibilityData.data.minDateFrom',
              ) || new Date().toISOString()
            return new Date(minFromDate)
          },
          maxDate: (application) => {
            const maxDateTo = getValueViaPath<string>(
              application.externalData,
              'eligibilityData.data.maxDateTo',
            )
            return maxDateTo ? new Date(maxDateTo) : undefined
          },
        }),
        buildDateField({
          id: 'date.to',
          title: mainForm.dateTo,
          placeholder: mainForm.datePlaceholder,
          width: 'half',
          required: true,
          defaultValue: '',
          tempDisabled: (application) => {
            const fromDate = getValueViaPath<string>(
              application.answers,
              'date.from',
            )
            return !fromDate || fromDate === ''
          },
          minDate: (application) => {
            const fromDate = getValueViaPath<string>(
              application.answers,
              'date.from',
            )
            return fromDate ? new Date(fromDate) : undefined
          },
          maxDate: (application) => {
            const fromDate = getValueViaPath<string>(
              application.answers,
              'date.from',
            )
            if (!fromDate) {
              return undefined
            }
            const maxDateTo = getValueViaPath<string>(
              application.externalData,
              'eligibilityData.data.maxDateTo',
            )
            const maxDaysRaw =
              getValueViaPath<string>(
                application.externalData,
                'eligibilityData.data.maxDaysPerRequest',
              ) || '30'
            const maxDays = parseInt(maxDaysRaw, 10) || 30

            const date = new Date(fromDate)
            date.setDate(date.getDate() + maxDays - 1)

            if (maxDateTo && date > new Date(maxDateTo)) {
              return new Date(maxDateTo)
            }
            return date
          },
        }),
        buildSubmitField({
          id: 'submit',
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: mainForm.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
