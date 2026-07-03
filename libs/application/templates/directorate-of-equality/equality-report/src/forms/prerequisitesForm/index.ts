import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { CoatOfArms } from '@island.is/application/assets/institution-logos'
import {
  ActiveEqualityReportApi,
  CompanyRegistryApi,
  DoeCompanyApi,
  IdentityApi,
  UserProfileApi,
} from '../../dataProviders'
import { messages } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  title: messages.general.applicationName,
  logo: CoatOfArms,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'forsendur',
      title: messages.prerequisites.section.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: messages.prerequisites.section.title,
          description: messages.prerequisites.section.intro,
          checkboxLabel: messages.prerequisites.section.checkboxLabel,
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
          dataProviders: [
            buildDataProviderItem({
              provider: DoeCompanyApi,
            }),
            buildDataProviderItem({
              provider: ActiveEqualityReportApi,
              title: messages.prerequisites.activeEqualityReport.title,
              subTitle: messages.prerequisites.activeEqualityReport.intro,
            }),
            buildDataProviderItem({
              provider: CompanyRegistryApi,
              title: messages.prerequisites.companyRegistry.title,
              subTitle: messages.prerequisites.companyRegistry.intro,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: messages.prerequisites.userProfile.title,
              subTitle: messages.prerequisites.userProfile.intro,
            }),
            buildDataProviderItem({
              provider: IdentityApi,
              title: messages.prerequisites.nationalRegistry.title,
              subTitle: messages.prerequisites.nationalRegistry.intro,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'aboutTheCompany',
      title: messages.aboutTheCompany.section.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'equalityReport',
      title: messages.equalityReport.section.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'overview',
      title: messages.overview.sectionTitle,
      children: [],
    }),
  ],
})
