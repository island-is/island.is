import { normalizePastedHtml } from './richTextNormalization'
import {
  DOWNLEVEL_CONDITIONAL_LIST,
  FLAT_BULLET_LIST,
  FORMATTED_LIST_ITEM,
  INDENTED_PARAGRAPH,
  LETTERED_LIST,
  LIST_SPLIT_BY_PARAGRAPH,
  MERGE_FORMATTING_LIST,
  NESTED_LIST,
  NUMBERED_LIST,
  REAL_LIST_PASSTHROUGH,
  ROMAN_LIST,
  SKIPPED_LEVEL_LIST,
  TWO_ADJACENT_LISTS,
} from './wordPasteFixtures'

describe('normalizePastedHtml — Word fake lists', () => {
  it('converts a flat bullet list to a ul', () => {
    expect(normalizePastedHtml(FLAT_BULLET_LIST)).toBe(
      '<ul><li>Fyrsti punktur</li><li>Annar punktur</li></ul>',
    )
  })

  it('converts a numbered list to an ol', () => {
    expect(normalizePastedHtml(NUMBERED_LIST)).toBe(
      '<ol><li>Fyrsta atriði</li><li>Annað atriði</li></ol>',
    )
  })

  it('converts a lettered list to an ol', () => {
    expect(normalizePastedHtml(LETTERED_LIST)).toBe(
      '<ol><li>Fyrsta</li><li>Annað</li></ol>',
    )
  })

  it('converts a roman-numeral list to an ol', () => {
    expect(normalizePastedHtml(ROMAN_LIST)).toBe(
      '<ol><li>Fyrsta</li><li>Annað</li></ol>',
    )
  })

  it('nests a level-2 item inside the level-1 item before it', () => {
    expect(normalizePastedHtml(NESTED_LIST)).toBe(
      '<ul><li>Efst<ul><li>Undirliður</li></ul></li><li>Aftur efst</li></ul>',
    )
  })

  it('bridges skipped levels with marker-none wrapper items', () => {
    expect(normalizePastedHtml(SKIPPED_LEVEL_LIST)).toBe(
      '<ul><li>Efst<ul><li class="marker-none"><ul><li>Djúpt</li></ul></li></ul></li></ul>',
    )
  })

  it('keeps lists with different list ids separate', () => {
    expect(normalizePastedHtml(TWO_ADJACENT_LISTS)).toBe(
      '<ol><li>Fyrri listi</li></ol><ol><li>Seinni listi</li></ol>',
    )
  })

  it('splits a list at a plain paragraph between its items', () => {
    expect(normalizePastedHtml(LIST_SPLIT_BY_PARAGRAPH)).toBe(
      '<ol><li>Fyrir</li></ol><p>Millitexti</p><ol><li>Eftir</li></ol>',
    )
  })

  it('normalizes highlight and bold inside an item', () => {
    const result = normalizePastedHtml(FORMATTED_LIST_ITEM)
    expect(result).toBe(
      '<ol><li><span class="hl-ffff00">merkt</span> og <b>feitletrað</b></li></ol>',
    )
  })

  it('falls back on the literal marker for merge-formatting pastes', () => {
    expect(normalizePastedHtml(MERGE_FORMATTING_LIST)).toBe(
      '<ol><li>Fyrsta atriði</li><li>Annað atriði</li></ol>',
    )
  })

  it('handles the downlevel-revealed conditional comment form', () => {
    expect(normalizePastedHtml(DOWNLEVEL_CONDITIONAL_LIST)).toBe(
      '<ol><li>Atriði</li></ol>',
    )
  })

  it('passes real list markup through unchanged', () => {
    expect(normalizePastedHtml(REAL_LIST_PASSTHROUGH)).toBe(
      REAL_LIST_PASSTHROUGH,
    )
  })

  it('is idempotent, so re-pasting converted content is a no-op', () => {
    const once = normalizePastedHtml(NESTED_LIST)
    expect(normalizePastedHtml(once)).toBe(once)
  })
})

describe('normalizePastedHtml — Word artifacts', () => {
  it('strips style blocks, comments and namespaced elements', () => {
    const result = normalizePastedHtml(FLAT_BULLET_LIST)
    expect(result).not.toContain('MsoListParagraph {')
    expect(result).not.toContain('<!--')
    expect(result).not.toContain('o:p')
  })

  it('never leaves a style attribute in the output', () => {
    for (const fixture of [
      FLAT_BULLET_LIST,
      NESTED_LIST,
      FORMATTED_LIST_ITEM,
      INDENTED_PARAGRAPH,
    ]) {
      expect(normalizePastedHtml(fixture)).not.toContain('style=')
    }
  })

  it('still converts indented plain paragraphs to indent classes', () => {
    expect(normalizePastedHtml(INDENTED_PARAGRAPH)).toBe(
      '<p class="indent-1">Inndregið</p>',
    )
  })
})
