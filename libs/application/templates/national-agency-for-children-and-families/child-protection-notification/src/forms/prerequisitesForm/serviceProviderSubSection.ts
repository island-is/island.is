import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
  buildAsyncSelectField,
  coreErrorMessages,
  buildTextField,
  coreMessages,
  buildTitleField,
} from '@island.is/application/core'
import { prerequisitesMessages, sharedMessages } from '../../lib/messages'
import { Application } from '@island.is/api/schema'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'

export const serviceProviderSubSection = buildSubSection({
  id: 'serviceProviderSubSection',
  title: prerequisitesMessages.serviceProvider.subSectionTitle,
  children: [
    buildMultiField({
      id: 'serviceProvider',
      title: prerequisitesMessages.serviceProvider.subSectionTitle,
      description: prerequisitesMessages.serviceProvider.description,
      children: [
        buildAsyncSelectField({
          id: 'serviceProvider.service',
          title: prerequisitesMessages.serviceProvider.service,
          placeholder: prerequisitesMessages.serviceProvider.servicePlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          loadOptions: async () => {
            // TODO: Update to call endpoint for services when implemented
            return [
              { value: '1', label: 'Þjónusta 1' },
              { value: '2', label: 'Þjónusta 2' },
              { value: '3', label: 'Þjónusta 3' },
            ]
          },
        }),
        buildAsyncSelectField({
          id: 'serviceProvider.serviceType',
          title: prerequisitesMessages.serviceProvider.serviceType,
          placeholder:
            prerequisitesMessages.serviceProvider.serviceTypePlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          loadOptions: async () => {
            // TODO: Update to call endpoint for services when implemented
            return [
              { value: '1', label: 'Tegund 1' },
              { value: '2', label: 'Tegund 2' },
              { value: '3', label: 'Tegund 3' },
            ]
          },
          condition: (answers) => {
            const { serviceProviderService } = getApplicationAnswers(answers)

            return !!serviceProviderService
          },
        }),

        buildTitleField({
          title: prerequisitesMessages.serviceProvider.subSectionTitle,
          titleVariant: 'h4',
          marginTop: 4,
          marginBottom: 0,
        }),
        buildTextField({
          id: 'serviceProvider.name',
          title: coreMessages.name,
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantName,
        }),
        buildTextField({
          id: 'serviceProvider.nationalId',
          title: coreMessages.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantNationalId,
        }),
        buildTextField({
          id: 'serviceProvider.address.streetAddress',
          title: sharedMessages.address,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantAddress,
        }),
        buildTextField({
          id: 'serviceProvider.address.postalCode',
          title: sharedMessages.postalCode,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantPostalCode,
        }),
        buildTextField({
          id: 'serviceProvider.address.city',
          title: sharedMessages.municipality,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantCity,
        }),

        buildDescriptionField({
          id: 'serviceProvider.contactPerson',
          title: prerequisitesMessages.serviceProvider.contactPerson,
          description:
            prerequisitesMessages.serviceProvider.contactPersonDescription,
          titleVariant: 'h4',
          space: 4,
        }),
        buildTextField({
          id: 'serviceProvider.contactPersonName',
          title: coreMessages.name,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).actorName,
        }),
        buildTextField({
          id: 'serviceProvider.contactPersonNationalId',
          title: coreMessages.nationalId,
          width: 'half',
          format: '######-####',
          disabled: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .actorNationalId,
        }),
        buildTextField({
          id: 'serviceProvider.contactPersonWorkEmail',
          title: prerequisitesMessages.serviceProvider.workEmail,
          tooltip: prerequisitesMessages.serviceProvider.workEmailTooltip,
          width: 'half',
          variant: 'email',
        }),
        buildTextField({
          id: 'serviceProvider.contactPersonWorkPhone',
          title: prerequisitesMessages.serviceProvider.workPhone,
          width: 'half',
          format: '###-####',
          placeholder: '000-0000',
        }),
      ],
    }),
  ],
})
