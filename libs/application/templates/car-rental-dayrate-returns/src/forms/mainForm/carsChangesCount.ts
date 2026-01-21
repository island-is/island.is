import {
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { CarCategoryRecord } from '../../utils/types'
import { m } from '../../lib/messages'

export const carsChangesCountSection = buildSection({
  id: 'carsChangesCountSection',
  title: m.carsChangesCount.sectionTitle,
  children: [
    buildMultiField({
      id: 'carsChangesCountMultiField',
      title: m.carsChangesCount.multiTitle,
      children: [
        buildStaticTableField({
          header: [m.carsChangesCount.header],
          rows: (application) => {
            const data =
              getValueViaPath<CarCategoryRecord[]>(
                application.answers,
                'carsToChange',
              ) ?? []

            return [[data.length.toString()]]
          },
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: m.carsChangesCount.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
