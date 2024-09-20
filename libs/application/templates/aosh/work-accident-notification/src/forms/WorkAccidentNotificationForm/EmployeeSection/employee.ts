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
import {
  LengthOfEmploymentDto,
  PostCodeDto,
  WorkhourArrangementDto,
  WorkstationDto,
} from '@island.is/clients/work-accident-ver'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { FormValue } from '@island.is/application/types'

export const employeeSubSection = buildSubSection({
  id: 'employee',
  title: sections.draft.employee,
  children: [
    buildMultiField({
      id: 'employeeInformation',
      title: employee.employee.pageTitle,
      description: employee.employee.description,
      children: [
        buildAlertMessageField({
          id: 'employee.alertMessageField',
          title: employee.employee.alertTitle,
          message: employee.employee.alertMessage,
          alertType: 'info',
        }),
        buildNationalIdWithNameField({
          id: 'employee.nationalField',
          title: '',
        }),
        buildTextField({
          // TODO(balli) Set some max length to this
          id: 'employee.address',
          title: employee.employee.address,
          width: 'half',
          variant: 'text',
          // required: true,
        }),
        buildSelectField({
          id: 'employee.postnumberAndMunicipality',
          title: employee.employee.postnumberAndMunicipality,
          width: 'half',
          options: (application) => {
            const postCodes = getValueViaPath(
              application.externalData,
              'aoshData.data.postCode',
              [],
            ) as PostCodeDto[]

            return postCodes
              .filter((postCode) => postCode?.code && postCode?.name)
              .map(({ code, name }) => ({
                label: `${code} - ${name}`,
                value: code || '',
              }))
          },
          // required: true,
        }),
        buildSelectField({
          id: 'employee.nationality',
          title: employee.employee.nationality,
          width: 'half',
          options: () => {
            const countries = getAllCountryCodes()
            return countries.map((country) => {
              return {
                label: country.name_is || country.name,
                value: country.code,
              }
            })
          },
          // required: true,
        }),
        buildDescriptionField({
          id: 'employee.workArrangement',
          title: employee.employee.workArrangement,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildDateField({
          id: 'employee.startDate',
          width: 'half',
          // required: true,
          title: employee.employee.startDate,
        }),
        buildSelectField({
          id: 'employee.employmentTime',
          title: employee.employee.employmentTime,
          width: 'half',
          // required: true,
          options: (application) => {
            const empLength = getValueViaPath(
              application.externalData,
              'aoshData.data.lengthOfEmployment',
              [],
            ) as LengthOfEmploymentDto[]
            return empLength
              .filter((length) => length?.code && length?.name)
              .map(({ name, code }) => ({
                label: name || '',
                value: code || '',
              }))
          },
        }),
        buildSelectField({
          id: 'employee.employmentRate',
          title: employee.employee.employmentRate,
          width: 'half',
          // required: true,
          options: [],
        }),
        buildSelectField({
          id: 'employee.workHourArrangement',
          width: 'half',
          // required: true,
          title: employee.employee.workHourArrangement,
          options: (application) => {
            const workhourArrangements = getValueViaPath(
              application.externalData,
              'aoshData.data.workhourArrangement',
              [],
            ) as WorkhourArrangementDto[]
            return workhourArrangements
              .filter((workHr) => workHr?.code && workHr?.name)
              .map(({ name, code }) => ({
                label: name || '',
                value: code || '',
              }))
          },
        }),
        buildDateField({
          id: 'employee.dateOfAccident',
          width: 'half',
          // required: true,
          title: employee.employee.date,
        }),
        buildTextField({
          id: 'accidentDetails.timeOfAccident',
          title: employee.employee.time,
          placeholder: employee.employee.timePlaceholder,
          required: true,
          width: 'half',
          format: '##:##',
        }),
        buildSelectField({
          id: 'employee.workstation',
          title: employee.employee.workstation,
          width: 'half',
          // required: true,
          options: (application) => {
            const workstations = getValueViaPath(
              application.externalData,
              'aoshData.data.workstation',
              [],
            ) as WorkstationDto[]
            return workstations
              .filter((workstation) => workstation?.code && workstation?.name)
              .map(({ name, code }) => ({
                label: name || '',
                value: code || '',
              }))
          },
        }),
        buildSelectField({
          id: 'employee.employmentStatus',
          title: employee.employee.employmentStatus,
          width: 'half',
          // required: true,
          options: [
            {
              label: 'Starfsmannaleiga',
              value: 'Starfsmannaleiga',
            },
          ],
        }),
        buildTextField({
          // TODO(balli) Set some max length to this
          id: 'employee.tempEmploymentSSN',
          title: employee.employee.tempEmploymentSSN,
          width: 'half',
          variant: 'text',
          // TODO(balli) fix validation etc here when we get data from a web service
          condition: (formValue) =>
            getValueViaPath(formValue, 'employee.employmentStatus') ===
            'Starfsmannaleiga',
          // required: true,
        }),
        buildDescriptionField({
          id: 'employee.occupationTitle',
          title: employee.employee.occupationTitle,
          titleVariant: 'h5',
          marginTop: 3,
        }),
        buildCustomField({
          id: 'employee.victimsOccupation',
          title: '',
          component: 'Occupation',
        }),
      ],
    }),
  ],
})
