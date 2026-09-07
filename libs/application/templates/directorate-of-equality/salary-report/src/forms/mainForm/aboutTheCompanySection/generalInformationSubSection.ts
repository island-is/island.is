import {
  buildMultiField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { messages } from '../../../lib/messages'
import { getEmployeeCountDisplay } from '../../../utils/employeeCountCategory'
import { getIsatClassification } from '../../../utils/isatClassification'

export const generalInformationSubSection = buildSubSection({
  id: 'generalInformation',
  title: messages.aboutTheCompany.generalInformation.sectionTitle,
  children: [
    buildMultiField({
      id: 'generalInformationMultiField',
      title: messages.aboutTheCompany.generalInformation.title,
      description: messages.aboutTheCompany.generalInformation.intro,
      children: [
        buildTextField({
          id: 'generalInformation.companyName',
          title: messages.aboutTheCompany.generalInformation.companyName,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getValueViaPath(application.externalData, 'companyData.data.name'),
        }),
        buildTextField({
          id: 'generalInformation.nationalId',
          title: messages.aboutTheCompany.generalInformation.nationalId,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'companyData.data.nationalId',
            ),
        }),
        buildTextField({
          id: 'generalInformation.address',
          title: messages.aboutTheCompany.generalInformation.address,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'companyData.data.address.streetAddress',
            ),
        }),
        buildTextField({
          id: 'generalInformation.postalCode',
          title: messages.aboutTheCompany.generalInformation.postalCode,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'companyData.data.address.postalCode',
            ),
        }),
        buildTextField({
          id: 'generalInformation.municipality',
          title: messages.aboutTheCompany.generalInformation.municipality,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'companyData.data.address.locality',
            ),
        }),
        buildTextField({
          id: 'generalInformation.numberOfEmployees',
          title: messages.aboutTheCompany.generalInformation.numberOfEmployees,
          width: 'half',
          disabled: true,
          defaultValue: (application: Application) =>
            getEmployeeCountDisplay(
              getValueViaPath<string>(
                application.externalData,
                'doeCompany.data.employeeCountCategory',
              ),
            ),
        }),
        buildTextField({
          id: 'generalInformation.isatClassification',
          title: messages.aboutTheCompany.generalInformation.isatClassification,
          width: 'full',
          disabled: true,
          defaultValue: (application: Application) => {
            const vat = getValueViaPath<
              {
                dateOfDeregistration?: Date | null
                classification?: { number?: string; name?: string }[]
              }[]
            >(application.externalData, 'companyData.data.vat')
            return vat ? getIsatClassification(vat) : 'Óþekkt'
          },
        }),
      ],
    }),
  ],
})
