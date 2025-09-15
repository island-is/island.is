import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { Routes } from '../../utils/enums'
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
} from '../../utils/overviewUtils'
import {
  securityDepositRequired,
  shouldShowRepresentative,
  singularOrPluralLandlordsTitle,
  singularOrPluralRepresentativeTitle,
  singularOrPluralTenantsTitle,
} from '../../utils/conditions'
import * as m from '../../lib/messages'

export const SummaryDraftSection = buildSection({
  id: Routes.SUMMARY,
  title: m.summary.pageTitle,
  children: [
    buildMultiField({
      id: Routes.SUMMARY,
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: m.summary.pageTitle,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          description: m.summary.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          description: m.summary.pageDescriptionSecondparagraph,
          marginBottom: 6,
        }),
        // Property address
        buildOverviewField({
          id: 'rentalInfoOverview',
          title: m.summary.propertyInfoHeader,
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
          title: m.summary.propertyInfoHeader,
          items: rentalInfoOverview,
          backId: Routes.PROPERTYSEARCH,
        }),
        // Property registration
        buildOverviewField({
          id: 'propertyRegistrationOverview',
          title: m.registerProperty.category.pageTitle,
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
          title: m.summary.propertyConditionTitle,
          items: propertyConditionOverview,
          attachments: propertyConditionFilesOverview,
          backId: Routes.CONDITION,
        }),
        // Fire protections
        buildOverviewField({
          id: 'fireProtectionsOverview',
          title: m.summary.fireProtectionsTitle,
          items: fireProtectionsOverview,
          backId: Routes.FIREPROTECTIONS,
        }),
        // Rental period (start and end date)
        buildOverviewField({
          id: 'rentalPeriodOverview',
          title: m.summary.rentalPeriodDefiniteLabel,
          items: rentalPeriodOverview,
          backId: Routes.RENTALPERIOD,
        }),
        // Price
        buildOverviewField({
          id: 'priceOverview',
          title: m.summary.rentalAmountTitle,
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
          title: m.summary.otherCostsHeader,
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
