import {
  buildForm,
  buildSection,
  buildSubmitField,
  buildCustomField,
  Form,
  FormModes,
  buildRadioField,
  buildMultiField,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import Logo from '../assets/Logo'

export const ConstituencyForm: Form = buildForm({
  id: 'Constitunecy',
  title: m.constituencySection.title,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'constituencySection',
      title: m.constituencySection.title,
      children: [
        buildRadioField({
          id: 'constituency',
          title: m.constituencySection.selectConstituency,
          width: 'half',
          largeButtons: true,
          defaultValue: '',
          options: [
            { value: 'Norðausturkjördæmi', label: 'Norðausturkjördæmi' },
            { value: 'Norðvesturkjördæmi', label: 'Norðvesturkjördæmi' },
            {
              value: 'Reykjavíkurkjördæmi norður',
              label: 'Reykjavíkurkjördæmi norður',
            },
            {
              value: 'Reykjavíkurkjördæmi suður',
              label: 'Reykjavíkurkjördæmi suður',
            },
            { value: 'Suðurkjördæmi', label: 'Suðurkjördæmi' },
            { value: 'Suðvesturkjördæmi', label: 'Suðvesturkjördæmi' },
          ],
        }),
      ],
    }),
    buildSection({
      id: 'disclaimerSection',
      title: m.disclaimerSection.title,
      children: [
        buildExternalDataProvider({
          title: m.disclaimerSection.title,
          id: 'approveDisclaimer',
          subTitle: m.disclaimerSection.subtitle,
          description: m.disclaimerSection.descriptionPt1,
          checkboxLabel: m.disclaimerSection.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'disclaimer',
              type: undefined,
              title: '',
              subTitle: m.disclaimerSection.descriptionPt2,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overviewSection',
      title: m.constituencySection.confirmationTitle,
      children: [
        buildMultiField({
          id: 'overviewSubmit',
          title: m.constituencySection.confirmation,
          description: m.constituencySection.confirmationDescription,
          children: [
            buildCustomField({
              id: 'review',
              title: '',
              component: 'ReviewConstituency',
            }),
            buildSubmitField({
              id: 'submit',
              title: '',
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.overviewSection.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'collectEndorsements',
          title: m.endorsementList.title,
          component: 'EndorsementList',
        }),
      ],
    }),
  ],
})
