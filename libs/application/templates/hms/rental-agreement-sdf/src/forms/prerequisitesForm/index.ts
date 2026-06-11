import {
  coreMessages,
  FormBuilder,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'

import { SearchAddressesApi } from '../../dataProviders'
import { application } from '../../lib/messages'

export const PrerequisitesForm = new FormBuilder(
  'rentalAgreementSdfPrerequisites',
  '',
  {
    mode: FormModes.NOT_STARTED,
    renderLastScreenButton: true,
  },
)
  .addSection(
    'conditions',
    '',
    (section) => {
      section.addExternalDataProvider('approveExternalData', 'Gagnaöflun', {
        subTitle: 'Eftirfarandi gögn verða sótt rafrænt með þínu samþykki.',
        description:
          'Við þurfum að sækja upplýsingar um heimilisföng og fasteignir til að útbúa leigusamning.',
        checkboxLabel: 'Ég samþykki gagnaöflun',
        dataProviders: [
          {
            provider: SearchAddressesApi,
            title: 'Fasteignaupplýsingar',
            subTitle: 'Upplýsingar frá Húsnæðis- og mannvirkjastofnun.',
          },
        ],
        submitField: {
          id: 'submit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: coreMessages.buttonNext,
              type: 'primary',
            },
          ],
        },
      })
    },
    { tabTitle: application.name },
  )
  .build()
