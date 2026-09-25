import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { SurveyOption } from '../lib/constants'
import { m } from '../lib/messages'

export const MainForm: Form = buildForm({
  id: 'TranslationWorkspaceSmokeTestMainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'mainSection',
      title: m.mainSectionTitle,
      children: [
        buildMultiField({
          id: 'mainMultiField',
          title: m.mainSectionTitle,
          children: [
            buildDescriptionField({
              id: 'mainMarkdownDescription',
              description: m.mainMarkdownDescription,
            }),
            buildRadioField({
              id: 'mainRadio',
              title: m.mainRadioTitle,
              required: true,
              options: [
                {
                  label: m.mainRadioOptionOneLabel,
                  value: SurveyOption.OPTION_ONE,
                },
                {
                  label: m.mainRadioOptionTwoLabel,
                  value: SurveyOption.OPTION_TWO,
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
