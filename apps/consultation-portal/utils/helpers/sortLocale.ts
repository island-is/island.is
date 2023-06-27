import { RelatedCase, Stakeholder } from '../../types/interfaces'

interface ArrOfValueAndLabel {
  value: string
  label: string
}

interface Props {
  list: Array<Stakeholder> | Array<RelatedCase> | Array<ArrOfValueAndLabel>
  sortOption: 'name' | 'caseNumber' | 'label'
}

const IS_ALPHABET = [
  'a',
  'á',
  'b',
  'd',
  'ð',
  'e',
  'é',
  'f',
  'g',
  'h',
  'i',
  'í',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'ó',
  'p',
  'r',
  's',
  't',
  'u',
  'ú',
  'v',
  'x',
  'y',
  'ý',
  'þ',
  'æ',
  'ö',
]

export const sortLocale = ({ list, sortOption }: Props) => {
  if (list.length < 1) {
    return []
  }

  if (sortOption === 'caseNumber') {
    return [...list].sort((a, b) =>
      a[sortOption].localeCompare(b[sortOption], 'is'),
    )
  }
  return [...list].sort(
    (a, b) => {
      const lowerCaseA = a[sortOption].toLowerCase()
      const lowerCaseB = b[sortOption].toLowerCase()
      const minLen = Math.min(lowerCaseA.length, lowerCaseB.length)

      if (a === b) return 0

      for (let idx = 0; idx < minLen; idx++) {
        const aLetter = lowerCaseA[idx]
        const bLetter = lowerCaseB[idx]

        if (aLetter === bLetter) continue

        const aIndex = IS_ALPHABET.indexOf(aLetter)
        const bIndex = IS_ALPHABET.indexOf(bLetter)

        if (aIndex != -1 && bIndex != -1) {
          return aIndex < bIndex ? -1 : 1
        }

        return lowerCaseA.localeCompare(lowerCaseB, 'is')
      }
    },
    // looks like localeCompare doesnt work on chrome browsers for is
    // a[sortOption].localeCompare(b[sortOption], 'is'),
  )
}
