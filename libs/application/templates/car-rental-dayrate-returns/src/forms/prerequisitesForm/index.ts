import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { SkatturApi } from '../../dataProviders'
import { m } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: m.prerequisites.tabTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.prerequisites.title,
          checkboxLabel: m.prerequisites.approvalCheckboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: SkatturApi, // Skatturinn
              title: m.prerequisites.skatturTitle,
              subTitle: m.prerequisites.skatturSubTitle,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: m.prerequisites.confirmButton,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
