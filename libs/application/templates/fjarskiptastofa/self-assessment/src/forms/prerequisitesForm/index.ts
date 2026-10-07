import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { IdentityApi, UserProfileApiWithValidation } from '../../dataProviders'
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
          description: m.prerequisites.intro,
          subTitle: undefined,
          checkboxLabel: m.prerequisites.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: IdentityApi,
              title: m.prerequisites.identityTitle,
              subTitle: m.prerequisites.identitySubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApiWithValidation,
              title: m.prerequisites.userProfileTitle,
              subTitle: m.prerequisites.userProfileSubTitle,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: m.prerequisites.submit,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
