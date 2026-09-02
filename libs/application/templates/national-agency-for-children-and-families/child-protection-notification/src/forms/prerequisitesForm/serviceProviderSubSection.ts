import { Application } from '@island.is/api/schema'
import {
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  buildTitleField,
  coreMessages,
} from '@island.is/application/core'
import { prerequisitesMessages, sharedMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import { getApplicationExternalData } from '../../utils/getApplicationExternalData'

export const serviceProviderSubSection = buildSubSection({
  id: 'serviceProviderSubSection',
  title: prerequisitesMessages.serviceProvider.subSectionTitle,
  children: [
    buildMultiField({
      id: 'serviceProvider',
      title: prerequisitesMessages.serviceProvider.subSectionTitle,
      description: prerequisitesMessages.serviceProvider.description,
      children: [
        buildSelectField({
          id: 'serviceProvider.service',
          title: prerequisitesMessages.serviceProvider.service,
          placeholder: prerequisitesMessages.serviceProvider.servicePlaceholder,
          options: ({ externalData }) => {
            const { notifierRoles } = getApplicationExternalData(externalData)

            return notifierRoles.map((n) => ({
              value: n.value ?? '',
              label: n.label ?? '',
            }))
          },
        }),
        buildSelectField({
          id: 'serviceProvider.serviceType',
          title: prerequisitesMessages.serviceProvider.serviceType,
          placeholder:
            prerequisitesMessages.serviceProvider.serviceTypePlaceholder,
          options: ({ answers, externalData }) => {
            const { serviceProviderService } = getApplicationAnswers(answers)
            const { notifierRoleSubTypes } =
              getApplicationExternalData(externalData)

            return notifierRoleSubTypes
              .filter((n) => n.notifierRoleCode === serviceProviderService)
              .map((n) => ({
                value: n.code ?? '',
                label: n.label ?? '',
              }))
          },
          condition: (answers, externalData) => {
            const { serviceProviderService } = getApplicationAnswers(answers)
            const { notifierRoleSubTypes } =
              getApplicationExternalData(externalData)

            const hasSubTypes = notifierRoleSubTypes.some(
              (n) => n.notifierRoleCode === serviceProviderService,
            )
            return !!serviceProviderService && hasSubTypes
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
          readOnly: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).applicantName,
        }),
        buildTextField({
          id: 'serviceProvider.nationalId',
          title: coreMessages.nationalId,
          width: 'half',
          format: '######-####',
          readOnly: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantNationalId,
        }),
        buildTextField({
          id: 'serviceProvider.address.streetAddress',
          title: sharedMessages.address,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantAddress,
        }),
        buildTextField({
          id: 'serviceProvider.address.postalCode',
          title: sharedMessages.postalCode,
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData)
              .applicantPostalCode,
        }),
        buildTextField({
          id: 'serviceProvider.address.city',
          title: sharedMessages.municipality,
          width: 'half',
          readOnly: true,
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
          readOnly: true,
          defaultValue: (application: Application) =>
            getApplicationExternalData(application.externalData).actorName,
        }),
        buildTextField({
          id: 'serviceProvider.contactPersonNationalId',
          title: coreMessages.nationalId,
          width: 'half',
          format: '######-####',
          readOnly: true,
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
