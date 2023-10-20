import { DataProviderItem } from '@island.is/application/types'

export function generatePrerequisites(
  dataProviders: DataProviderItem[],
): string {
  const prerequisites = {
    id: 'SampleFormId',
    title: 'Sample Form',
    mode: 'notstarted',
    type: 'FORM',
    renderLastScreenBackButton: true,
    renderLastScreenButton: true,
    children: [
      {
        id: 'section1',
        title: 'Umsókn send inn!',
        type: 'SECTION',
        children: [
          {
            id: 'approveExternalData',
            title: 'Utanaðkomandi gögn',
            type: 'EXTERNAL_DATA_PROVIDER',
            isPartOfRepeater: false,
            children: null,
            submitField: {
              id: 'submit2',
              title: 'Submit Title',
              type: 'SUBMIT',
              placement: 'footer',
              children: null,
              doesNotRequireAnswer: true,
              component: 'SubmitFormField',
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Samþykkja',
                  type: 'primary',
                },
              ],
              refetchApplicationAfterSubmit: true,
            },
            dataProviders: dataProviders,
          },
        ],
      },
    ],
  }
  return JSON.stringify(prerequisites)
}
