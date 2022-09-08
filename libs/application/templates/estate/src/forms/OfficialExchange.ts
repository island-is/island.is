import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const officialExchange: Form = buildForm({
  id: 'officialExchange',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: '',
          dataProviders: [
            buildDataProviderItem({
              id: '',
              type: '',
              title: m.deceasedInfoProviderTitle,
              subTitle: m.deceasedInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              id: '',
              type: '',
              title: m.personalInfoProviderTitle,
              subTitle: m.personalInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              id: '',
              type: '',
              title: m.settingsInfoProviderTitle,
              subTitle: m.settingsInfoProviderSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      title: m.announcer,
      children: [
        buildMultiField({
          id: 'applicant',
          title: m.announcer,
          description: m.applicantsInfoSubtitle,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: m.name,
              readOnly: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: m.nationalId,
              readOnly: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.address',
              title: m.address,
              readOnly: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.phone',
              title: m.phone,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.email',
              title: m.email,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'estateMembers',
      title: m.estateMembersTitle,
      children: [
        buildMultiField({
          id: 'info',
          title: m.estateMembersTitle,
          description: m.estateMembersSubtitle,
          children: [
            buildTextField({
              id: 'name',
              title: m.name,
              readOnly: true,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
  ],
})
