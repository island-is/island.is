import {
  buildAlertMessageField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildNationalIdWithNameField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { employee, sections } from '../../../lib/messages'
import {
  EmploymentStatusOfVictimDto,
  LengthOfEmploymentDto,
  PostCodeDto,
  WorkhourArrangementDto,
  WorkstationDto,
} from '@island.is/clients/work-accident-ver'
import { getAllCountryCodes } from '@island.is/shared/utils'

export const employeeSubSection = (index: number) =>
  buildSubSection({
    id: `employee[${index}]`,
    title: () => {
      return {
        ...sections.draft.employee,
        values: {
          number: index + 1,
        },
      }
    },
    children: [
      buildMultiField({
        id: `employeeInformation[${index}]`,
        title: employee.employee.pageTitle,
        description: employee.employee.description,
        children: [
          buildAlertMessageField({
            id: `employee[${index}].alertMessageField`,
            title: employee.employee.alertTitle,
            message: employee.employee.alertMessage,
            alertType: 'info',
            doesNotRequireAnswer: true,
          }),
          buildCustomField(
            {
              id: `employeeInformation[${index}].delete`,
              title: '',
              component: 'TitleWithRemove',
              doesNotRequireAnswer: true,
            },
            {
              index: index,
            },
          ),
          buildNationalIdWithNameField({
            id: `employee[${index}].nationalField`,
            required: true,
            title: '',
          }),
          buildTextField({
            id: `employee[${index}].address`,
            maxLength: 255,
            title: employee.employee.address,
            width: 'half',
            variant: 'text',
            required: true,
          }),
          buildSelectField({
            id: `employee[${index}].postnumberAndMunicipality`,
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
            required: true,
          }),
          buildSelectField({
            id: `employee[${index}].nationality`,
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
            required: true,
          }),
          buildDescriptionField({
            id: `employee[${index}].workArrangement`,
            title: employee.employee.workArrangement,
            titleVariant: 'h5',
            marginTop: 4,
            marginBottom: 1,
          }),
          buildDateField({
            id: `employee[${index}].startDate`,
            width: 'half',
            required: true,
            title: employee.employee.startDate,
          }),
          buildSelectField({
            id: `employee[${index}].employmentTime`,
            title: employee.employee.employmentTime,
            width: 'half',
            required: true,
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
          buildTextField({
            id: `employee[${index}].employmentRate`,
            title: employee.employee.employmentRate,
            width: 'half',
            required: true,
            format: '###%',
          }),
          buildSelectField({
            id: `employee[${index}].workhourArrangement`,
            width: 'half',
            required: true,
            title: employee.employee.workhourArrangement,
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
            id: `employee[${index}].startOfWorkdayDate`,
            width: 'half',
            required: true,
            title: employee.employee.startOfWorkdayDate,
          }),
          buildTextField({
            id: `employee[${index}].startTime`,
            title: employee.employee.time,
            placeholder: employee.employee.timePlaceholder,
            required: true,
            width: 'half',
            format: '##:##',
          }),
          buildSelectField({
            id: `employee[${index}].workstation`,
            title: employee.employee.workstation,
            width: 'half',
            required: true,
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
            id: `employee[${index}].employmentStatus`,
            title: employee.employee.employmentStatus,
            width: 'half',
            required: true,
            options: (application) => {
              const options = getValueViaPath(
                application.externalData,
                'aoshData.data.employmentStatusOfVictim',
              ) as EmploymentStatusOfVictimDto[]
              return options.map((option) => ({
                value: option.code || '',
                label: option.name || '',
              }))
            },
          }),
          buildTextField({
            id: `employee[${index}].tempEmploymentSSN`,
            title: employee.employee.tempEmploymentSSN,
            width: 'half',
            variant: 'text',
            format: '######-####',
            condition: (formValue) =>
              getValueViaPath(
                formValue,
                `employee[${index}].employmentStatus`,
              ) === '4', // Code for 'starfsmannaleiga'
            required: true,
          }),
          buildDescriptionField({
            id: `employee[${index}].occupationTitle`,
            title: employee.employee.occupationTitle,
            titleVariant: 'h5',
            marginTop: 3,
          }),
          buildHiddenInput({
            id: `employee[${index}].victimsOccupationMajor`,
          }),
          buildHiddenInput({
            id: `employee[${index}].victimsOccupationSubMajor`,
          }),
          buildHiddenInput({
            id: `employee[${index}].victimsOccupationMinor`,
          }),
          buildHiddenInput({
            id: `employee[${index}].victimsOccupationUnit`,
          }),
          buildCustomField(
            {
              id: `employee[${index}].victimsOccupation`,
              title: '',
              component: 'Occupation',
            },
            {
              index: index,
            },
          ),
        ],
      }),
    ],
  })
