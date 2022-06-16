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
} from '@island.is/application/core'
import { m } from './messages'
import Logo from '../assets/Logo'
import { prerequisitesFailed } from '../healthInsuranceUtils'

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
          id: 'externalDataSuccessPrerequisites',
          title: m.prerequisiteCheckScreenTitle,
          condition: (formValue: FormValue, externalData: ExternalData) => {
            return !prerequisitesFailed(externalData)
          },
          children: [
            buildCustomField({
              id: 'prerequisiteSuccessSummary',
              title: '',
              component: 'PrerequisiteSummary',
            }),
            buildSubmitField({
              id: 'toDraft',
              title: m.externalDataSuccessSubmitFieldTitle,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.prerequisiteStartApplication,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // Fix to prevent the user from continuing the application when one of the prerequisites fails.
        buildMultiField({
          id: 'externalDataFailedPrerequisites',
          title: m.prerequisiteCheckScreenTitle,
          condition: (formValue: FormValue, externalData: ExternalData) => {
            return prerequisitesFailed(externalData)
          },
          children: [
            buildCustomField({
              id: 'prerequisiteFailedSummary',
              title: 'test',
              component: 'PrerequisiteSummary',
            }),
          ],
        }),
      ],
    }),
  ],
})
