import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildRadioField,
  buildSubmitField,
  buildSelectField,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { EstateTypes } from '../lib/constants'
import { m } from '../lib/messages'
import { EstateInfo } from '@island.is/clients/syslumenn'
import {
  EstateOnEntryApi,
  SyslumadurPaymentCatalogApi,
  MockableSyslumadurPaymentCatalogApi,
} from '../dataProviders'

export const getForm = ({
  allowDivisionOfEstate = false,
  allowEstateWithoutAssets = false,
  allowPermitToPostponeEstateDivision = false,
  allowDivisionOfEstateByHeirs = false,
  allowEstatePayment = false,
}): Form =>
  buildForm({
    id: 'PrerequisitesDraft',
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    children: [
      buildSection({
        id: 'selectEstate',
        children: [
          buildExternalDataProvider({
            id: 'preApproveExternalData',
            title: m.preDataCollectionHeading,
            description: m.preDataCollectionInfo,
            checkboxLabel: m.dataCollectionCheckbox,
            subTitle: m.dataCollectionSubtitle,
            dataProviders: [
              buildDataProviderItem({
                title: m.preDataCollectionTitle,
                subTitle: m.preDataCollectionDescription,
                id: 'syslumennOnEntry',
                provider: EstateOnEntryApi,
              }),
              ...(allowEstatePayment
                ? [
                    buildDataProviderItem({
                      provider: SyslumadurPaymentCatalogApi,
                      title: '',
                    }),
                    buildDataProviderItem({
                      provider: MockableSyslumadurPaymentCatalogApi,
                      title: '',
                    }),
                  ]
                : []),
            ],
          }),
          buildMultiField({
            id: 'estate',
            title: m.prerequisitesTitle,
            children: [
              buildSelectField({
                id: 'estateInfoSelection',
                title: m.chooseEstateSelectTitle,
                defaultValue: (application: {
                  externalData: {
                    syslumennOnEntry: { data: { estates: EstateInfo[] } }
                  }
                }) => {
                  return (
                    application.externalData.syslumennOnEntry?.data as {
                      estates: Array<EstateInfo>
                    }
                  ).estates[0].caseNumber
                },
                options: (application) => {
                  return (
                    application.externalData.syslumennOnEntry?.data as {
                      estates: Array<EstateInfo>
                    }
                  ).estates.map((estate) => {
                    return {
                      value: estate.caseNumber,
                      label: estate.nameOfDeceased,
                      // see the case number in the label for ease of use when testing
                      // label: estate.caseNumber + ' ' + estate.nameOfDeceased,
                    }
                  })
                },
                required: true,
              }),
              buildDescriptionField({
                id: 'applicationInfo',
                space: 'containerGutter',
                description: m.prerequisitesSubtitle,
              }),
              buildRadioField({
                id: 'selectedEstate',
                width: 'full',
                required: true,
                options: [
                  ...(allowDivisionOfEstate
                    ? [
                        {
                          value: EstateTypes.officialDivision,
                          label: m.estateTypeOfficialDivision,
                        },
                      ]
                    : []),
                  ...(allowEstateWithoutAssets
                    ? [
                        {
                          value: EstateTypes.estateWithoutAssets,
                          label: m.estateTypeWithoutAssets,
                        },
                      ]
                    : []),
                  ...(allowPermitToPostponeEstateDivision
                    ? [
                        {
                          value: EstateTypes.permitForUndividedEstate,
                          label: m.estateTypeUndividedEstate,
                        },
                      ]
                    : []),
                  ...(allowDivisionOfEstateByHeirs
                    ? [
                        {
                          value: EstateTypes.divisionOfEstateByHeirs,
                          label: m.estateTypeDivisionByHeirs,
                        },
                      ]
                    : []),
                ],
              }),
              buildSubmitField({
                id: 'estate.submit',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: m.confirmButton,
                    type: 'primary',
                  },
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
