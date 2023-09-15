import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import format from 'date-fns/format'
import { getSelectedVehicle } from '../../../utils'

export const informationSubSection = buildSubSection({
  id: 'informationSubSection',
  title: information.labels.information.sectionTitle,
  children: [
    buildMultiField({
      id: 'informationMultiField',
      title: information.labels.information.title,
      description: information.labels.information.description,
      children: [
        buildDescriptionField({
          id: 'information.plateDescription',
          title: information.labels.information.plate,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'information.plate',
          title: information.labels.information.plate,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            return getSelectedVehicle(
              application.externalData,
              application.answers,
            ).regno
          },
        }),
        buildDescriptionField({
          id: 'information.newValidPeriod',
          title: information.labels.information.newValidPeriod,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'information.dateFrom',
          title: information.labels.information.dateFrom,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            return format(
              new Date(
                getSelectedVehicle(
                  application.externalData,
                  application.answers,
                ).startDate,
              ),
              'dd.MM.yyyy',
            )
          },
        }),
        buildTextField({
          id: 'information.dateTo',
          title: information.labels.information.dateTo,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const dateTo = new Date(
              getSelectedVehicle(
                application.externalData,
                application.answers,
              ).endDate,
            )
            return format(
              dateTo.setFullYear(dateTo.getFullYear() + 8),
              'dd.MM.yyyy',
            )
          },
        }),
        buildDescriptionField({
          id: 'information.beneficiary',
          title: information.labels.information.beneficiary,
          titleVariant: 'h5',
          space: 3,
        }),
        buildTextField({
          id: 'information.nationalId',
          title: information.labels.information.nationalId,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.nationalId,
        }),
        buildTextField({
          id: 'information.name',
          title: information.labels.information.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            application.externalData?.identity?.data?.name,
        }),
      ],
    }),
  ],
})
