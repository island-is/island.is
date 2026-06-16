import {
  expr,
  FormBuilder,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  FormModes,
  FormText,
} from '@island.is/application/types'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { Fasteign } from '@island.is/clients/assets'
import { HmsPropertyInfo } from '@island.is/api/schema'

import { dataSchema } from '../../lib/dataSchema'
import * as m from '../../lib/messages'
import {
  SearchPropertiesApi,
  FetchPropertiesByCodeApi,
} from '../../dataProviders'
import { notkunareiningarOptions } from '../../utils/notkunareiningarUtils'
import {
  sumUsageUnitsFireCompensation,
  totalFireCompensation,
  usageUnitsFireCompensationClientExpression,
} from '../../utils/sumUtils'
import { getAmountToPay } from '../../utils/utils'
import { isApplyingForOtherProperty } from '../../utils/propertyUtils'
import {
  personalInformationOverviewItems,
  realEstateOverviewItems,
  photoOverviewItems,
  changesOverviewItems,
} from '../../utils/getOverviewItems'

// Owned-property select options (applicant's own properties fetched at prereq).
const ownedPropertyOptions = (application: Application) => {
  const properties = getValueViaPath<Array<Fasteign>>(
    application.externalData,
    'getProperties.data',
  )

  return (
    properties?.map((property) => ({
      label: `(${property.fasteignanumer}) ${property?.sjalfgefidStadfang?.birting} `,
      value: property.fasteignanumer ?? '',
    })) ?? []
  )
}

// Replaces the legacy `PropertySearch` custom component: address-search results
// come back from the `searchProperties` template API and live in externalData.
const addressSearchOptions = (application: Application) => {
  const options = getValueViaPath<Array<{ label: string; value: string }>>(
    application.externalData,
    'searchProperties.data.options',
  )
  return options ?? []
}

// Property-code options for the selected address (from the search results).
const propertyByCodeOptions = (application: Application) => {
  const properties = getValueViaPath<Array<HmsPropertyInfo>>(
    application.externalData,
    'searchProperties.data.propertiesByAddressCode',
  )
  return (
    properties?.map((property) => ({
      label: `(${property.propertyCode?.toString()}) ${property.address}`,
      value: property.propertyCode?.toString() ?? '',
    })) ?? []
  )
}

const showOwnedProperty = (answers: Application['answers']) =>
  !isApplyingForOtherProperty(answers)

const showOtherProperty = (answers: Application['answers']) =>
  isApplyingForOtherProperty(answers)

// The usage-unit checkbox + appraisal display fields are revealed once a
// property is selected. This is a same-page reveal driven purely by an answer,
// so it must use `clientShowWhen` (instant, client-side) — a server `showWhen`
// would keep the fields out of the screen payload until a new screen is fetched,
// which is why they previously only appeared after navigating away and back.
const usageUnitsClientShowWhen = expr.or(
  expr.isNotEmpty('realEstate'),
  expr.isNotEmpty('selectedPropertyByCode'),
)

export const MainForm = new FormBuilder<typeof dataSchema>('MainForm', '', {
  mode: FormModes.DRAFT,
  logo: HmsLogo,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
})
  // Personal information
  .addSection('personalInformationSection', m.personalInformationMessages.title, (section) => {
    const applicantPage = applicantInformationMultiField({
      postalCodeRequired: false,
      cityRequired: false,
    })
    section.addPage(
      applicantPage.id ?? 'applicant',
      (applicantPage.title ?? '') as FormText,
      (page) => {
        page.setDescription(applicantPage.description).addFields(applicantPage.children)
      },
    )
  })
  // Real estate (owned property)
  .addSection('realEstateSection', m.realEstateMessages.title, (section) => {
    section.addPage(
      'realEstate',
      m.realEstateMessages.multifieldTitle,
      (page) => {
        page
          .setDescription(m.realEstateMessages.description)
          .addSelectField('realEstate', 'Fasteign', {
            options: ownedPropertyOptions,
            // The property detail (incl. notkunareiningar) is already in
            // `getProperties.data`, so no template API needs to run — but the
            // checkbox `options` below are resolved server-side and must be
            // rebuilt against the newly selected property. `refetchTargets`
            // triggers that screen-rebuild round-trip without re-fetching data.
            refetchTargets: ['usageUnits'],
            clearOnChange: ['usageUnits'],
            marginBottom: 4,
          })
          .addCheckboxField('usageUnits', m.realEstateMessages.usageUnit, {
            clientShowWhen: usageUnitsClientShowWhen,
            description: m.realEstateMessages.usageUnitDescription,
            options: notkunareiningarOptions,
          })
          .addDisplayField(
            'usageUnitsFireCompensation',
            '',
            sumUsageUnitsFireCompensation,
            {
              clientShowWhen: usageUnitsClientShowWhen,
              clientValueExpression: usageUnitsFireCompensationClientExpression,
              label: m.realEstateMessages.usageUnitsFireCompensation,
              variant: 'currency',
              rightAlign: true,
            },
          )
          .addDisplayField(
            'totalFireCompensation',
            '',
            totalFireCompensation,
            {
              clientShowWhen: usageUnitsClientShowWhen,
              label: m.realEstateMessages.totalFireCompensation,
              variant: 'currency',
              rightAlign: true,
            },
          )
      },
      { showWhen: showOwnedProperty },
    )
  })
  // Real estate search (applying for a property the applicant does not own).
  // Dormant until `otherPropertiesThanIOwnCheckbox` is re-enabled in the
  // prerequisites form, mirroring the legacy app.
  .addSection('realEstateSearchSection', m.realEstateMessages.title, (section) => {
    section.addPage(
      'realEstateSearch',
      m.realEstateMessages.multifieldTitle,
      (page) => {
        page
          .setDescription(m.realEstateMessages.description)
          .addSearchField('anyonesProperty', '', {
            searchAction: SearchPropertiesApi.action,
            options: addressSearchOptions,
            minQueryLength: 3,
          })
          .addSelectField('selectedPropertyByCode', m.realEstateMessages.units, {
            options: propertyByCodeOptions,
            onSelectRefetch: [FetchPropertiesByCodeApi.action],
            refetchTargets: ['usageUnits'],
            clearOnChange: ['usageUnits'],
            marginBottom: 4,
          })
          .addCheckboxField('usageUnits', m.realEstateMessages.usageUnit, {
            clientShowWhen: usageUnitsClientShowWhen,
            description: m.realEstateMessages.usageUnitDescription,
            options: notkunareiningarOptions,
          })
          .addDisplayField(
            'usageUnitsFireCompensation',
            '',
            sumUsageUnitsFireCompensation,
            {
              clientShowWhen: usageUnitsClientShowWhen,
              clientValueExpression: usageUnitsFireCompensationClientExpression,
              label: m.realEstateMessages.usageUnitsFireCompensation,
              variant: 'currency',
              rightAlign: true,
            },
          )
          .addDisplayField(
            'totalFireCompensation',
            '',
            totalFireCompensation,
            {
              clientShowWhen: usageUnitsClientShowWhen,
              label: m.realEstateMessages.totalFireCompensation,
              variant: 'currency',
              rightAlign: true,
            },
          )
      },
      { showWhen: showOtherProperty },
    )
  })
  // Changes / appraisal method
  .addSection('appraisalMethodSection', m.changesMessages.title, (section) => {
    section.addPage('appraisalMethod', m.changesMessages.title, (page) => {
      page
        .setDescription(m.changesMessages.description)
        .addCheckboxField('appraisalMethod', m.changesMessages.appraisalMethod, {
          width: 'half',
          options: [
            {
              label: m.changesMessages.becauseOfRenovations,
              value: 'renovations',
            },
            {
              label: m.changesMessages.becauseOfAdditions,
              value: 'additions',
            },
          ],
        })
        .addDescriptionField(
          'descriptionDescription',
          m.changesMessages.descriptionOfChanges,
          { titleVariant: 'h4' },
        )
        .addTextField('description', '', {
          placeholder: m.changesMessages.textAreaPlaceholder,
          variant: 'textarea',
          rows: 14,
        })
    })
  })
  // Photos
  .addSection('photoSection', m.photoMessages.title, (section) => {
    section.addPage('photoMultiField', m.photoMessages.title, (page) => {
      page
        .setDescription(m.photoMessages.description)
        .addFileUploadField('photos', '', {
          uploadMultiple: true,
          maxSize: 10 * 1000 * 1000, // 10MB
          totalMaxSize: 100 * 1000 * 1000, // 100MB
          maxFileCount: 20,
        })
    })
  })
  // Overview
  .addSection('overviewSection', m.overviewMessages.title, (section) => {
    section.addPage('overviewSection', m.overviewMessages.title, (page) => {
      page
        .setDescription(m.overviewMessages.description)
        .addOverviewField(
          'personalInformationOverview',
          m.personalInformationMessages.title,
          {
            backId: 'applicant',
            items: personalInformationOverviewItems,
          },
        )
        .addOverviewField('realEstateOverview', m.realEstateMessages.title, {
          backId: 'realEstate',
          items: realEstateOverviewItems,
        })
        .addOverviewField('photoOverview', m.photoMessages.title, {
          backId: 'photoMultiField',
          attachments: photoOverviewItems,
        })
        .addOverviewField('changesOverview', m.changesMessages.title, {
          backId: 'appraisalMethod',
          items: changesOverviewItems,
        })
        .addDividerField()
        .addDisplayField('amountToPay', m.overviewMessages.amountToPay, getAmountToPay, {
          titleVariant: 'h3',
          rightAlign: true,
          variant: 'currency',
        })
      // The "Greiða" call-to-action is rendered by the screen footer from the
      // DRAFT state's role action (event: PAYMENT) — see `buildFooter` /
      // `footer-builder`. An inline `addSubmitField` here would render a second,
      // dead button (SdfSubmitField has no dispatch), so it is intentionally
      // omitted (mirrors the SDF footer convention).
    })
  })
  .build()
