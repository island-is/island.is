import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildPhoneField,
  buildSection,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  Form,
  FormModes,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { oldAgePensionFormMessage } from '../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { UserProfile } from '@island.is/api/schema'
import { getApplicationAnswers, getAvailableMonths, getAvailableYears } from '../lib/oldAgePensionUtils'

export const OldAgePensionForm: Form = buildForm({
  id: 'OldAgePensionDraft',
  title: oldAgePensionFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: oldAgePensionFormMessage.shared.prerequisitesSection,
      children: [],
    }),
    buildSection({
      id: 'applicant',
      title: oldAgePensionFormMessage.shared.applicantSection,
      children: [
        buildSubSection({
          id: 'period',
          title: oldAgePensionFormMessage.period.periodTitle,
          children: [
            // Period is from 65 year old or last 2 years if applicant is 67+
            //           to 6 month ahead
            buildMultiField({
              id: 'period',
              title: oldAgePensionFormMessage.period.periodTitle,
              description:
                oldAgePensionFormMessage.period.periodDescription,
              children: [
                buildCustomField({
                  id: 'period',
                  component: 'Period',
                  title: oldAgePensionFormMessage.period.periodTitle,
                }),
              ]
            })
            // buildMultiField({
            //   id: 'period',
            //   title: oldAgePensionFormMessage.period.periodTitle,
            //   children: [
            //     buildSelectField({
            //       id: 'period.year',
            //       title: oldAgePensionFormMessage.period.periodInputYear,
            //       options: (application: Application) => getAvailableYears(application),
            //       defaultValue: oldAgePensionFormMessage.period.periodInputYearDefaultText,
            //       width: 'half',
                  
            //     }),
            //     buildSelectField({
            //       id: 'period.month',
            //       condition: (answers) => {
            //         const { selectedYear } = getApplicationAnswers(answers)
            //         return !!selectedYear
            //       },
            //       title: oldAgePensionFormMessage.period.periodInputMonth,
            //       options: (application: Application) => getAvailableMonths(application),
            //       defaultValue: oldAgePensionFormMessage.period.periodInputMonthDefaultText,
            //       width: 'half'
            //     }),
            //   ]
            // })
          ],
        }),
        buildSubSection({
          id: 'info',
          title: oldAgePensionFormMessage.shared.applicantInfoSubSectionTitle,
          children: [
            buildMultiField({
              id: 'applicantInfo',
              title:
                oldAgePensionFormMessage.shared.applicantInfoSubSectionTitle,
              description:
                oldAgePensionFormMessage.shared
                  .applicantInfoSubSectionDescription,
              children: [
                buildTextField({
                  id: 'applicantInfo.name',
                  title: oldAgePensionFormMessage.shared.applicantInfoName,
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry.fullName
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.ID',
                  title: oldAgePensionFormMessage.shared.applicantInfoId,
                  format: '######-####',
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) =>
                    formatNationalId(application.applicant),
                }),
                buildTextField({
                  id: 'applicantInfo.address',
                  title: oldAgePensionFormMessage.shared.applicantInfoAddress,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.streetAddress
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.postcode',
                  title:
                    oldAgePensionFormMessage.shared.applicantInfoPostalcode,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.postalCode
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.municipality',
                  title:
                    oldAgePensionFormMessage.shared.applicantInfoMunicipality,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as NationalRegistryIndividual
                    return nationalRegistry?.address?.locality
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.email',
                  title: oldAgePensionFormMessage.shared.applicantInfoEmail,
                  width: 'half',
                  variant: 'email',
                  required: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as UserProfile
                    return data.email
                  },
                }),
                buildPhoneField({
                  id: 'applicantInfo.phonenumber',
                  title:
                    oldAgePensionFormMessage.shared.applicantInfoPhonenumber,
                  width: 'half',
                  placeholder: '000-0000',
                  required: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as UserProfile
                    return data.mobilePhoneNumber
                  },
                }),
                buildDescriptionField({
                  id: 'applicantInfo.descriptionField',
                  space: 'containerGutter',
                  titleVariant: 'h5',
                  title:
                    oldAgePensionFormMessage.shared.applicantInfoMaritalTitle,
                }),
                buildTextField({
                  id: 'applicantInfo.maritalStatus',
                  title:
                    oldAgePensionFormMessage.shared.applicantInfoMaritalStatus,
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return data.maritalStatus
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.spouseName',
                  title:
                    oldAgePensionFormMessage.shared.applicantInfoSpouseName,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return data.name
                  },
                }),
                buildTextField({
                  id: 'applicantInfo.spouseID',
                  title: oldAgePensionFormMessage.shared.applicantInfoId,
                  width: 'half',
                  backgroundColor: 'white',
                  disabled: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.nationalRegistrySpouse
                      .data as NationalRegistrySpouse
                    return data.nationalId
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'residence',
          title: oldAgePensionFormMessage.shared.residenceHistoryTitle,
          children: [
            buildMultiField({
              id: 'residenceHistory',
              title: oldAgePensionFormMessage.shared.residenceHistoryTitle,
              description:
                oldAgePensionFormMessage.shared.residenceHistoryDescription,
              children: [],
            }),
          ],
        }),
        buildSubSection({
          id: 'payment',
          title: oldAgePensionFormMessage.shared.residenceHistoryTitle,
          children: [
            buildMultiField({
              id: 'paymentInfo',
              title: oldAgePensionFormMessage.shared.residenceHistoryTitle,
              description:
                oldAgePensionFormMessage.shared.residenceHistoryDescription,
              children: [],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'arrangement',
      title: oldAgePensionFormMessage.shared.arrangementSection,
      children: [],
    }),
    buildSection({
      id: 'relatedApplications',
      title: oldAgePensionFormMessage.shared.relatedApplicationsSection,
      children: [],
    }),
    buildSection({
      id: 'comment',
      title: oldAgePensionFormMessage.shared.commentSection,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: oldAgePensionFormMessage.shared.confirmationSection,
      children: [],
    }),
  ],
})
