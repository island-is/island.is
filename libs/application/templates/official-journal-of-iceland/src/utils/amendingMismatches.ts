/**
 * Possible mismatches between the amending regulation's text, which is
 * published as written, and the changes recorded on the base regulations,
 * which are applied as recorded whatever the text says. A user who edits
 * an amount in one and not the other gets told before submitting.
 *
 * These are hints, not errors: prose can't be mapped back to a diff
 * reliably, so they never block submitting.
 */
import findAmendingMismatches, {
  type AmendedRegulation,
} from '@dmr.is/regulations-tools/amendingMismatches-browser'
import { HTMLText, prettyName, RegName } from '@island.is/regulations'
import { z } from 'zod'
import { additionSchema, RegulationImpactSchema } from '../lib/dataSchema'

/** Where a change is recorded: a base regulation, or one of its appendixes. */
export type MismatchPlace = {
  /** "123/2020" */
  regulation: string
  /** The appendix's title, for a change to an appendix. */
  appendix?: string
  /** The base section, "5. gr.", when known (old numbering). */
  section?: string
}

/** An amount or a date. `text` is as written where it was found. */
export type ValueMismatch =
  | {
      /** A base change brings it in, and the text never mentions it. */
      type: 'missingFromText'
      text: string
      place: MismatchPlace
    }
  | {
      /** The text states it, and no change of a base regulation holds it. */
      type: 'notInChanges'
      text: string
      /** The amending text's own article, "1. gr.", when it has one. */
      section?: string
    }

export type WordingMismatches = {
  place: MismatchPlace
  /** Wording a base change brings in that the text never mentions. */
  texts: string[]
}

export type AmendingMismatches = {
  /** Amounts and dates, both ways: the likeliest slips. */
  values: ValueMismatch[]
  /** Wording, grouped by base regulation and section. */
  wording: WordingMismatches[]
}

/** One of the advert's appendixes, content base64-encoded */
export type Addition = z.infer<typeof additionSchema>[number]

/**
 * An article of the text, "1. gr." or "6. gr. a.", rather than an
 * appendix's title, which may cite one ("Viðauki við 3. gr. …")
 */
const isArticle = (section?: string) =>
  !!section && /^\d+\.\s*gr\.(\s|$)/.test(section)

const decode = (base64?: string) =>
  Buffer.from(base64 ?? '', 'base64').toString('utf-8')

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * The amending regulation's text with its appendixes, as published. An
 * uploaded file can't be read, so only HTML appendixes count.
 */
const amendingHtml = (html?: string, additions?: Addition[]) =>
  [
    decode(html),
    ...(additions ?? [])
      .filter((a) => a.type !== 'file' && a.content)
      .map(
        (a) =>
          `<h2>${escapeHtml(a.title ?? 'Viðauki')}</h2>${decode(a.content)}`,
      ),
  ].join('') as HTMLText

export const getAmendingMismatches = ({
  html,
  additions,
  impacts,
}: {
  /** Base64-encoded advert HTML */
  html?: string
  /** The advert's appendixes, content base64-encoded */
  additions?: Addition[]
  impacts: RegulationImpactSchema[]
}): AmendingMismatches => {
  // Each change by a key the mismatches carry back as `regulation`
  const places = new Map<string, MismatchPlace>()
  const regulations: AmendedRegulation[] = []
  impacts.forEach((impact, i) => {
    if (impact.type !== 'amend') return
    const regulation = prettyName(impact.name as RegName)
    if (impact.diff) {
      places.set(`${i}`, { regulation })
      regulations.push({ name: `${i}`, diff: impact.diff as HTMLText })
    }
    // An appendix diff is only here in the session that made the change:
    // `useRegulationImpacts` saves appendixes without it. After a reload the
    // appendix's text stands in, counted as changed throughout, so amounts
    // in a replaced fee table are found there and not reported as missing
    // from the changes, but nothing in it is reported as missing from the
    // text. An impact holds every appendix of the base regulation, so an
    // amount in one left as it was can hide a slip in the text, and an
    // amount the text quotes as replaced in an appendix ("Í stað „kr. 1.200“
    // í viðauka …") is reported. Diffing appendixes awaits a decision from
    // the stakeholders. When appendix diffs are stored or rebuilt on load,
    // they reach this check as they are, with no change needed here.
    impact.appendixes?.forEach((apx, j) => {
      const changes = apx.diff || (!apx.revoked && apx.text)
      if (changes) {
        places.set(`${i}.${j}`, {
          regulation,
          appendix: apx.title || `Viðauki ${j + 1}`,
        })
        regulations.push({ name: `${i}.${j}`, diff: changes as HTMLText })
      }
    })
  })

  // A change with no diff can't be compared, so the text may state
  // anything it brings in
  const unknownChanges = impacts.some((i) => i.type === 'amend' && !i.diff)

  const text = amendingHtml(html, additions)
  if (!regulations.length || !text.trim()) {
    return { values: [], wording: [] }
  }

  const values: ValueMismatch[] = []
  const wording: WordingMismatches[] = []
  for (const m of findAmendingMismatches(text, regulations)) {
    if (m.type === 'notInChanges') {
      if (unknownChanges) continue
      values.push({
        type: m.type,
        text: m.text,
        section: isArticle(m.section) ? m.section : undefined,
      })
      continue
    }
    const base = m.regulation ? places.get(m.regulation) : undefined
    if (!base) continue
    // An appendix's sections are its own, so the appendix names the place
    const place: MismatchPlace = {
      ...base,
      section: base.appendix ? undefined : m.section,
    }
    if (m.kind !== 'wording') {
      values.push({ type: m.type, text: m.text, place })
      continue
    }
    const group = wording.find(
      (g) =>
        g.place.regulation === place.regulation &&
        g.place.appendix === place.appendix &&
        g.place.section === place.section,
    )
    if (group) {
      group.texts.push(m.text)
    } else {
      wording.push({ place, texts: [m.text] })
    }
  }
  // What the base brings in first, then what the text states
  values.sort(
    (a, b) =>
      Number(a.type === 'notInChanges') - Number(b.type === 'notInChanges'),
  )
  return { values, wording }
}
