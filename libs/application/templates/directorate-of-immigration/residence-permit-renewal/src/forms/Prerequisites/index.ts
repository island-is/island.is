import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import {
  agent,
  applicant,
  confirmation,
  expeditedProcessing,
  externalData,
  information,
  payment,
  personal,
} from '../../lib/messages'
import {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
  NationalRegistryMaritalTitleApi,
  ChildrenCustodyInformationApi,
  UserProfileApi,
  UtlendingastofnunPaymentCatalogApi,
  CountriesApi,
  TravelDocumentTypesApi,
  OldStayAbroadListApi,
  OldPassportItemApi,
  CurrentResidencePermitApi,
  OldCriminalRecordListApi,
  OldStudyItemApi,
  OldAgentItemApi,
} from '../../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.dataProvider.pageTitle,
          subTitle: externalData.dataProvider.subTitle,
          description: externalData.dataProvider.description,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: externalData.dataProvider.submitButton,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: NationalRegistryMaritalTitleApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              title: externalData.directorateOfImmigration.title,
              subTitle: externalData.directorateOfImmigration.subTitle,
            }),
            buildDataProviderItem({
              provider: CountriesApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: TravelDocumentTypesApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: CurrentResidencePermitApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldStayAbroadListApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldCriminalRecordListApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldStudyItemApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldPassportItemApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: OldAgentItemApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: UtlendingastofnunPaymentCatalogApi,
              title: '',
            }),
            buildDataProviderItem({
              pageTitle: externalData.dataProvider.subTitle2,
              title: '',
            }),
            buildDataProviderItem({
              id: 'meansOfSupport',
              title: externalData.icelandRevenueAndCustoms.title,
              subTitle: externalData.icelandRevenueAndCustoms.subTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'personal',
      title: personal.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'applicant',
      title: applicant.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'information',
      title: information.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'agent',
      title: agent.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'expeditedProcessing',
      title: expeditedProcessing.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
