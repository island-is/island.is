import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { FormModes, UserProfileApi } from '@island.is/application/types'
import { prereq as pm, application as am } from '../../lib/messages'
import { JobSearchEligibilityApi } from '../../dataProviders'

import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: am.actionCardPrerequisites,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: am.actionCardPrerequisites,
          checkboxLabel: pm.checkbox,
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: pm.title,
              subTitle: pm.subtitle,
            }),
            buildDataProviderItem({
              provider: JobSearchEligibilityApi,
              title: pm.title,
              subTitle: pm.subtitle,
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
