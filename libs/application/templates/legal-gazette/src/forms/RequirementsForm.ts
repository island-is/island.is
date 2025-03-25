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
  title: m.requirementsSectionTitle,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'requirements_section',
      title: m.requirementsSectionTitle,
      tabTitle: m.requirementsSectionTitle,
      children: [
        buildMultiField({
          id: 'prerequisites_fields',
          title: m.requirementsFormTitle,
          children: [
            buildDescriptionField({
              id: 'prerequisites_description_one',
              description: m.requirementsIntroPartOne,
            }),
            buildDescriptionField({
              id: 'prerequisites_description_two',
              description: m.requirementsIntroPartTwo,
            }),
            buildDescriptionField({
              id: 'prerequisites_description_three',
              description: m.requirementsIntroPartThree,
            }),
            buildDescriptionField({
              id: 'prerequisites_description_four',
              description: m.requirementsIntroPartFour,
            }),
            buildDescriptionField({
              id: 'prerequisites_description_five',
              description: m.requirementsIntroPartFive,
            }),
            buildCheckboxField({
              id: 'requirements.approval',
              marginTop: 5,
              options: [
                { value: YesOrNoEnum.YES, label: m.requirementsCheckboxLabel },
              ],
              onSelect(s) {
                console.log(s)
              },
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
  ],
})
