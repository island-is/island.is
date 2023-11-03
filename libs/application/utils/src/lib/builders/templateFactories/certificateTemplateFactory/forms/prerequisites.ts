import { DataProviderItem } from '@island.is/application/types'

export function generatePrerequisites(
  dataProviders: DataProviderItem[],
  title: string,
): string {
  const prerequisites = {
    id: 'SampleFormId',
    title: title,
    mode: 'notstarted',
    type: 'FORM',
    renderLastScreenBackButton: true,
    renderLastScreenButton: true,
    children: [
      {
        id: 'section1',
        title: 'Gagnaöflun',
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
