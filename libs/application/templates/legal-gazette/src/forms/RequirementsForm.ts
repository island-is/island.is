import {
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
  buildMultiField,
  buildCheckboxField,
  buildDescriptionField,
  YesOrNoEnum,
  buildSelectField,
  getValueViaPath,
  buildCustomField,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  Option,
} from '@island.is/application/types'
import { m } from '../lib/messages'

export const RequirementsForm: Form = buildForm({
  id: 'RequirementsDraft',
  title: m.requirements.approval.sectionTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      title: m.requirements.approval.sectionTitle,
      tabTitle: 'Test',
      children: [
        buildMultiField({
          id: 'prerequisites_fields',
          title: m.requirements.approval.formTitle,
          descriptionSpacing: 0,
          children: [
            buildDescriptionField({
              id: 'prerequisites_description_one',
              description: m.requirements.approval.introPartOne,
            }),
            buildDescriptionField({
              id: 'prerequisites_description_two',
              description: m.requirements.approval.introPartTwo,
            }),
            buildDescriptionField({
              id: 'prerequisites_description_three',
              description: m.requirements.approval.introPartThree,
            }),
            buildDescriptionField({
              id: 'prerequisites_description_four',
              description: m.requirements.approval.introPartFour,
            }),
            buildDescriptionField({
              id: 'prerequisites_description_five',
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
          ],
        }),
        buildMultiField({
          title: m.requirements.legalEntity.formTitle,
          descriptionSpacing: 0,
          children: [
            buildDescriptionField({
              id: 'legalEntity_description',
              description: m.requirements.legalEntity.formIntro,
              marginBottom: 3,
            }),
            buildSelectField({
              id: 'legalEntity.nationalId',
              title: m.requirements.legalEntity.selectTitle,
              placeholder: m.requirements.legalEntity.selectPlaceholder,
              width: 'half',
              size: 'sm',
              options(application) {
                const legalEntities = getValueViaPath<Option[]>(
                  application.externalData,
                  'legalEntityOptions.data',
                )

                return legalEntities ?? []
              },
            }),
          ],
        }),
        buildMultiField({
          title: m.requirements.advertType.formTitle,
          descriptionSpacing: 0,
          children: [
            buildDescriptionField({
              id: 'advertType_description',
              description: m.requirements.advertType.formIntro,
              marginBottom: 3,
            }),
            buildSelectField({
              id: 'applicationType.id',
              title: m.requirements.advertType.selectTitle,
              placeholder: m.requirements.advertType.selectPlaceholder,
              width: 'half',
              size: 'sm',
              marginBottom: 2,
              options(application) {
                const advertTypeOptions = getValueViaPath<Option[]>(
                  application.externalData,
                  'advertTypeOptions.data',
                )

                return advertTypeOptions ?? []
              },
            }),
            buildCustomField({
              id: 'advertType.recent',
              component: 'RecentlySelected',
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
