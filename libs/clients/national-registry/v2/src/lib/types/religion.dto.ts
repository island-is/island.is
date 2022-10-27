import { Kodar } from '../../../gen/fetch'

export interface ReligionDto {
  code: string
  name: string | null
}

const order =
  '0123456789aAáÁbBcCdDeEéÉfFgGhHiIíÍjJkKlLmMnNoOóÓpPqQrRsStTuUúÚvVwWxXyYýÝzZþÞæÆöÖ'

const charOrder = (a: string) => {
  const ix = order.indexOf(a)
  return ix === -1 ? a.charCodeAt(0) + order.length : ix
}

const sortIsAlphabetic = (a: ReligionDto, b: ReligionDto) => {
  if (!a.name || !b.name) {
    return 0
  }

  for (let i = 0; i < Math.min(a.name.length, b.name.length); i++) {
    const iA = charOrder(a.name[i])
    const iB = charOrder(b.name[i])

    if (iA !== iB) {
      return iA - iB
    }
  }

  return a.name.length - b.name.length
}

export function formatReligionDto(
  religions: Kodar[] | null | undefined,
): ReligionDto[] | null {
  if (religions == null) {
    return null
  }

  const mapped = religions?.map((religion) => ({
    code: religion.kodi,
    name: religion.lysing ?? null,
  }))

  return mapped.sort(sortIsAlphabetic)
}
