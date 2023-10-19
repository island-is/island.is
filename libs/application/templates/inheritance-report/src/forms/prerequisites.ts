import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildSubmitField,
  buildKeyValueField,
  buildDescriptionField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { isEstateInfo } from '../lib/utils/isEstateInfo'
import format from 'date-fns/format'
import { format as formatNationalId } from 'kennitala'

export const prerequisites: Form = buildForm({
  id: 'prerequisites',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'prerequisites.dataCollection',
      title: m.dataCollectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionCheckbox,
          dataProviders: [
            buildDataProviderItem({
              //provider: TBD,
              title: m.deceasedInfoProviderTitle,
              subTitle: m.deceasedInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.personalInfoProviderTitle,
              subTitle: m.personalInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              //provider: TBD,
              title: m.financialInformationProviderTitle,
              subTitle: m.financialInformationProviderSubtitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.settingsInfoProviderTitle,
              subTitle: m.settingsInfoProviderSubtitle,
            }),
            buildDataProviderItem({
              //TODO: provider: TBD,
              title: m.funeralExpensesTitle,
              subTitle: m.funeralExpensesSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'prerequisites.deceasedInfo',
      title: m.irSubmitTitle,
      children: [
        buildMultiField({
          id: 'deceasedInfo',
          title: m.irSubmitTitle,
          description: m.irSubmitSubtitle,
          children: [
            buildKeyValueField({
              label: m.nameOfTheDeceased,
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (isEstateInfo(data) ? data.estate.nameOfDeceased : ''),
              width: 'half',
            }),
            buildKeyValueField({
              label: m.nationalId,
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateInfo(data)
                  ? formatNationalId(data?.estate.nationalIdOfDeceased)
                  : '',
              width: 'half',
            }),
            buildDescriptionField({
              id: 'space',
              space: 'gutter',
              title: '',
            }),
            buildKeyValueField({
              label: m.address,
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) => (isEstateInfo(data) ? data.estate.addressOfDeceased : ''),
              width: 'half',
            }),
            buildKeyValueField({
              label: m.deathDate,
              value: ({
                externalData: {
                  syslumennOnEntry: { data },
                },
              }) =>
                isEstateInfo(data)
                  ? format(new Date(data.estate.dateOfDeath), 'dd/MM/yyyy')
                  : m.deathDateNotRegistered,
              width: 'half',
            }),
            buildSubmitField({
              id: 'prerequisites.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirmButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    /* Set up for the consistency of the right side bar */
    buildSection({
      id: 'step3',
      title: m.applicantsInfo,
      children: [],
    }),
    buildSection({
      id: 'step4',
      title: m.properties,
      children: [],
    }),
    buildSection({
      id: 'step5',
      title: m.debtsTitle,
      children: [],
    }),
    buildSection({
      id: 'step6',
      title: m.funeralCostTitle,
      children: [],
    }),
    buildSection({
      id: 'step7',
      title: m.business,
      children: [],
    }),
    buildSection({
      id: 'step8',
      title: m.propertyForExchangeAndHeirs,
      children: [],
    }),
  ],
})
