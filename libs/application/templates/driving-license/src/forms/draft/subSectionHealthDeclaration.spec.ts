import { ExternalData, FormValue } from '@island.is/application/types'
import { subSectionHealthDeclaration } from './subSectionHealthDeclaration'
import { B_FULL, B_FULL_RENEWAL_65, B_TEMP, BE } from '../../lib/constants'

/**
 * The health-declaration sub-section holds four sibling multifields whose
 * conditions must stay mutually exclusive: they all write the same
 * `healthCertificate` answer, so two visible at once would be a real bug.
 *
 * This spec pins:
 *   - exactly one block visible per product / flag combination,
 *   - the redesigned B-temp/B-full block matching BE's rules (upload appears
 *     only once a health condition triggers it),
 *   - the legacy and BE blocks' form-node ids being unchanged, so in-flight
 *     drafts are unaffected by the shared-builder extraction.
 */

type Node = {
  id?: string
  children?: Node[]
  condition?: unknown
}

const blocks = (subSectionHealthDeclaration as unknown as { children: Node[] })
  .children

const blockById = (id: string): Node => {
  const found = blocks.find((c) => c.id === id)
  if (!found) {
    throw new Error(`no block with id ${id}`)
  }
  return found
}

// A missing condition yields `undefined`, which is falsy — so assert with
// toBe(true)/toBe(false) rather than toBeTruthy/toBeFalsy, or a forgotten
// condition would read as "hidden" and pass vacuously.
const isShown = (
  block: Node,
  answers: FormValue,
  externalData: ExternalData = {} as ExternalData,
): boolean => {
  const { condition } = block
  if (typeof condition !== 'function') {
    throw new Error(`block ${block.id} has no dynamic condition`)
  }
  return (condition as (a: FormValue, e: ExternalData) => boolean)(
    answers,
    externalData,
  )
}

const collectIds = (node: Node): string[] => {
  const here = node.id ? [node.id] : []
  const kids = Array.isArray(node.children)
    ? node.children.flatMap(collectIds)
    : []
  return [...here, ...kids]
}

const LEGACY = 'overview'
const REDESIGNED = 'overviewWithHealthCertificate'
const BE_BLOCK = 'overviewBE'

describe('subSectionHealthDeclaration', () => {
  describe('exactly one block is visible per product and flag combination', () => {
    it.each([
      // product, flags, the block that should show
      [B_TEMP, {}, LEGACY],
      [B_TEMP, { isBTempRedesignEnabled: true }, REDESIGNED],
      [B_TEMP, { isBTempRedesignEnabled: false }, LEGACY],
      [B_FULL, {}, LEGACY],
      [B_FULL, { isBFullRedesignEnabled: true }, REDESIGNED],
      [B_FULL, { isBFullRedesignEnabled: false }, LEGACY],
      [BE, {}, BE_BLOCK],
      [BE, { isBTempRedesignEnabled: true }, BE_BLOCK],
    ])('%s with %p shows %s', (applicationFor, flags, expected) => {
      const answers = { applicationFor, ...flags } as FormValue
      const shown = [LEGACY, REDESIGNED, BE_BLOCK].filter((id) =>
        isShown(blockById(id), answers),
      )
      expect(shown).toEqual([expected])
    })

    it('does not show either B block for 65+, regardless of flags', () => {
      const answers = {
        applicationFor: B_FULL_RENEWAL_65,
        isBTempRedesignEnabled: true,
        isBFullRedesignEnabled: true,
      } as FormValue

      expect(isShown(blockById(LEGACY), answers)).toBe(false)
      expect(isShown(blockById(REDESIGNED), answers)).toBe(false)
    })

    it('does not cross the flags between products', () => {
      // B-temp with only the B-full flag on must stay legacy — the copy-paste
      // error this predicate invites.
      expect(
        isShown(blockById(REDESIGNED), {
          applicationFor: B_TEMP,
          isBFullRedesignEnabled: true,
        } as FormValue),
      ).toBe(false)

      expect(
        isShown(blockById(REDESIGNED), {
          applicationFor: B_FULL,
          isBTempRedesignEnabled: true,
        } as FormValue),
      ).toBe(false)
    })
  })

  describe('the redesigned block follows BE rules for the certificate upload', () => {
    const upload = (blockId: string) => {
      const found = blockById(blockId).children?.find(
        (c) => c.id === 'healthCertificate',
      )
      if (!found) {
        throw new Error(`no healthCertificate upload in ${blockId}`)
      }
      return found
    }

    it.each([REDESIGNED, BE_BLOCK])(
      '%s hides the upload when nothing triggers a certificate',
      (blockId) => {
        expect(
          isShown(upload(blockId), {
            healthDeclaration: { hasEpilepsy: 'no' },
          } as unknown as FormValue),
        ).toBe(false)
      },
    )

    it.each([REDESIGNED, BE_BLOCK])(
      '%s shows the upload when a health answer is yes',
      (blockId) => {
        expect(
          isShown(upload(blockId), {
            healthDeclaration: { hasEpilepsy: 'yes' },
          } as unknown as FormValue),
        ).toBe(true)
      },
    )

    it.each([REDESIGNED, BE_BLOCK])(
      '%s shows the upload when a health remark is present',
      (blockId) => {
        expect(
          isShown(upload(blockId), {
            hasHealthRemarks: 'yes',
          } as unknown as FormValue),
        ).toBe(true)
      },
    )

    it.each([REDESIGNED, BE_BLOCK])(
      '%s shows the upload when the glasses check fires',
      (blockId) => {
        expect(
          isShown(
            upload(blockId),
            {} as FormValue,
            {
              glassesCheck: { data: true },
            } as unknown as ExternalData,
          ),
        ).toBe(true)
      },
    )

    it('declares the hasHealthRemarks hidden input, without which the gate cannot see remarks', () => {
      // HealthRemarks writes this answer via setValue, and multifield extraction
      // persists only ids that have a declared field.
      expect(collectIds(blockById(REDESIGNED))).toContain('hasHealthRemarks')
      expect(collectIds(blockById(BE_BLOCK))).toContain('hasHealthRemarks')
    })

    it('keeps the hidden input out of the legacy block', () => {
      // Adding it there would flip `remarks` in the submission service from
      // always-false to true for remark-holders, changing the LEGACY payload.
      expect(collectIds(blockById(LEGACY))).not.toContain('hasHealthRemarks')
    })
  })

  describe('form-node ids are unchanged for the pre-existing blocks', () => {
    it('legacy B-temp/B-full block', () => {
      expect(collectIds(blockById(LEGACY))).toEqual([
        'overview',
        'healthDeclarationDescription',
        'remarks',
        'healthDeclaration.usesContactGlasses',
        'healthDeclaration.hasReducedPeripheralVision',
        'healthDeclaration.hasEpilepsy',
        'healthDeclaration.hasHeartDisease',
        'healthDeclaration.hasMentalIllness',
        'healthDeclaration.usesMedicalDrugs',
        'healthDeclaration.isAlcoholic',
        'healthDeclaration.hasDiabetes',
        'healthDeclaration.isDisabled',
        'healthDeclaration.hasOtherDiseases',
        'healthDeclaration.contactGlassesMismatch',
      ])
    })

    it('BE block', () => {
      expect(collectIds(blockById(BE_BLOCK))).toEqual([
        'overviewBE',
        'healthDeclarationDescriptionBE',
        'remarksBE',
        'hasHealthRemarks',
        'healthDeclaration.usesContactGlasses',
        'healthDeclaration.hasReducedPeripheralVision',
        'healthDeclaration.hasEpilepsy',
        'healthDeclaration.hasHeartDisease',
        'healthDeclaration.hasMentalIllness',
        'healthDeclaration.usesMedicalDrugs',
        'healthDeclaration.isAlcoholic',
        'healthDeclaration.hasDiabetes',
        'healthDeclaration.isDisabled',
        'healthDeclaration.hasOtherDiseases',
        'healthDeclaration.contactGlassesMismatch',
        'healthCertificateDescriptionBE',
        'healthCertificate',
      ])
    })
  })
})
