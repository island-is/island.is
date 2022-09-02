import {
  buildForm,
  buildCustomField,
  buildDescriptionField,
  buildCheckboxField,
  buildSection,
  buildMultiField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  buildTextField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import { NO, YES, MarriageTermination } from '../lib/constants'
import { m } from '../lib/messages'
import {
  Form,
  FormModes,
  DefaultEvents,
  Application,
} from '@island.is/application/types'
import { Individual } from '../types'
import { format as formatNationalId } from 'kennitala'
import type { User } from '@island.is/api/domains/national-registry'

export const spouseConfirmation: Form = buildForm({
  id: 'spouseConfirmation',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'spouse',
      title: m.entrance,
      children: [
        buildMultiField({
          id: 'spouse',
          title: m.introSectionTitle,
          description: (application: Application) => ({
            ...m.spouseIntroDescription,
            values: {
              applicantsName: (application.answers.applicant as Individual)
                ?.person.name,
            },
          }),
          children: [
            buildCheckboxField({
              id: 'spouseApprove',
              title: '',
              options: [
                { value: YES, label: m.spouseContinue },
                { value: NO, label: m.spouseDecline },
              ],
              defaultValue: [YES],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'externalData',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'spouseApproveExternalData',
          title: m.dataCollectionTitle,
          subTitle: m.dataCollectionSubtitle,
          description: m.dataCollectionDescription,
          checkboxLabel: m.dataCollectionCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.dataCollectionNationalRegistryTitle,
              subTitle: m.dataCollectionNationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: m.dataCollectionUserProfileTitle,
              subTitle: m.dataCollectionUserProfileSubtitle,
            }),
            buildDataProviderItem({
              id: 'birthCertificate',
              type: '',
              title: m.dataCollectionBirthCertificateTitle,
              subTitle: m.dataCollectionBirthCertificateDescription,
            }),
            buildDataProviderItem({
              id: 'maritalStatus',
              type: '',
              title: m.dataCollectionMaritalStatusTitle,
              subTitle: m.dataCollectionMaritalStatusDescription,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'marriageSides',
      title: m.informationSectionTitle,
      children: [
        buildSubSection({
          id: 'sides',
          title: m.informationMaritalSides,
          children: [
            buildMultiField({
              id: 'sides',
              title: m.informationTitle,
              children: [
                buildDescriptionField({
                  id: 'header1',
                  title: m.informationWitness1,
                  titleVariant: 'h4',
                }),
                buildTextField({
                  id: 'applicant.person.nationalId',
                  title: m.nationalId,
                  width: 'half',
                  backgroundColor: 'white',
                  readOnly: true,
                  format: '######-####',
                  defaultValue: (application: Application) => {
                    return formatNationalId(application.applicant) ?? ''
                  },
                }),
                buildTextField({
                  id: 'applicant.person.name',
                  title: 'Nafn',
                  width: 'half',
                  backgroundColor: 'white',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as User
                    return nationalRegistry.fullName ?? ''
                  },
                }),
                buildTextField({
                  id: 'applicant.phone',
                  title: m.phone,
                  width: 'half',
                  backgroundColor: 'blue',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as any
                    return data.mobilePhoneNumber ?? ''
                  },
                }),
                buildTextField({
                  id: 'applicant.email',
                  title: m.email,
                  variant: 'email',
                  width: 'half',
                  backgroundColor: 'blue',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    const data = application.externalData.userProfile
                      .data as any
                    return data.email ?? ''
                  },
                }),
                buildDescriptionField({
                  id: 'header2',
                  title: m.informationWitness2,
                  titleVariant: 'h4',
                  space: 'gutter',
                }),
                buildCustomField({
                  id: 'spouse.person',
                  title: '',
                  component: 'NationalIdWithName',
                }),
                buildTextField({
                  id: 'spouse.phone',
                  title: m.phone,
                  width: 'half',
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) => {
                    const info = application.answers.spouse as Individual
                    return info?.phone ?? ''
                  },
                }),
                buildTextField({
                  id: 'spouse.email',
                  title: m.email,
                  variant: 'email',
                  width: 'half',
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) => {
                    const info = application.answers.spouse as Individual
                    return info?.email ?? ''
                  },
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'info',
          title: m.dataCollectionNationalRegistryTitle,
          children: [
            buildMultiField({
              id: 'personalInfo',
              title: m.dataCollectionNationalRegistryTitle,
              description: m.personalInformationDescription,
              children: [
                buildTextField({
                  id: 'personalInfo.address',
                  title: m.address,
                  backgroundColor: 'white',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as User
                    return nationalRegistry.address.streetAddress
                  },
                }),
                buildTextField({
                  id: 'personalInfo.citizenship',
                  title: m.citizenship,
                  backgroundColor: 'white',
                  width: 'half',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    const nationalRegistry = application.externalData
                      .nationalRegistry.data as User
                    return nationalRegistry.citizenship.code
                  },
                }),
                buildTextField({
                  id: 'personalInfo.maritalStatus',
                  title: m.maritalStatus,
                  backgroundColor: 'white',
                  width: 'half',
                  readOnly: true,
                  defaultValue: (application: Application) => {
                    const status = application.externalData.maritalStatus
                      .data as any
                    return status.maritalStatus
                  },
                }),
                buildDescriptionField({
                  id: 'space',
                  space: 'containerGutter',
                  title: '',
                }),
                buildRadioField({
                  id: 'personalInfo.previousMarriageTermination',
                  title: m.previousMarriageTermination,
                  options: [
                    {
                      value: MarriageTermination.divorce,
                      label: m.terminationByDivorce,
                    },
                    {
                      value: MarriageTermination.lostSpouse,
                      label: m.terminationByLosingSpouse,
                    },
                    {
                      value: MarriageTermination.annulment,
                      label: m.terminationByAnnulment,
                    },
                  ],
                  largeButtons: false,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'spouseConfirmationOverview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'applicationOverview',
          title: m.applicationOverview,
          children: [
            buildCustomField({
              id: 'spouseOverview',
              title: '',
              component: 'ApplicationOverview',
            }),
            buildSubmitField({
              id: 'spouseSubmitApplication',
              title: '',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Senda inn umsókn',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
