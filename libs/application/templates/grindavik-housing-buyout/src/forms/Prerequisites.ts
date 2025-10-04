import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  checkResidence,
  grindaVikHousing,
} from '../dataProviders'
import { prerequisites, application } from '../lib/messages'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'

export const Prerequisites: Form = buildForm({
  id: 'HomeSupportPrerequisites',
  title: application.general.name,
  mode: FormModes.DRAFT,
  logo: DistrictCommissionersLogo,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisitesIntro',
      title: prerequisites.intro.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'prerequisitesIntroTitle',
          title: prerequisites.intro.sectionTitle,
          description: prerequisites.intro.text,
          space: 2,
        }),
      ],
    }),
    buildSection({
      id: 'prerequisites',
      title: prerequisites.general.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: prerequisites.general.sectionTitle,
          subTitle: prerequisites.general.subTitle,
          checkboxLabel: prerequisites.general.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: prerequisites.dataProviders.nationalRegistryTitle,
              subTitle: prerequisites.dataProviders.nationalRegistryDescription,
            }),
            buildDataProviderItem({
              provider: checkResidence,
              title: prerequisites.dataProviders.getResidenceHistoryTitle,
              subTitle:
                prerequisites.dataProviders.getResidenceHistoryDescription,
            }),
            buildDataProviderItem({
              provider: grindaVikHousing,
              title: prerequisites.dataProviders.getGrindavikHousingTitle,
              subTitle:
                prerequisites.dataProviders.getGrindavikHousingDescription,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: prerequisites.dataProviders.userProfileTitle,
              subTitle: prerequisites.dataProviders.userProfileDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
