import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  FormValue,
  ExternalData,
} from '@island.is/application/types'
import {
  HealthInsuranceApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../dataProviders'
import { m } from '../lib/messages/messages'
import { IcelandHealthLogo } from '@island.is/application/assets/institution-logos'
import { prerequisitesFailed } from '../healthInsuranceUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: m.prerequisitesFormTitle,
  logo: IcelandHealthLogo,
  mode: FormModes.DRAFT,
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
              provider: NationalRegistryUserApi,
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
              provider: UserProfileApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              id: 'healthInsurance',
              provider: HealthInsuranceApi,
              title: '',
              subTitle: '',
            }),
          ],
        }),
        buildMultiField({
          id: 'externalDataSuccessPrerequisites',
          title: m.prerequisiteCheckScreenTitle,
          condition: (_formValue: FormValue, externalData: ExternalData) => {
            return !prerequisitesFailed(externalData)
          },
          children: [
            buildCustomField({
              id: 'prerequisiteSuccessSummary',
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
          condition: (_formValue: FormValue, externalData: ExternalData) => {
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
