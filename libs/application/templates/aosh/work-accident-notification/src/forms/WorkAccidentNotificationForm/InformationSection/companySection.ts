import {
  buildAlertMessageField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildPhoneField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import {
  PostCodeDto,
  SizeOfTheEnterpriseDto,
} from '@island.is/clients/work-accident-ver'

export const companySection = buildSubSection({
  id: 'company',
  title: information.labels.company.sectionTitle,
  children: [
    buildMultiField({
      id: 'companyInformation',
      title: information.general.pageTitle,
      description: information.general.description,
      children: [
        buildHiddenInput({
          id: 'employeeAmount',
          doesNotRequireAnswer: true,
          defaultValue: (application: Application) => {
            const employeeAmount =
              getValueViaPath<number>(application.answers, 'employeeAmount') ??
              1
            return employeeAmount
          },
        }),
        buildDescriptionField({
          id: 'basicInformation.description',
          title: information.labels.company.descriptionField,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'basicInformation.nationalId',
          title: information.labels.company.nationalId,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalId = getValueViaPath<string>(
              application.externalData,
              'identity.data.nationalId',
            )

            return nationalId
          },
        }),
        buildTextField({
          id: 'basicInformation.name',
          title: information.labels.company.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const name = getValueViaPath<string>(
              application.externalData,
              'identity.data.name',
            )

            return name
          },
        }),
        buildTextField({
          id: 'basicInformation.address',
          title: information.labels.company.address,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            const streetAddress = getValueViaPath<string>(
              application.externalData,
              'identity.data.address.streetAddress',
            )

            return streetAddress
          },
        }),
        buildTextField({
          id: 'basicInformation.postnumber',
          title: information.labels.company.postNumberAndTown,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) => {
            let postalCode = getValueViaPath<string>(
              application.externalData,
              'identity.data.address.postalCode',
            )
            let city = getValueViaPath<string>(
              application.externalData,
              'identity.data.address.city',
            )

            if (!postalCode) {
              postalCode = '999'
              city = 'Óskráð/Útlönd'
            }
            if (!city) city = 'Óskráð/Útlönd'

            return `${postalCode} - ${city}`
          },
        }),
        buildSelectField({
          id: 'basicInformation.numberOfEmployees',
          title: information.labels.company.numberOfEmployees,
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const type = getValueViaPath<string>(
              application.externalData,
              'identity.data.type',
            )
            if (type === 'person') return '0'
            return undefined
          },
          options: (application) => {
            const sizeOfEnterprises =
              getValueViaPath<SizeOfTheEnterpriseDto[]>(
                application.externalData,
                'aoshData.data.sizeOfTheEnterprise',
              ) ?? []

            return sizeOfEnterprises
              .filter((size) => size?.code && size?.name)
              .map(({ code, name }) => ({
                label: name || '',
                value: code || '',
              }))
          },
        }),
        buildAlertMessageField({
          id: 'company.alertMessageField.emailAndPhone',
          message: information.labels.company.emailAndPhoneAlertMessage,
          alertType: 'info',
          marginBottom: 0,
          doesNotRequireAnswer: true,
        }),
        buildTextField({
          id: 'companyInformation.email',
          title: information.labels.company.email,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.email',
            ) ?? '',
        }),
        buildPhoneField({
          id: 'companyInformation.phonenumber',
          title: information.labels.company.phonenumber,
          width: 'half',
          required: true,
          enableCountrySelector: true,
          defaultValue: (application: Application) =>
            getValueViaPath<string>(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
            ) ?? '',
        }),
        buildAlertMessageField({
          id: 'company.alertMessageField',
          message: information.labels.company.alertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          marginBottom: 0,
        }),
        buildTextField({
          id: 'companyInformation.nameOfBranch',
          title: information.labels.company.nameOfBranch,
          backgroundColor: 'blue',
          width: 'half',
          required: true,
          defaultValue: (_application: Application) => '',
        }),
        buildTextField({
          id: 'companyInformation.addressOfBranch',
          title: information.labels.company.addressOfBranch,
          backgroundColor: 'blue',
          width: 'half',
          doesNotRequireAnswer: true,
          defaultValue: (_application: Application) => '',
          maxLength: 21,
        }),
        buildSelectField({
          id: 'companyInformation.postnumberOfBranch',
          title: information.labels.company.postNumberAndTownOfBranch,
          width: 'half',
          doesNotRequireAnswer: true,
          defaultValue: '',
          isClearable: true,
          options: (application) => {
            const postCodes =
              getValueViaPath<PostCodeDto[]>(
                application.externalData,
                'aoshData.data.postCode',
              ) ?? []
            return postCodes
              .filter((postCode) => postCode?.code && postCode?.name)
              .map(({ code, name }) => ({
                label: `${code} - ${name}`,
                value: code || '',
              }))
          },
        }),
      ],
    }),
  ],
})
