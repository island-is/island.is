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
        // todo better name of screen
        buildMultiField({
          id: 'externalDataSuccessPassedPrerequisites',
          title: 'Tókst að sækja gögn',
          condition: (formValue: FormValue, externalData: ExternalData) => {
            return !prerequisitesFailed(externalData)
          },
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
        // Dirty fix because the submit button has to close the application when
        // any of the prerequisites fail
        buildMultiField({
          id: 'externalDataSuccessFailedPrerequisites',
          title: 'Tókst að sækja gögn',
          condition: (formValue: FormValue, externalData: ExternalData) => {
            return prerequisitesFailed(externalData)
          },
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
