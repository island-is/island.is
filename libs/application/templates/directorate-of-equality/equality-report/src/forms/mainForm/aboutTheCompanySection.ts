import {
  buildDescriptionField,
  buildMultiField,
  buildPhoneField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildTableRepeaterField,
  buildTextField,
  getValueViaPath,
  YES,
  NO,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { messages } from '../../lib/messages'
import { getEmployeeCountDisplay } from '../../utils/employeeCountCategory'
import { getIsatClassification } from '../../utils/isatClassification'
import { Gender, UNKNOWN_DISPLAY_VALUE } from '../../utils/constants'

export const aboutTheCompanySection = buildSection({
  id: 'aboutTheCompany',
  title: messages.aboutTheCompany.section.sectionTitle,
  children: [
    buildSubSection({
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
                getValueViaPath(
                  application.externalData,
                  'companyData.data.name',
                ),
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
              title:
                messages.aboutTheCompany.generalInformation.numberOfEmployees,
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
              title:
                messages.aboutTheCompany.generalInformation.isatClassification,
              width: 'full',
              disabled: true,
              defaultValue: (application: Application) => {
                const vat = getValueViaPath<
                  {
                    dateOfDeregistration?: Date | null
                    classification?: { number?: string; name?: string }[]
                  }[]
                >(application.externalData, 'companyData.data.vat')
                return vat ? getIsatClassification(vat) : UNKNOWN_DISPLAY_VALUE
              },
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'chiefExecutive',
      title: messages.aboutTheCompany.chiefExecutive.sectionTitle,
      children: [
        buildMultiField({
          id: 'chiefExecutiveMultiField',
          title: messages.aboutTheCompany.chiefExecutive.title,
          description: messages.aboutTheCompany.chiefExecutive.intro,
          children: [
            buildTextField({
              id: 'chiefExecutive.name',
              title: messages.aboutTheCompany.chiefExecutive.name,
              placeholder:
                messages.aboutTheCompany.chiefExecutive.namePlaceholder,
              width: 'full',
              required: true,
            }),
            buildTextField({
              id: 'chiefExecutive.email',
              title: messages.aboutTheCompany.chiefExecutive.email,
              placeholder:
                messages.aboutTheCompany.chiefExecutive.emailPlaceholder,
              width: 'full',
              variant: 'email',
              required: true,
            }),
            buildSelectField({
              id: 'chiefExecutive.gender',
              title: messages.aboutTheCompany.chiefExecutive.gender,
              width: 'half',
              required: true,
              options: [
                {
                  value: Gender.MALE,
                  label: messages.aboutTheCompany.chiefExecutive.genderMale,
                },
                {
                  value: Gender.FEMALE,
                  label: messages.aboutTheCompany.chiefExecutive.genderFemale,
                },
                {
                  value: Gender.NON_BINARY,
                  label:
                    messages.aboutTheCompany.chiefExecutive.genderNonBinary,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'contactPerson',
      title: messages.aboutTheCompany.contactPerson.sectionTitle,
      children: [
        buildMultiField({
          id: 'contactPersonMultiField',
          title: messages.aboutTheCompany.contactPerson.title,
          description: messages.aboutTheCompany.contactPerson.intro,
          children: [
            buildDescriptionField({
              id: 'contactPerson.contactInfoTitle',
              title: messages.aboutTheCompany.contactPerson.contactInfoTitle,
              description: '',
              titleVariant: 'h4',
            }),
            buildTextField({
              id: 'contactPerson.name',
              title: messages.aboutTheCompany.contactPerson.name,
              placeholder:
                messages.aboutTheCompany.contactPerson.namePlaceholder,
              width: 'full',
              required: true,
              defaultValue: (application: Application) =>
                getValueViaPath(application.externalData, 'identity.data.name'),
            }),
            buildTextField({
              id: 'contactPerson.email',
              title: messages.aboutTheCompany.contactPerson.email,
              placeholder:
                messages.aboutTheCompany.contactPerson.emailPlaceholder,
              width: 'full',
              variant: 'email',
              required: true,
              defaultValue: (application: Application) =>
                getValueViaPath(
                  application.externalData,
                  'userProfile.data.email',
                ),
            }),
            buildPhoneField({
              id: 'contactPerson.phone',
              title: messages.aboutTheCompany.contactPerson.phone,
              placeholder:
                messages.aboutTheCompany.contactPerson.phonePlaceholder,
              width: 'half',
              required: true,
              defaultValue: (application: Application) =>
                getValueViaPath(
                  application.externalData,
                  'userProfile.data.mobilePhoneNumber',
                ),
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'employeeCount',
      title: messages.aboutTheCompany.employeeCount.sectionTitle,
      children: [
        buildMultiField({
          id: 'employeeCountMultiField',
          title: messages.aboutTheCompany.employeeCount.title,
          description: messages.aboutTheCompany.employeeCount.intro,
          children: [
            buildTextField({
              id: 'employeeCount.women',
              title: messages.aboutTheCompany.employeeCount.women,
              width: 'half',
              variant: 'number',
              required: true,
            }),
            buildTextField({
              id: 'employeeCount.men',
              title: messages.aboutTheCompany.employeeCount.men,
              width: 'half',
              variant: 'number',
              required: true,
            }),
            buildTextField({
              id: 'employeeCount.nonBinary',
              title: messages.aboutTheCompany.employeeCount.nonBinary,
              width: 'half',
              variant: 'number',
              required: true,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'subsidiaries',
      title: messages.aboutTheCompany.subsidiaries.sectionTitle,
      children: [
        buildMultiField({
          id: 'subsidiariesMultiField',
          title: messages.aboutTheCompany.subsidiaries.title,
          description: messages.aboutTheCompany.subsidiaries.intro,
          children: [
            buildDescriptionField({
              id: 'subsidiaries.includesSubsidiariesTitle',
              title:
                messages.aboutTheCompany.subsidiaries.includesSubsidiariesTitle,
              description: '',
              titleVariant: 'h4',
            }),
            buildRadioField({
              id: 'subsidiaries.includesSubsidiaries',
              largeButtons: true,
              width: 'half',
              required: true,
              options: [
                {
                  value: YES,
                  label: messages.aboutTheCompany.subsidiaries.yes,
                },
                { value: NO, label: messages.aboutTheCompany.subsidiaries.no },
              ],
            }),
            buildTableRepeaterField({
              id: 'subsidiaries.list',
              marginTop: 0,
              formTitle: messages.aboutTheCompany.subsidiaries.tableFormTitle,
              addItemButtonText:
                messages.aboutTheCompany.subsidiaries.tableAddButton,
              saveItemButtonText:
                messages.aboutTheCompany.subsidiaries.tableSaveButton,
              removeButtonTooltipText:
                messages.aboutTheCompany.subsidiaries.tableRemoveButton,
              editButtonTooltipText:
                messages.aboutTheCompany.subsidiaries.tableEditButton,
              editField: true,
              fields: {
                nationalIdWithName: {
                  component: 'nationalIdWithName',
                  searchCompanies: true,
                  customNationalIdLabel:
                    messages.aboutTheCompany.subsidiaries.tableHeaderNationalId,
                  customNameLabel:
                    messages.aboutTheCompany.subsidiaries.tableHeaderName,
                },
              },
              table: {
                header: [
                  messages.aboutTheCompany.subsidiaries.tableHeaderName,
                  messages.aboutTheCompany.subsidiaries.tableHeaderNationalId,
                ],
                rows: ['name', 'nationalId'],
              },
              condition: (answers) =>
                getValueViaPath(
                  answers,
                  'subsidiaries.includesSubsidiaries',
                ) === YES,
            }),
          ],
        }),
      ],
    }),
  ],
})
