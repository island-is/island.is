import { OkukennariDto } from '@island.is/clients/driving-license-v1'

const order =
  '0123456789aAáÁbBcCdDeEéÉfFgGhHiIíÍjJkKlLmMnNoOóÓpPqQrRsStTuUúÚvVwWxXyYýÝzZþÞæÆöÖ'

const charOrder = (a: string) => {
  const ix = order.indexOf(a)
  return ix === -1 ? a.charCodeAt(0) + order.length : ix
}

const sortTeachers = (a: OkukennariDto, b: OkukennariDto) => {
  if (!a.nafn || !b.nafn) {
    return 0
  }

  for (let i = 0; i < Math.min(a.nafn.length, b.nafn.length); i++) {
    const iA = charOrder(a.nafn[i])
    const iB = charOrder(b.nafn[i])

    if (iA !== iB) {
      return iA - iB
    }
  }

  return a.nafn.length - b.nafn.length
}

export default sortTeachers
