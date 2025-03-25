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
      children: [
        buildMultiField({
          id: 'prerequisites_fields',
          title: m.requirements.approval.formTitle,
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
      ],
    }),
    buildSection({
      title: m.requirements.legalEntity.sectionTitle,
      children: [
        buildMultiField({
          title: m.requirements.legalEntity.formTitle,
          children: [
            buildDescriptionField({
              id: 'legalEntity_description',
              description: m.requirements.legalEntity.formIntro,
            }),
            buildSelectField({
              id: 'legalEntity.nationalId',
              title: m.requirements.legalEntity.selectTitle,
              width: 'half',
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
      ],
    }),
    buildSection({
      title: m.requirements.advertType.sectionTitle,
      children: [
        buildMultiField({
          title: m.requirements.advertType.formTitle,
          children: [
            buildDescriptionField({
              id: 'advertType_description',
              description: m.requirements.advertType.formIntro,
            }),
            buildSelectField({
              id: 'applicationType.id',
              title: m.requirements.advertType.selectTitle,
              width: 'half',
              options(application) {
                const advertTypeOptions = getValueViaPath<Option[]>(
                  application.externalData,
                  'advertTypeOptions.data',
                )

                return advertTypeOptions ?? []
              },
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
  ],
})
