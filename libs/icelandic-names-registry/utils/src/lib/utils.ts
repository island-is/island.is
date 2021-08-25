type Items = {
  id: number
  icelandicName: string
}

const order =
  '0123456789aAáÁbBcCdDeEéÉfFgGhHiIíÍjJkKlLmMnNoOóÓpPqQrRsStTuUúÚvVwWxXyYýÝzZþÞæÆöÖ'

const charOrder = (a: string) => {
  const ix = order.indexOf(a)
  return ix === -1 ? a.charCodeAt(0) + order.length : ix
}

export const sortByNames = (items: Items[]) => {
  if (!items.length) return []

  return items.sort((a, b) => {
    for (
      let i = 0;
      i < Math.min(a.icelandicName.length, b.icelandicName.length);
      i++
    ) {
      const iA = charOrder(a.icelandicName[i])
      const iB = charOrder(b.icelandicName[i])

      if (iA !== iB) {
        return iA - iB
      }
    }

    return a.icelandicName.length - b.icelandicName.length
  })
}
