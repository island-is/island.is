import {
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
  buildMultiField,
  buildCheckboxField,
  buildDescriptionField,
  YesOrNoEnum,
  buildDataProviderItem,
  buildExternalDataProvider,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { m } from '../lib/messages'

export const RequirementsForm: Form = buildForm({
  id: 'RequirementsDraft',
  title: m.requirements.approval.sectionTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Almenn umsókn Lögbirtingablaðsins',
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: 'Netfang og símanúmer úr þínum stillingum',
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: 'Grunnupplýsingar frá Þjóðskrá',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      title: m.requirements.approval.sectionTitle,
      children: [
        buildMultiField({
          id: 'prerequisites.fields',
          title: m.requirements.approval.formTitle,
          children: [
            buildDescriptionField({
              id: 'prerequisites.description_one',
              description: m.requirements.approval.introPartOne,
            }),
            buildDescriptionField({
              id: 'prerequisites.description_two',
              description: m.requirements.approval.introPartTwo,
            }),
            buildDescriptionField({
              id: 'prerequisites.description_three',
              description: m.requirements.approval.introPartThree,
            }),
            buildDescriptionField({
              id: 'prerequisites.description_four',
              description: m.requirements.approval.introPartFour,
            }),
            buildDescriptionField({
              id: 'prerequisites.description_five',
              description: m.requirements.approval.introPartFive,
            }),

            buildCheckboxField({
              id: 'requirements.approval',
              marginTop: 5,
              options: [
                {
                  value: YesOrNoEnum.YES,
                  label: m.requirements.approval.checkboxLabel,
                },
              ],
              required: true,
            }),
            buildSubmitField({
              id: 'toDraft',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: coreMessages.buttonNext,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      title: m.requirements.legalEntity.sectionTitle,
      children: [],
    }),
    buildSection({
      title: m.requirements.advertType.sectionTitle,
      children: [],
    }),
  ],
})
