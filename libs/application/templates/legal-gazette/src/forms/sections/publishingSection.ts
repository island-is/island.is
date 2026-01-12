import {
  buildSection,
  buildMultiField,
  buildTableRepeaterField,
  buildFieldsRepeaterField,
  buildRadioField,
  YesOrNoEnum,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { getWeekendDates } from '../../utils/utils'

export const publishingSection = buildSection({
  id: 'publishing',
  title: m.draft.sections.publishing.sectionTitle,
  children: [
    buildMultiField({
      id: 'publishing.form',
      title: m.draft.sections.publishing.formTitle,
      description: m.draft.sections.publishing.formIntro,
      children: [
        buildRadioField({
          id: 'publishing.withSpecificDates',
          title: m.draft.sections.publishing.datePickerType,
          description: m.draft.sections.publishing.datePickerDescription,
          defaultValue: YesOrNoEnum.YES,
          largeButtons: false,
          options: [
            {
              value: YesOrNoEnum.YES,
              label: m.draft.sections.publishing.radioSpecificDate,
            },
            {
              value: YesOrNoEnum.NO,
              label: m.draft.sections.publishing.radioNoSpecificDate,
            },
          ],
        }),
        buildFieldsRepeaterField({
          condition: (answers) => {
            const checked = getValueViaPath<YesOrNoEnum>(
              answers,
              'publishing.withSpecificDates',
            )

            return checked ? checked === YesOrNoEnum.YES : false
          },
          id: 'publishing.dates',
          defaultValue: [],
          titleVariant: 'h4',
          addItemButtonText: m.draft.sections.publishing.dateRepeaterAddButton,
          removeItemButtonText:
            m.draft.sections.publishing.dateRepeaterRemoveButton,
          minRows: 1,
          maxRows: 3,
          formTitleNumbering: 'none',
          fields: {
            date: {
              component: 'date',
              locale: 'is',
              label: m.draft.sections.publishing.datePickerLabel,
              width: 'full',
              required: true,
              minDate: new Date(),
              excludeDates: getWeekendDates(
                new Date(),
                new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
              ),
            },
          },
        }),
        buildTableRepeaterField({
          id: 'communication.channels',
          title: m.draft.sections.communication.formTitle,
          description: m.draft.sections.communication.formIntro,
          addItemButtonText: m.draft.sections.communication.addChannelButton,
          saveItemButtonText: m.draft.sections.communication.save,
          cancelButtonText: m.draft.sections.communication.cancel,
          removeButtonTooltipText: m.draft.sections.communication.removeButton,
          editButtonTooltipText: m.draft.sections.communication.editButton,
          editField: true,
          maxRows: 10,
          fields: {
            email: {
              component: 'input',
              label: m.draft.sections.communication.emailColumn,
              type: 'email',
              width: 'half',
              required: true,
            },
            phone: {
              component: 'input',
              type: 'tel',
              label: m.draft.sections.communication.phoneColumn,
              width: 'half',
            },
          },
        }),
      ],
    }),
  ],
})
