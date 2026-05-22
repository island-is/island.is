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
          minDate: (application) => {
            const minFromDate =
              getValueViaPath<string>(
                application.externalData,
                'eligibilityData.data.minDateFrom',
              ) || new Date().toISOString()
            return new Date(minFromDate)
          },
        }),
        buildDateField({
          id: 'date.to',
          title: mainForm.dateTo,
          placeholder: mainForm.datePlaceholder,
          width: 'half',
          required: true,
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
            const maxDateTo = getValueViaPath<string>(
              application.externalData,
              'eligibilityData.data.maxDateTo',
            )
            if (fromDate) {
              const maxDays =
                getValueViaPath<string>(
                  application.externalData,
                  'eligibilityData.data.maxDaysPerRequest',
                ) || '30' // Default to 30 days if not provided

              const date = new Date(fromDate)
              date.setDate(date.getDate() + parseInt(maxDays, 10) - 1)

              if (maxDateTo && date > new Date(maxDateTo)) {
                return new Date(maxDateTo)
              }
              return date
            }
            if (maxDateTo) {
              return new Date(maxDateTo)
            }
            return undefined
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
