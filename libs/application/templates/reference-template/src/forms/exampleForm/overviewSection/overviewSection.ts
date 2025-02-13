import {
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildSubmitField,
  buildOverviewField,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overview',
  title: 'Overview',
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: '',
      children: [
        buildDescriptionField({
          id: 'overview',
          title: 'Overview',
          description: m.overviewDescriptionText,
        }),
        buildOverviewField({
          id: 'overviewX',
          title: 'Upplýsingar um þig',
          description: m.overviewInfoDescripton,
          backId: 'testBack.id',
          bottomLine: false,
          items: (answers, _externalData) => {
            return [
              {
                width: 'full',
                keyText: 'Full width',
                valueText:
                  getValueViaPath<string>(answers, 'applicant.name') ?? '',
              },
              {
                width: 'half',
                keyText: 'Half width',
                valueText:
                  getValueViaPath<string>(answers, 'applicant.phoneNumber') ??
                  '',
              },
              {
                width: 'half',
                keyText: 'Half width',
                valueText: 'Hvassaleiti 5',
              },
              {
                width: 'full',
                // empty item to end line
              },
              {
                width: 'snug',
                keyText: 'Snug width',
                valueText: 'test@test.is',
              },
              {
                width: 'snug',
                keyText: 'Snug width',
                valueText: '+354 123 4567',
              },
              {
                width: 'snug',
                keyText: 'Snug width',
                valueText: '+354 123 4567',
              },
              {
                width: 'snug',
                keyText: 'Snug width',
                valueText: '+354 123 4567',
              },
              {
                width: 'full',
                // empty item to end line
              },
              {
                width: 'snug',
                keyText: 'Snug width',
                valueText: 'Reykjavík',
              },
              {
                width: 'half',
                keyText: 'Half width',
                valueText: 'test@test.is',
              },
              {
                width: 'snug',
                keyText: 'Snug width',
                valueText: 'test@test.is',
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'overviewY',
          title: 'Summing up numbers',
          backId: 'testBack.id',
          bottomLine: false,
          items: (_answers, _externalData) => {
            return [
              {
                width: 'full',
                keyText: m.number1,
                valueText: '1.000 kr.',
              },
              {
                width: 'full',
                keyText: 'Number 2',
                valueText: '2.000 kr.',
              },
              {
                width: 'full',
                keyText: 'Number 3',
                valueText: '3.000 kr.',
              },
              {
                width: 'half',
                lineAboveKeyText: true,
                keyText: 'The sum',
                valueText: '6.000 kr.',
                boldValueText: true,
              },
            ]
          },
        }),
        buildOverviewField({
          id: 'overviewÞ',
          title: 'Table overview',
          backId: 'testBack.id',
          tableData: (_answers, _externalData) => {
            return {
              header: [
                'Table heading 1',
                'Table heading 2',
                'Table heading 3',
                'Table heading 4',
              ],
              rows: [
                [
                  'Row 1, Column 1',
                  'Row 1, Column 2',
                  'Row 1, Column 3',
                  'Row 1, Column 4',
                ],
                [
                  'Row 2, Column 1',
                  'Row 2, Column 2',
                  'Row 2, Column 3',
                  'Row 2, Column 4',
                ],
                [
                  'Row 3, Column 1',
                  'Row 3, Column 2',
                  'Row 3, Column 3',
                  'Row 3, Column 4',
                ],
              ],
            }
          },
        }),
        buildOverviewField({
          id: 'overviewZ',
          title: 'File overview',
          description: m.overviewFileDescription,
          backId: 'testBack.id',
          bottomLine: true,
          attachments: (_answers, _externalData) => {
            return [
              {
                width: 'full',
                fileName: 'full-width-file.pdf',
                fileType: 'pdf',
              },
              {
                width: 'half',
                fileName: 'half-width-file.pdf',
                fileSize: '1.000 kb',
                fileType: 'pdf',
              },
              {
                width: 'half',
                fileName: 'half-width-file.pdf',
                fileSize: '1.000 kb',
                fileType: 'pdf',
              },
            ]
          },
        }),
        buildSubmitField({
          id: 'submitApplication',
          title: '',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.overviewSubmit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
