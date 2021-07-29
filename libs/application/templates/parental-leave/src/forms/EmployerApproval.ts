import {
  buildCustomField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
  coreMessages,
  buildSubSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildAsyncSelectField,
} from '@island.is/application/core'
import { CurrentUserCompanies } from '@island.is/api/schema'

import Logo from '../assets/Logo'
import {
  employerFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'
import { GetUserCompanies } from '../graphql/queries'

export type UserCompany = Pick<
  CurrentUserCompanies,
  'nationalId' | 'name' | 'hasProcuration'
>

interface GetUserCompaniesResponse {
  rskCurrentUserCompanies: UserCompany[]
}

export const EmployerApproval: Form = buildForm({
  id: 'EmployerApprovalForParentalLeave',
  title: employerFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'selectCompany',
      title: 'Select your company',
      children: [
        buildAsyncSelectField({
          title: parentalLeaveFormMessages.shared.pensionFund,
          id: 'payments.pensionFund',
          loadingError: parentalLeaveFormMessages.errors.loading,
          isSearchable: true,
          loadOptions: async ({ apolloClient }) => {
            const {
              data,
            } = await apolloClient.query<GetUserCompaniesResponse>({
              query: GetUserCompanies,
            })

            return (data?.rskCurrentUserCompanies ?? []).filter(company => company.hasProcuration).map(company => ({
              label: `${company.name} (${company.nationalId})`,
              value: company.nationalId,
            }))
          },
        }),
      ],
    }),
    buildSection({
      id: 'review',
      title: employerFormMessages.reviewSection,
      children: [
        /*
        buildSubSection({
          id: 'externalData',
          title: parentalLeaveFormMessages.shared.externalDataSubSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: parentalLeaveFormMessages.shared.introductionProvider,
              checkboxLabel: parentalLeaveFormMessages.shared.checkboxProvider,
              dataProviders: [
                buildDataProviderItem({
                  id: 'EmployerCompanies',
                  type: 'EmployerCompaniesProvider',
                  title:
                    employerFormMessages.externalDataEmployerCompaniesTitle,
                  subTitle:
                    employerFormMessages.externalDataEmployerCompaniesSubTitle,
                }),
              ],
            }),
          ],
        }),
        */
        buildMultiField({
          id: 'multi',
          title: employerFormMessages.reviewMultiTitle,
          children: [
            buildCustomField(
              {
                id: 'timeline',
                title: employerFormMessages.reviewMultiTitle,
                component: 'PeriodsRepeater',
              },
              {
                editable: false,
                showDescription: false,
              },
            ),
            buildCustomField({
              id: 'unionAndPensionInfo',
              title: '',
              component: 'EmployerApprovalExtraInformation',
            }),
            buildSubmitField({
              id: 'submit',
              title: coreMessages.buttonSubmit,
              placement: 'footer',
              actions: [
                {
                  name: coreMessages.buttonReject,
                  type: 'reject',
                  event: 'REJECT',
                },
                {
                  name: coreMessages.buttonApprove,
                  type: 'primary',
                  event: 'APPROVE',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: coreMessages.thanks,
          description: coreMessages.thanksDescription,
        }),
      ],
    }),
  ],
})
