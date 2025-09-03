import {
  buildDescriptionField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { Routes } from '../../utils/enums'
import { summary, application } from '../../lib/messages'
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
  title: summary.sectionName,
  children: [
    buildMultiField({
      id: Routes.SUMMARY,
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: summary.pageTitle,
          marginBottom: 2,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          description: summary.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          description: summary.pageDescriptionSecondparagraph,
          marginBottom: 6,
        }),
        // Property address
        buildOverviewField({
          id: 'rentalInfoOverview',
          title: summary.propertyInfoHeader,
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
          title: summary.propertyInfoHeader,
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
          title: summary.propertyConditionTitle,
          items: propertyConditionOverview,
          attachments: propertyConditionFilesOverview,
          backId: Routes.CONDITION,
        }),
        // Fire protections
        buildOverviewField({
          id: 'fireProtectionsOverview',
          title: summary.fireProtectionsTitle,
          items: fireProtectionsOverview,
          backId: Routes.FIREPROTECTIONS,
        }),
        // Rental period (start and end date)
        buildOverviewField({
          id: 'rentalPeriodOverview',
          title: summary.rentalPeriodDefiniteLabel,
          items: rentalPeriodOverview,
          backId: Routes.RENTALPERIOD,
        }),
        // Price
        buildOverviewField({
          id: 'priceOverview',
          title: summary.rentalAmountTitle,
          items: priceOverview,
          backId: Routes.RENTALAMOUNT,
        }),
        // Security deposit
        buildOverviewField({
          id: 'depositOverview',
          condition: securityDepositRequired,
          title: summary.securityDepositLabel,
          items: depositOverview,
          backId: Routes.SECURITYDEPOSIT,
        }),
        // Other fees
        buildOverviewField({
          id: 'otherCostsOverview',
          title: summary.otherCostsHeader,
          items: otherCostsOverview,
          backId: Routes.OTHERFEES,
        }),
        buildSubmitField({
          id: 'toSummary',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: application.goToOverviewButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
