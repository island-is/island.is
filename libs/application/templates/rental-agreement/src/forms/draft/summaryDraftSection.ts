import {
  buildDescriptionField,
  buildHiddenInput,
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
        // Húsnæði
        buildOverviewField({
          id: 'rentalInfoOverview',
          title: summary.propertyInfoHeader,
          items: rentalPropertyOverview,
          backId: Routes.REGISTERPROPERTY,
        }),
        // // Leigusalar
        buildOverviewField({
          id: 'landlordOverview',
          title: singularOrPluralLandlordsTitle,
          items: landlordOverview,
          backId: Routes.PARTIESINFORMATION,
        }),
        // // Umboðsaðili leigusala
        buildOverviewField({
          id: 'landlordRepresentativeOverview',
          condition: shouldShowRepresentative,
          title: singularOrPluralRepresentativeTitle,
          items: landlordRepresentativeOverview,
          backId: Routes.PROPERTYINFORMATION,
        }),
        // // Leigjendur
        buildOverviewField({
          id: 'tenantOverview',
          title: singularOrPluralTenantsTitle,
          items: tenantOverview,
          backId: Routes.PARTIESINFORMATION,
        }),
        // // Leiguhúsnæðið
        buildOverviewField({
          id: 'rentalInfoOverview',
          title: summary.propertyInfoHeader,
          items: rentalInfoOverview,
          backId: Routes.RENTALPERIOD,
        }),
        // // Skráning húsnæðis
        buildOverviewField({
          id: 'propertyRegistrationOverview',
          title: m.registerProperty.category.pageTitle,
          items: propertyRegistrationOverview,
          backId: Routes.REGISTERPROPERTY,
        }),
        // // Nánari lýsing og sérákvæði
        buildOverviewField({
          id: 'specialProvisionsOverview',
          title: m.specialProvisions.subsection.pageTitle,
          items: specialProvisionsOverview,
          backId: Routes.SPECIALPROVISIONS,
        }),
        // // Ástand húsnæðis
        buildOverviewField({
          id: 'propertyConditionOverview',
          title: summary.propertyConditionTitle,
          items: propertyConditionOverview,
          attachments: propertyConditionFilesOverview,
          backId: Routes.CONDITION,
        }),
        // // Brunavarnir
        buildOverviewField({
          id: 'fireProtectionsOverview',
          title: summary.fireProtectionsTitle,
          items: fireProtectionsOverview,
          backId: Routes.FIREPROTECTIONS,
        }),
        // Verð
        buildOverviewField({
          id: 'priceOverview',
          title: summary.rentalAmountTitle,
          items: priceOverview,
          backId: Routes.RENTALAMOUNT,
        }),
        // Tímabil
        buildOverviewField({
          id: 'rentalPeriodOverview',
          title: summary.rentalPeriodDefiniteLabel,
          items: rentalPeriodOverview,
          backId: Routes.RENTALPERIOD,
        }),
        // Trygging
        buildOverviewField({
          id: 'depositOverview',
          condition: securityDepositRequired,
          title: summary.securityDepositLabel,
          items: depositOverview,
          backId: Routes.SECURITYDEPOSIT,
        }),
        // Önnur gjöld
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
        buildHiddenInput({
          id: 'htmlSummary',
          defaultValue: () => {
            // Get email summary html
            const element = document.getElementById('email-summary-container')

            if (!element) {
              return null
            }

            // Create a clone of the element to avoid modifying the visible DOM
            const elementClone = element.cloneNode(true) as HTMLElement

            // Remove buttons from the cloned element only
            elementClone
              .querySelectorAll('button')
              .forEach((button) => button.remove())

            const jsonData = {
              id: element.id,
              className: element.className,
              html: elementClone.outerHTML,
            }
            return JSON.stringify(jsonData)
          },
        }),
      ],
    }),
  ],
})
