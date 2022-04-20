import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  buildDescriptionField,
  buildCheckboxField,
  buildSection,
  buildMultiField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  DefaultEvents,
} from '@island.is/application/core'
import { m } from '../lib/messages'

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
          description: 'Jóna Jónssdóttir sendi inn umsókn um könnun hjónavígsluskilyrða ykkar þann 13. júní, 2021. Til þess að halda áfram með ferlið þurfa bæði hjónaefni að senda frá sér persónuupplýsingar til samþykktar af Sýslumanni.',
          children: [
            buildCheckboxField({
              id: 'spouseApprove',
              title: '',
              options: [
                { value: 'approve', label: 'Ég samþykki umsókn' },
                { value: 'notApprove', label: 'Ég samþykki ekki umsókn' },
              ],
              defaultValue: ''
            }),
          ]
        })
      ]
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
              description: 'helloooo vel gert'
            })
          ],
        }),
      ],
    }),
  ]
})
