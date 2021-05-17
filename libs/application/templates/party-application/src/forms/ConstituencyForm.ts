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
import { Constituencies } from '../types'
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
            {
              value: Constituencies.NORTH_EAST,
              label: Constituencies.NORTH_EAST,
            },
            {
              value: Constituencies.NORTH_WEST,
              label: Constituencies.NORTH_WEST,
            },
            {
              value: Constituencies.RVK_NORTH,
              label: Constituencies.RVK_NORTH,
            },
            {
              value: Constituencies.RVK_SOUTH,
              label: Constituencies.RVK_SOUTH,
            },
            { value: Constituencies.SOUTH, label: Constituencies.SOUTH },
            {
              value: Constituencies.SOUTH_WEST,
              label: Constituencies.SOUTH_WEST,
            },
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
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: '',
              subTitle: '',
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
