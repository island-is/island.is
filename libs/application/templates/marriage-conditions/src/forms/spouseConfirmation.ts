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
import { NO, YES } from '../lib/constants'
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
      title: 'Inngangur',
      children: [
        buildMultiField({
          id: 'spouse',
          title: 'Könnun hjónavígsluskilyrða',
          description:
            'Jóna Jónssdóttir sendi inn umsókn um könnun hjónavígsluskilyrða ykkar þann 13. júní, 2021. Til þess að halda áfram með ferlið þurfa bæði hjónaefni að senda frá sér persónuupplýsingar til samþykktar af Sýslumanni.',
          children: [
            buildCheckboxField({
              id: 'spouseApprove',
              title: '',
              options: [
                { value: YES, label: 'Ég vil halda áfram' },
                { value: NO, label: 'Ég vil hafna þessari beiðni' },
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
          title: 'Hjónaefni',
          children: [
            buildMultiField({
              id: 'sides',
              title: m.informationTitle,
              children: [
                buildDescriptionField({
                  id: 'header1',
                  title: 'Hjónaefni 1',
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
                  title: 'Hjónaefni 2',
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
          title: 'Persónuupplýsingar',
          children: [
            buildMultiField({
              id: 'personalInfo',
              title: 'Persónuupplýsingar',
              description:
                'Veita þarf nánari persónuupplýsingar auk upplýsinga um hjúskaparstöðu fyrir vígslu. Hjónaefni ábyrgjast að þær upplýsingar sem eru gefnar séu réttar.',
              children: [
                buildTextField({
                  id: 'personalInfo.address',
                  title: 'Lögheimili',
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
                  title: 'IS',
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
                  title: 'Hjúskaparstaða fyrir vígslu',
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
                  title: 'Hvernig lauk síðasta hjúskap?',
                  options: [
                    { value: 'divorce', label: 'Með lögskilnaði' },
                    { value: 'lostSpouse', label: 'Með láti maka' },
                    { value: 'annulment', label: 'Með ógildingu' },
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
      title: 'Yfirlit',
      children: [
        buildMultiField({
          id: 'applicationOverview',
          title: 'Yfirlit umsóknar',
          description:
            'Vinsamlegast farðu yfir umsóknina til að vera viss um að réttar upplýsingar hafi verið gefnar upp. ',
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
    buildSection({
      id: 'spouseConfirmationOverview',
      title: '',
      children: [
        buildMultiField({
          id: 'done',
          title: 'Komið',
          children: [
            buildDescriptionField({
              id: 'applicationOverview',
              title: 'næsnæs',
              description: 'helloooo vel gert',
            }),
          ],
        }),
      ],
    }),
  ],
})
