import {
  buildAsyncSelectField,
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  Application,
  Form,
  FormModes,
  NationalRegistryIndividual,
} from '@island.is/application/types'

import { VehiclesAPI } from '../dataProviders'
import { carRecyclingMessages } from '../lib/messages'
import Logo from '../assets/Logo'
import gql from 'graphql-tag'

type permoVehicle = {
  GetVehiclesApi?: Array<{
    permno: string
    type: string
    color: string
    vinNumber: string
    firstRegDate: string
    isRecyclable: string
    hasCoOwner: string
    status: string
  }>
}

export const GetVehicles = gql`
  query GetVehicles {
    getVehicles {
      permno
      type
      color
      firstRegDate
      vinNumber
      isRecyclable
      hasCoOwner
      status
    }
  }
`

export const CarRecyclingForm: Form = buildForm({
  id: 'CarRecyclingDraft',
  title: carRecyclingMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    // buildSection({
    //   id: 'externalData',
    //   title: 'm.step.externalDataTitle',
    //   children: [
    //     buildExternalDataProvider({
    //       title: 'm.draft.externalDataTitle',
    //       id: 'approveExternalData',
    //       subTitle: 'm.draft.externalDataTitle',
    //       checkboxLabel: 'm.draft.externalDataTitle',
    //       dataProviders: [
    //         buildDataProviderItem({
    //           provider: VehiclesAPI,
    //           title: 'vehicles',
    //         }),
    //       ],
    //     }),
    //   ],
    // }),
    buildSection({
      id: 'carsOverview',
      title: 'oldAgePensionFormMessage.applicant.applicantSection',
      children: [
        buildSubSection({
          id: 'emailAndPhoneNumber',
          title: 'subSection',
          children: [
            buildMultiField({
              id: 'CarsOverview',
              title:
                'oldAgePensionFormMessage.applicant.applicantInfoSubSectionTitle',
              description:
                'oldAgePensionFormMessage.applicant.applicantInfoSubSectionDescription',
              children: [
                // buildTextField({
                //   id: 'applicantInfo.name',
                //   title: 'oldAgePensionFormMessage.applicant.applicantInfoName',
                //   backgroundColor: 'white',
                //   disabled: false,
                //   defaultValue: 'bæla dfjajfeanviaje',
                // }),
                // buildTextField({
                //   id: 'otherParentPhoneNumber',
                //   title: 'phoneNumber',
                //   variant: 'tel',
                //   format: '###-####',
                //   placeholder: '000-0000',
                // }),
                buildRadioField({
                  id: 'useLength',
                  title: 'radio',
                  description: 'parentalLeaveFormMessages.duration.description',
                  defaultValue: 'yes',
                  options: [
                    {
                      label: 'yes',
                      value: 'yes',
                    },
                    {
                      label:
                        'no',
                      value: 'no',
                    },
                  ],
                }),
                // buildCustomField({
                //   component: 'ShowQueries',
                //   id: 'testing',
                //   title: "testing",
                //   description:
                //     "testing",
                // }),
                // buildAsyncSelectField({
                //   title: 'parentalLeaveFormMessages.shared.pensionFund',
                //   id: 'payments.pensionFund',
                //   loadingError: 'parentalLeaveFormMessages.errors.loading',
                //   isSearchable: true,
                //   placeholder:
                //     'nothing',
                //   loadOptions: async ({ apolloClient }) => {
                //     const { data } =
                //       await apolloClient.query<permoVehicle>({
                //         query: GetVehicles,
                //       })

                //     return (
                //       data?.GetVehiclesApi?.map(({ permno }) => ({
                //         label: permno,
                //         value: permno,
                //       })) ?? []
                //     )
                //   },
                // }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'tmp',
      title: 'conclusion.general.sectionTitle',
      children: [
        // Only to have submit button visible
        buildTextField({
          id: 'tmp',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
