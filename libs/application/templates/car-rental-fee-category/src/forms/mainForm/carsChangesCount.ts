import {
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { CarCategoryRecord } from '../../utils/types'

export const carsChangesCountSection = buildSection({
  id: 'carsChangesCountSection',
  title: 'Fjöldi bíla breytt',
  children: [
    buildMultiField({
      id: 'carsChangesCountMultiField',
      title: 'Staðfesta breytingar',
      children: [
        buildStaticTableField({
          header: ['Fjöldi bifreiða breytt'],
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
          title: 'Submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'Submit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
