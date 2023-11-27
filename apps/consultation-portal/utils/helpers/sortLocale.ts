interface Props<ListItem> {
  list: ListItem[]
  sortOption: 'name' | 'caseNumber' | 'label' | 'fileOrLink'
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

export const sortLocale = <ListItem>({
  list,
  sortOption,
}: Props<ListItem>): ListItem[] => {
  const getSortOption = (listItem: ListItem) => {
    if (sortOption !== 'fileOrLink') {
      return listItem[sortOption]
    }

    if (listItem['link']) {
      return listItem['description']
        ? listItem['description']
        : listItem['link']
    }

    return listItem['description']
      ? listItem['description']
      : listItem['fileName']
  }

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
      const aSortOption = getSortOption(a)
      const bSortOption = getSortOption(b)
      const lowerCaseA = aSortOption.toLowerCase()
      const lowerCaseB = bSortOption.toLowerCase()
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
