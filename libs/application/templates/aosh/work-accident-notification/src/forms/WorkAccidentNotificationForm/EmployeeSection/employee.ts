import {
  buildAlertMessageField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { employee, sections } from '../../../lib/messages'

// TODOD Remove type when we get generated types from api
export type WorkhourArrangement = {
  TegundVinnuID: number
  Heiti: string
}

export const employeeSubSection = buildSubSection({
  id: 'employeeSubSection',
  title: sections.draft.employee,
  children: [
    buildMultiField({
      title: employee.employee.pageTitle,
      description: employee.employee.description,
      children: [
        // buildNationalIdWithNameField({ //TODO Should we use this and look up ssn or have manual inputs (Case: Injured employee might not have an icelandic ssn)
        //   id: 'employeeSubSection.nationalField',
        //   title: employee.employee.nationality,
        // }),
        buildAlertMessageField({
          id: 'employeSubSection.alertMessageField',
          title: employee.employee.alertTitle,
          message: employee.employee.alertMessage,
          alertType: 'info',
        }),
        // buildNationalIdWithNameField({
        //   id: 'employeeSubSection.nationalField',
        //   title: '',
        // }),
        buildTextField({
          id: 'employeeSubSection.nationalField',
          title: employee.employee.ssn,
          width: 'half',
          variant: 'number',
          format: '######-####',
          // required: true,
        }),
        buildTextField({
          id: 'employeeSubSection.name',
          title: employee.employee.name,
          width: 'half',
          variant: 'text',
          // required: true,
        }),
        buildTextField({
          id: 'employeeSubSection.address',
          title: employee.employee.address,
          width: 'half',
          variant: 'text',
          // required: true,
        }),
        buildTextField({
          id: 'employeeSubSection.postnumberAndMunicipality',
          title: employee.employee.postnumberAndMunicipality,
          width: 'half',
          variant: 'text',
          // required: true,
        }),
        buildTextField({
          id: 'employeeSubSection.nationality',
          title: employee.employee.nationality,
          width: 'half',
          variant: 'text',
          // required: true,
        }),
        buildDescriptionField({
          id: 'employeeSubSection.workArrangement',
          title: employee.employee.workArrangement,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildSelectField({
          id: 'employeeSubSection.employmentStatus',
          title: employee.employee.employmentStatus,
          width: 'half',
          // required: true,
          options: [],
        }),
        buildDateField({
          id: 'employeeSubSection.date',
          width: 'half',
          // required: true,
          title: employee.employee.date,
        }),
        buildSelectField({
          id: 'employeeSubSection.employmentTime',
          title: employee.employee.employmentTime,
          width: 'half',
          // required: true,
          options: [],
        }),
        buildSelectField({
          id: 'employeeSubSection.employmentRate',
          title: employee.employee.employmentRate,
          width: 'half',
          // required: true,
          options: [],
        }),
        buildSelectField({
          id: 'employeeSubSection.workHourArrangement',
          width: 'half',
          // required: true,
          title: employee.employee.workHourArrangement,
          options: (application) => {
            const workhourArrangements = getValueViaPath(
              application.externalData,
              'aoshData.data.workhourArrangements',
              [],
            ) as WorkhourArrangement[]
            return workhourArrangements.map(({ TegundVinnuID, Heiti }) => ({
              value: TegundVinnuID.toString(),
              label: Heiti,
            }))
          },
        }),
        buildSelectField({
          id: 'employeeSubSection.businessLocation',
          title: employee.employee.businessLocation,
          width: 'half',
          // required: true,
          options: [],
        }),
        buildDescriptionField({
          id: 'employeeSubSection.occupationTitle',
          title: employee.employee.occupationTitle,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildCustomField({
          id: 'employeeSubSection.victimsOccupation',
          title: '',
          component: 'Occupation',
        }),
      ],
    }),
  ],
})
