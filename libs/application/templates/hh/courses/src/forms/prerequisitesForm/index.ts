import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { HeilsugaeslaHofudborgarsvaedisinsLogo } from '@island.is/application/assets/institution-logos'
import {
  HhCoursesHealthCenterApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../../dataProviders'
import { m } from '../../lib/messages'
import { isCourseForProfessionals } from '../../utils/isCourseForProfessionals'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  logo: HeilsugaeslaHofudborgarsvaedisinsLogo,
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
              provider: NationalRegistryUserApi,
              title: m.prerequisites.nationalRegistryTitle,
              subTitle: m.prerequisites.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: HhCoursesHealthCenterApi,
              title: m.prerequisites.healthCenterTitle,
              subTitle: m.prerequisites.healthCenterSubTitle,
              // Health center is only relevant for public courses. For
              // professional courses we neither disclose nor fetch it.
              condition: (answers) => !isCourseForProfessionals(answers),
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
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
