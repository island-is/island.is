/**
 * A change to the words or sentences of one paragraph or list item, worded
 * as amending regulations do:
 *
 * - "Í stað orðanna „X“ í 2. mgr. 3. gr. reglugerðarinnar kemur: Y."
 * - "Orðin „X“ í 2. mgr. … falla brott."
 * - "Á eftir orðinu „W“ í 1. tölul. … kemur: Y."
 * - "Við 4. mgr. … bætast þrír nýir málsliðir, svohljóðandi: …"
 * - "2. málsl. 3. mgr. … fellur brott."
 *
 * Read from getStructuredDiff's marks, `<del class="diffmod">X</del><ins
 * class="diffmod">Y</ins>`, and from `data-diff-sentences`, which names the
 * sentences inserted or removed by their number in the base text. Only a
 * change in one place is worded this way; the caller restates the paragraph
 * or item otherwise.
 */
import { endsWithAbbreviation, escapeHtml } from './formatAmendingUtils'

/** The change, given where it is: "2. mgr. 3. gr. reglugerðarinnar" */
export type WordChange = (place: string) => string

type Kind = 'same' | 'del' | 'ins'
type Segment = { kind: Kind; text: string }

/** A word, or punctuation written against the word before it */
type Token = { text: string; glued: boolean }

const INLINE_TAGS = new Set(['em', 'strong', 'b', 'i', 'u', 'span', 'a'])

/** Masculine, as málsliður is */
const COUNT_WORDS = ['', 'einn', 'tveir', 'þrír', 'fjórir']
const countWord = (count: number) => COUNT_WORDS[count] ?? `${count}`

const joinWithOg = (items: string[]) =>
  items.length < 2
    ? items.join('')
    : `${items.slice(0, -1).join(', ')} og ${items[items.length - 1]}`

/**
 * The element's text as unchanged, deleted and inserted runs, or undefined
 * when it holds anything the wording can't name: a formatting change, a
 * nested list, a line break.
 */
const segmentsOf = (element: Element): Segment[] | undefined => {
  const segments: Segment[] = []
  let readable = true
  const walk = (node: Node, kind: Kind) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3) {
        const text = (child.textContent ?? '').replace(/\s+/g, ' ')
        const last = segments[segments.length - 1]
        if (last?.kind === kind) {
          last.text += text
        } else {
          segments.push({ kind, text })
        }
        return
      }
      if (child.nodeType !== 1) {
        return
      }
      const tag = child.nodeName.toLowerCase()
      if (tag === 'ins' || tag === 'del') {
        if (kind !== 'same' || (child as Element).classList.contains('mod')) {
          readable = false
          return
        }
        walk(child, tag)
      } else if (INLINE_TAGS.has(tag)) {
        walk(child, kind)
      } else {
        readable = false
      }
    })
  }
  walk(element, 'same')
  return readable ? segments : undefined
}

const tokenize = (text: string): Token[] =>
  text
    .split(' ')
    .filter(Boolean)
    .flatMap((word) => {
      const trailing: Token[] = []
      while (word.length > 1 && /[.,;:!?)]$/.test(word)) {
        trailing.unshift({ text: word.slice(-1), glued: true })
        word = word.slice(0, -1)
      }
      return [{ text: word, glued: false }, ...trailing]
    })

const detokenize = (tokens: Token[]) =>
  tokens.map((t, i) => (i > 0 && !t.glued ? ` ${t.text}` : t.text)).join('')

const sameToken = (a: Token, b: Token) =>
  a.text === b.text && a.glued === b.glued

const wordCount = (tokens: Token[]) => tokens.filter((t) => !t.glued).length

/** The last word with any punctuation against it: "skv." */
const lastWord = (tokens: Token[]) => {
  let start = tokens.length - 1
  while (start > 0 && tokens[start].glued) {
    start--
  }
  return detokenize(tokens.slice(start))
}

type SentenceOp = { type: string; old: number }

const sentenceOps = (element: Element): SentenceOp[] =>
  (element.getAttribute('data-diff-sentences') ?? '')
    .split(' ')
    .filter(Boolean)
    .map((op) => {
      const [type, old] = op.split(':')
      return { type, old: Number(old) }
    })

const allOfType = (ops: SentenceOp[], type: string) =>
  ops.length > 0 && ops.every((op) => op.type === type)

const quote = (tokens: Token[]) => `„${escapeHtml(detokenize(tokens))}“`

/** What replaces or follows, as the amendment's sentence ends with it */
const asEnd = (tokens: Token[]) => {
  const text = escapeHtml(detokenize(tokens))
  return text.endsWith('.') ? text : `${text}.`
}

const isNumber = (token: Token | undefined) =>
  !!token && !token.glued && /^\d[\d.,]*$/.test(token.text)

export const describeWordChange = (
  element: Element,
): WordChange | undefined => {
  const segments = segmentsOf(element)
  if (!segments) {
    return undefined
  }
  const changed = segments
    .map((segment, i) => (segment.kind === 'same' ? -1 : i))
    .filter((i) => i >= 0)
  if (changed.length === 0) {
    return undefined
  }
  // One place only: what lies between the marks is at most a space
  if (
    segments
      .slice(changed[0], changed[changed.length - 1] + 1)
      .some((s) => s.kind === 'same' && s.text.trim())
  ) {
    return undefined
  }

  // The change is what the two versions don't share at either end, word by
  // word: the marks can split "skv." or carry a period from one word to the
  // last ("undantekningum." → "undantekningum þ.m.t. … Íslands.").
  const join = (kinds: Kind[]) =>
    segments
      .filter((s) => kinds.includes(s.kind))
      .map((s) => s.text)
      .join('')
  const oldTokens = tokenize(join(['same', 'del']))
  const newTokens = tokenize(join(['same', 'ins']))
  let start = 0
  while (
    start < oldTokens.length &&
    start < newTokens.length &&
    sameToken(oldTokens[start], newTokens[start])
  ) {
    start++
  }
  let end = 0
  while (
    end < oldTokens.length - start &&
    end < newTokens.length - start &&
    sameToken(
      oldTokens[oldTokens.length - 1 - end],
      newTokens[newTokens.length - 1 - end],
    )
  ) {
    end++
  }
  const before = oldTokens.slice(0, start)
  let after = oldTokens.slice(oldTokens.length - end)
  let oldPart = oldTokens.slice(start, oldTokens.length - end)
  let newPart = newTokens.slice(start, newTokens.length - end)
  // Punctuation alone, "hópbifreiðar." → "hópbifreiðar,", is no words to
  // quote: the caller restates the text
  if (
    (oldPart.length && !wordCount(oldPart)) ||
    (newPart.length && !wordCount(newPart)) ||
    (!oldPart.length && !newPart.length)
  ) {
    return undefined
  }

  // "kr." or "gr." keeps its period: „500 kr.“, not „500 kr“. A number's
  // may end the sentence: „1. mars 2010“.
  const endsAbbreviated = (part: Token[]) => {
    const last = part[part.length - 1]
    return (
      !!last &&
      !last.glued &&
      !/^\d+$/.test(last.text) &&
      (endsWithAbbreviation(last.text) || last.text === 'kr')
    )
  }
  if (
    after[0]?.glued &&
    after[0].text === '.' &&
    (endsAbbreviated(oldPart) || endsAbbreviated(newPart))
  ) {
    oldPart = oldPart.length ? [...oldPart, after[0]] : oldPart
    newPart = newPart.length ? [...newPart, after[0]] : newPart
    after = after.slice(1)
  }
  // An amount is cited with its unit: „3.100 kr.“
  if (
    oldPart.length === 1 &&
    newPart.length === 1 &&
    isNumber(oldPart[0]) &&
    isNumber(newPart[0]) &&
    after[0]?.text === 'kr' &&
    after[1]?.text === '.'
  ) {
    oldPart = [...oldPart, ...after.slice(0, 2)]
    newPart = [...newPart, ...after.slice(0, 2)]
    after = after.slice(2)
  }
  // Words removed from the start of a sentence, the next one now
  // capitalised: „Rekstrarleyfishafi eða eftir atvikum“ falla brott.
  const lastOld = oldPart[oldPart.length - 1]
  if (
    newPart.length === 1 &&
    oldPart.length > 1 &&
    lastOld.text.toLowerCase() === newPart[0].text.toLowerCase() &&
    lastOld.text !== newPart[0].text
  ) {
    oldPart = oldPart.slice(0, -1)
    newPart = []
  }

  const ops = sentenceOps(element)
  const unchanged = wordCount(before) + wordCount(after)

  if (!oldPart.length) {
    if (allOfType(ops, 'insert') && ops.every((op) => op.old === ops[0].old)) {
      const count = ops.length
      const what =
        count === 1 ? 'nýr málsliður' : `${countWord(count)} nýir málsliðir`
      const text = escapeHtml(detokenize(newPart))
      if (!after.length) {
        return (place) =>
          `Við ${place} ${
            count === 1 ? 'bætist' : 'bætast'
          } ${what}, svohljóðandi: ${text}`
      }
      const position =
        ops[0].old > 0 ? `Á eftir ${ops[0].old}. málsl.` : 'Á undan 1. málsl.'
      return (place) =>
        `${position} ${place} ${
          count === 1 ? 'kemur' : 'koma'
        } ${what}, svohljóðandi: ${text}`
    }
    if (!before.length) {
      return undefined
    }
    const word = quote(tokenize(lastWord(before)))
    return (place) =>
      `Á eftir orðinu ${word} í ${place} kemur: ${asEnd(newPart)}`
  }

  if (!newPart.length && allOfType(ops, 'delete')) {
    const numbers = joinWithOg(ops.map((op) => `${op.old}.`))
    return (place) =>
      `${numbers} málsl. ${place} ${ops.length > 1 ? 'falla' : 'fellur'} brott.`
  }

  // Most of the text changed: the caller restates it instead
  if (wordCount(oldPart) > unchanged) {
    return undefined
  }

  const one = wordCount(oldPart) === 1
  if (!newPart.length) {
    return (place) =>
      `${one ? 'Orðið' : 'Orðin'} ${quote(oldPart)} í ${place} ${
        one ? 'fellur' : 'falla'
      } brott.`
  }

  const what =
    isNumber(oldPart[0]) && detokenize(oldPart.slice(1)) === 'kr.'
      ? 'fjárhæðarinnar'
      : oldPart.length === 1 && isNumber(oldPart[0])
      ? 'tölunnar'
      : one
      ? 'orðsins'
      : 'orðanna'
  return (place) =>
    `Í stað ${what} ${quote(oldPart)} í ${place} kemur: ${asEnd(newPart)}`
}
