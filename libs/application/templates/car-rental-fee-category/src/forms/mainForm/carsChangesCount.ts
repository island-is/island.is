import {
    buildDescriptionField,
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
        title: 'Skrá bifreiðar á kílómetragjald eða daggjald',
        children: [
          buildDescriptionField({
            id: 'carsChangesCountDescription',
            description: 'Veldur þær breytingar sem þú vilt gera',
          }),
          buildStaticTableField({
            header: ['Fjöldi bíla', ''],
            rows: (application) => {
                const data = getValueViaPath<CarCategoryRecord[]>(
                    application.answers,
                    'carsToChange',
                  ) ?? []

              return [
                ['Fjöldi bifreiða breytt', data.length.toString()],
              ]
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
  