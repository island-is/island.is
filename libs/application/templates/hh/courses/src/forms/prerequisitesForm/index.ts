import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { CoursesApi } from '../../dataProviders'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: m.general.shorterApplicationTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.general.shorterApplicationTitle,
          dataProviders: [
            buildDataProviderItem({
              title: m.prerequisites.nationalRegistryTitle,
              subTitle: m.prerequisites.nationalRegistrySubTitle,
            }),
          ],
          submitField: buildSubmitField({
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
          }),
        }),
      ],
    }),
  ],
})
