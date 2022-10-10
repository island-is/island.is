import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { propertiesFields } from '../EstateWithNoProperty/externalDataFields/propertiesFields'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { willsAndAgreements } from '../sharedSections/willsAndAgreements'

export const form: Form = buildForm({
  id: 'residencePermitForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'estateMembersInfo',
      title: m.estateMembersTitle,
      children: [
        buildMultiField({
          id: 'estateMembersInfo',
          title: m.estateMembersTitle,
          description: m.estateMembersSubtitle,
          children: [
            buildDescriptionField({
              id: 'membersOfEstateTitle',
              title: m.estateMembers,
              description: m.estateMembersHeaderDescription,
              titleVariant: 'h3',
            }),
            buildCustomField({
              title: '',
              id: 'estateMembers',
              component: 'EstateMemberRepeater',
              childInputIds: [
                'estateMembers.encountered',
                'estateMembers.members',
              ],
            }),
            ...willsAndAgreements,
          ],
        }),
      ],
    }),
    buildSection({
      id: 'estateProperties',
      title: m.properties,
      children: [
        buildMultiField({
          id: 'estateProperties',
          title: m.properties,
          description: 'Tilgreina skal allar hjúskapareignir beggja hjóna',
          children: [...propertiesFields],
        }),
      ],
    }),
    buildSection({
      id: 'estateContents',
      title: 'Innbú',
      children: [
        buildMultiField({
          id: 'estateContents',
          title: m.properties,
          description: 'Tilgreina skal allar hjúskapareignir beggja hjóna',
          children: [
            buildDescriptionField({
              id: 'membersOfEstateTitle',
              title: 'Innbú',
              description: 'Til dæmis bækur og málverk',
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'contentsTextarea',
              title: 'Upplýsingar um innbú',
              placeholder: 'Skráðu inn upplýsingar um innbú hér',
              variant: 'textarea',
              rows: 7,
            }),
            buildTextField({
              id: 'contentsWorth',
              title: 'Matsverð samtals',
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'estateBankInfo',
      title: 'Innistæður í bönkum',
      children: [
        buildMultiField({
          id: 'estateBankInfo',
          title: m.properties,
          description: 'Tilgreina skal allar hjúskapareignir beggja hjóna',
          children: [
            buildDescriptionField({
              id: 'estateBankInfoTitle',
              title: 'Innistæður í bönkum',
              description: 'Bæði í innlendum og erlendum bönkum og sparisjóður',
              titleVariant: 'h3',
            }),
            buildTextField({
              id: 'bankAccount',
              title: 'Bankareikningur',
              placeholder: 'XXXX-XX-XXXXXX',
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.overviewTitle,
      children: [
        buildMultiField({
          id: 'overview',
          title: m.overviewTitle,
          description: 'Þú hefur valið að sækja um búsetuleyfi.',
          children: [
            buildSubmitField({
              id: 'residencePermit.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.submitApplication,
                  type: 'primary',
                },
              ],
            }),
          ]
        })
      ],
    })
  ],
})
