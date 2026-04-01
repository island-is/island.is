/**
 * Ported from: libs/portals/admin/regulations-admin/src/state/validations.ts
 *
 * Validation utilities for regulation fields within the OJOI application.
 * Adapted to work with application answers (JSONB) instead of the
 * regulations-admin DraftingState/dispatch pattern.
 *
 * Ministry is derived from the shared OJOI signature structure
 * (signature.regular.records[].institution), not from a separate
 * regulation.signatureText field.
 */
import { MinistryList } from '@island.is/regulations'
import { RegulationImpactSchema } from '../lib/dataSchema'
import { Routes } from '../lib/constants'

// ---------------------------------------------------------------------------

/** Shape of the OJOI structured signature in answers */
type SignatureAnswers = {
  regular?: {
    records?: Array<{
      institution?: string
      signatureDate?: string
    }>
  }
  committee?: {
    records?: Array<{
      institution?: string
      signatureDate?: string
    }>
  }
}

/**
 * Extracts the ministry (institution) from the shared OJOI signature records.
 * Uses the first regular signature record's institution field.
 */
export const getMinistryFromSignature = (
  signature?: SignatureAnswers,
  ministries?: MinistryList,
): {
  ministryName: string | undefined
  signatureDate: string | undefined
  ministryError: string | undefined
} => {
  const records = signature?.regular?.records ?? signature?.committee?.records
  const firstRecord = records?.[0]
  const institution = firstRecord?.institution
  const signatureDate = firstRecord?.signatureDate

  if (!institution) {
    return {
      ministryName: undefined,
      signatureDate,
      ministryError: undefined,
    }
  }

  if (ministries) {
    const normalized = institution.toLowerCase().replace(/-/g, '')
    const knownMinistry = ministries.find(
      (m) => m.name.toLowerCase().replace(/-/g, '') === normalized,
    )

    if (!knownMinistry) {
      return {
        ministryName: institution,
        signatureDate,
        ministryError: 'Nafn ráðuneytis er óþekkt',
      }
    }

    return {
      ministryName: knownMinistry.name,
      signatureDate,
      ministryError: undefined,
    }
  }

  return {
    ministryName: institution,
    signatureDate,
    ministryError: undefined,
  }
}

// ---------------------------------------------------------------------------

export type RegulationWarning = {
  field: string
  message: string
  section?: string
  route?: string
  sectionLabel?: string
}

/**
 * Collects validation warnings for the regulation form.
 * Works against application answers directly.
 * Ministry is derived from the shared signature.institution field.
 */
export const collectRegulationWarnings = (answers: {
  advert?: {
    department?: { title: string } | null
    type?: { title: string } | null
    title?: string
    html?: string
    requestedDate?: string
    channels?: Array<{ name?: string; email?: string; phone?: string }>
  }
  signature?: SignatureAnswers
  regulation?: {
    effectiveDate?: string
    lawChapters?: Array<{ slug: string; name: string }>
    impacts?: RegulationImpactSchema[]
  }
  applicationType?: string
}): RegulationWarning[] => {
  const warnings: RegulationWarning[] = []

  // Content section
  if (!answers.advert?.department) {
    warnings.push({
      field: 'department',
      message: 'Deild vantar',
      section: 'content',
      route: Routes.REGULATION_CONTENT,
      sectionLabel: 'Grunnupplýsingar',
    })
  }

  if (!answers.advert?.type) {
    warnings.push({
      field: 'type',
      message: 'Tegund vantar',
      section: 'content',
      route: Routes.REGULATION_CONTENT,
      sectionLabel: 'Grunnupplýsingar',
    })
  }

  if (!answers.advert?.title) {
    warnings.push({
      field: 'title',
      message: 'Titill vantar',
      section: 'content',
      route: Routes.REGULATION_CONTENT,
      sectionLabel: 'Grunnupplýsingar',
    })
  }

  if (!answers.advert?.html) {
    warnings.push({
      field: 'html',
      message: 'Texti vantar',
      section: 'content',
      route: Routes.REGULATION_CONTENT,
      sectionLabel: 'Grunnupplýsingar',
    })
  }

  // Signature / ministry
  const { ministryName } = getMinistryFromSignature(answers.signature)
  if (!ministryName) {
    warnings.push({
      field: 'signature.institution',
      message: 'Ráðuneyti vantar (stofnun í undirritun)',
      section: 'signature',
      route: Routes.REGULATION_CONTENT,
      sectionLabel: 'Grunnupplýsingar',
    })
  }

  // Meta section
  if (!answers.regulation?.effectiveDate) {
    warnings.push({
      field: 'effectiveDate',
      message: 'Gildistökudagur vantar',
      section: 'meta',
      route: Routes.REGULATION_META,
      sectionLabel: 'Lýsigögn',
    })
  }

  if (
    !answers.regulation?.lawChapters ||
    answers.regulation.lawChapters.length === 0
  ) {
    warnings.push({
      field: 'lawChapters',
      message: 'Lagakafla vantar',
      section: 'meta',
      route: Routes.REGULATION_META,
      sectionLabel: 'Lýsigögn',
    })
  }

  // Publishing section
  if (!answers.advert?.requestedDate) {
    warnings.push({
      field: 'requestedDate',
      message: 'Birtingadag vantar',
      section: 'publishing',
      route: Routes.REGULATION_PUBLISHING,
      sectionLabel: 'Óskir um birtingu',
    })
  }

  if (!answers.advert?.channels || answers.advert.channels.length === 0) {
    warnings.push({
      field: 'channels',
      message: 'Samskiptaleið vantar',
      section: 'publishing',
      route: Routes.REGULATION_PUBLISHING,
      sectionLabel: 'Óskir um birtingu',
    })
  }

  // Impacts section (for amending regulations)
  if (answers.applicationType === 'amending_regulation') {
    if (
      !answers.regulation?.impacts ||
      answers.regulation.impacts.length === 0
    ) {
      warnings.push({
        field: 'impacts',
        message:
          'Breytingareglugerð verður í það minnsta að fella eina reglugerð úr gildi eða breyta ákvæðum hennar.',
        section: 'impacts',
        route: Routes.REGULATION_IMPACTS,
        sectionLabel: 'Áhrif',
      })
    }
  }

  // Validate individual impacts
  if (answers.regulation?.impacts) {
    answers.regulation.impacts.forEach((impact, index) => {
      if (!impact.date) {
        warnings.push({
          field: `impacts[${index}].date`,
          message: `Dagsetningu vantar í áhrifafærslu ${index + 1}`,
          section: 'impacts',
          route: Routes.REGULATION_IMPACTS,
          sectionLabel: 'Áhrif',
        })
      }

      if (impact.type === 'amend') {
        if (!impact.title) {
          warnings.push({
            field: `impacts[${index}].title`,
            message: `Titil vantar í breytingu ${index + 1}`,
            section: 'impacts',
            route: Routes.REGULATION_IMPACTS,
            sectionLabel: 'Áhrif',
          })
        }
        if (!impact.text) {
          warnings.push({
            field: `impacts[${index}].text`,
            message: `Texti vantar í breytingu ${index + 1}`,
            section: 'impacts',
            route: Routes.REGULATION_IMPACTS,
            sectionLabel: 'Áhrif',
          })
        }
      }
    })
  }

  return warnings
}
