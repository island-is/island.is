import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  Form,
  FormModes,
  FormValue,
  ExternalData,
  buildSubmitField,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from './messages'
import Logo from '../assets/Logo'
import { shouldShowModal } from '../healthInsuranceUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: m.prerequisitesFormTitle,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'PrerequisitesInfoSection',
      title: m.prerequisitesFormTitle,
      children: [
        buildExternalDataProvider({
          title: m.externalDataTitle,
          id: 'approveExternalData',
          subTitle: m.externalDataSubtitle,
          checkboxLabel: m.externalDataCheckbox,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'directorateOfLabor',
              type: undefined,
              title: m.directorateOfLaborTitle,
              subTitle: m.directorateOfLaborSubTitle,
            }),
            buildDataProviderItem({
              id: 'internalRevenue',
              type: undefined,
              title: m.internalRevenueTitle,
              subTitle: m.internalRevenueSubTitle,
            }),
            buildDataProviderItem({
              id: 'insuranceAdministration',
              type: undefined,
              title: m.socialInsuranceAdministrationTitle,
              subTitle: m.socialInsuranceAdministrationSubtitle,
            }),
            buildDataProviderItem({
              id: 'moreInfo',
              type: undefined,
              title: '',
              subTitle: m.dataProvidersMoreInfo,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'applications',
              type: 'ApplicationsProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'healthInsurance',
              type: 'HealthInsuranceProvider',
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'pendingApplications',
              type: 'PendingApplications',
              title: '',
              subTitle: '',
            }),
          ],
        }),
        buildMultiField({
          id: 'informationRetrieval',
          title: m.externalDataTitle,
          children: [
            buildCustomField({
              id: 'informationRetrieval',
              component: 'InformationRetrieval',
              title: '',
            }),
            buildCustomField({
              id: 'errorModal',
              component: 'ErrorModal',
              title: '',
            }),
          ],
          condition: (formValue: FormValue, externalData: ExternalData) => {
            return shouldShowModal(externalData)
          },
        }),
        buildMultiField({
          id: 'externalDataSuccess',
          title: 'Tókst að sækja gögn',
          children: [
            buildDescriptionField({
              id: 'externalDataSuccessDescription',
              title: '',
              description: m.externalDataSuccessDescription,
            }),
            buildCustomField({
              title: 'test',
              component: 'PrerequisiteSummary',
              id: 'prerequisiteSummary',
            }),
            buildSubmitField({
              id: 'toDraft',
              placement: 'footer',
              title: m.externalDataSuccessSubmitFieldTitle,
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // Has to be here so that the submit button appears (does not appear if no screen is left).
        // Tackle that as AS task.
        buildDescriptionField({
          id: 'unused',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
