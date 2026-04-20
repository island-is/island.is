import {
  buildForm,
  buildMultiField,
  buildSection,
  buildCustomField,
  buildSubSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  confirmation,
  externalData,
  overview,
  property,
  propertySearch,
} from '../lib/messages'
import { buildFormPaymentChargeOverviewSection } from '@island.is/application/ui-forms'
import { getChargeItemsWithExtraLabel } from '../util'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'

export const MortgageCertificateForm = (
  allowShip = false,
  allowVehicle = false,
): Form => {
  return buildForm({
    id: 'MortgageCertificateFormDraft',
    logo: DistrictCommissionersLogo,
    mode: FormModes.DRAFT,
    renderLastScreenBackButton: true,
    renderLastScreenButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: externalData.general.sectionTitle,
        children: [],
      }),
      buildSection({
        id: 'selectRealEstate',
        title: property.general.sectionTitle,
        children: [
          buildSubSection({
            title: propertySearch.general.sectionTitle,
            children: [
              buildMultiField({
                id: 'selectRealEstate.info',
                title: propertySearch.general.pageTitle,
                description: propertySearch.general.description,
                space: 1,
                children: [
                  buildCustomField(
                    {
                      id: 'selectedProperties',
                      component: 'SelectProperty',
                    },
                    {
                      allowShip: allowShip,
                      allowVehicle: allowVehicle,
                    },
                  ),
                ],
              }),
            ],
          }),
          buildSubSection({
            title: overview.general.sectionTitle,
            children: [
              buildMultiField({
                id: 'selectRealEstate.info',
                title: overview.general.pageTitle,
                space: 1,
                children: [
                  buildCustomField({
                    id: 'propertiesOverview',
                    component: 'PropertiesOverview',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      buildFormPaymentChargeOverviewSection({
        getSelectedChargeItems: (application) =>
          getChargeItemsWithExtraLabel(application),
      }),
      buildSection({
        id: 'confirmation',
        title: confirmation.general.sectionTitle,
        children: [],
      }),
    ],
  })
}
