import {
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
  buildMultiField,
  buildCheckboxField,
  buildDescriptionField,
  YesOrNoEnum,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
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
