import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { Routes } from '../../../utils/enums'
import {
  depositOverview,
  fireProtectionsOverview,
  landlordOverview,
  landlordRepresentativeOverview,
  otherCostsOverview,
  priceOverview,
  propertyConditionFilesOverview,
  propertyConditionOverview,
  propertyRegistrationOverview,
  rentalInfoOverview,
  rentalPeriodOverview,
  rentalPropertyOverview,
  specialProvisionsOverview,
  tenantOverview,
} from '../../../utils/overviewUtils'
import {
  securityDepositRequired,
  shouldShowRepresentative,
  singularOrPluralLandlordsTitle,
  singularOrPluralRepresentativeTitle,
  singularOrPluralTenantsTitle,
} from '../../../utils/conditions'
import * as m from '../../../lib/messages'

export const overviewSection = buildSection({
  id: Routes.SUMMARY,
  title: m.overview.pageTitle,
  children: [
    buildMultiField({
      id: Routes.SUMMARY,
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: m.overview.pageTitle,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          description: m.overview.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          description: m.overview.pageDescriptionSecondparagraph,
          marginBottom: 6,
        }),
        // Property address
        buildOverviewField({
          id: 'rentalInfoOverview',
          title: m.overview.propertyInfoHeader,
          items: rentalPropertyOverview,
          backId: Routes.PROPERTYSEARCH,
        }),
        // Landlords
        buildOverviewField({
          id: 'landlordOverview',
          title: singularOrPluralLandlordsTitle,
          items: landlordOverview,
          backId: Routes.PARTIESINFORMATION,
        }),
        // Landlord representatives
        buildOverviewField({
          id: 'landlordRepresentativeOverview',
          condition: shouldShowRepresentative,
          title: singularOrPluralRepresentativeTitle,
          items: landlordRepresentativeOverview,
          backId: Routes.PARTIESINFORMATION,
        }),
        // Tenants
        buildOverviewField({
          id: 'tenantOverview',
          title: singularOrPluralTenantsTitle,
          items: tenantOverview,
          backId: Routes.PARTIESINFORMATION,
        }),
        // Rental property
        buildOverviewField({
          id: 'rentalInfoOverview',
          title: m.overview.propertyInfoHeader,
          items: rentalInfoOverview,
          backId: Routes.PROPERTYSEARCH,
        }),
        // Property registration
        buildOverviewField({
          id: 'propertyRegistrationOverview',
          title: m.propertySearch.category.pageTitle,
          items: propertyRegistrationOverview,
          backId: Routes.PROPERTYINFORMATION,
        }),
        // Property description and special provisions
        buildOverviewField({
          id: 'specialProvisionsOverview',
          title: m.specialProvisions.subsection.pageTitle,
          items: specialProvisionsOverview,
          backId: Routes.SPECIALPROVISIONS,
        }),
        // Property condition
        buildOverviewField({
          id: 'propertyConditionOverview',
          title: m.overview.propertyConditionTitle,
          items: propertyConditionOverview,
          attachments: propertyConditionFilesOverview,
          backId: Routes.CONDITION,
        }),
        // Fire protections
        buildOverviewField({
          id: 'fireProtectionsOverview',
          title: m.overview.fireProtectionsTitle,
          items: fireProtectionsOverview,
          backId: Routes.FIREPROTECTIONS,
        }),
        // Rental period (start and end date)
        buildOverviewField({
          id: 'rentalPeriodOverview',
          title: m.overview.rentalPeriodDefiniteLabel,
          items: rentalPeriodOverview,
          backId: Routes.RENTALPERIOD,
        }),
        // Price
        buildOverviewField({
          id: 'priceOverview',
          title: m.overview.rentalAmountTitle,
          items: priceOverview,
          backId: Routes.RENTALAMOUNT,
        }),
        // Security deposit
        buildOverviewField({
          id: 'depositOverview',
          condition: securityDepositRequired,
          title: m.misc.securityDeposit,
          items: depositOverview,
          backId: Routes.SECURITYDEPOSIT,
        }),
        // Other fees
        buildOverviewField({
          id: 'otherCostsOverview',
          title: m.overview.otherCostsHeader,
          items: otherCostsOverview,
          backId: Routes.OTHERFEES,
        }),
        buildSubmitField({
          id: 'toSummary',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.application.goToOverviewButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
