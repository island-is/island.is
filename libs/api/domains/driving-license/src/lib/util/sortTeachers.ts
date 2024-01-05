import { TeacherV4 } from '@island.is/clients/driving-license'

const order =
  '0123456789aAáÁbBcCdDeEéÉfFgGhHiIíÍjJkKlLmMnNoOóÓpPqQrRsStTuUúÚvVwWxXyYýÝzZþÞæÆöÖ'

const charOrder = (a: string) => {
  const ix = order.indexOf(a)
  return ix === -1 ? a.charCodeAt(0) + order.length : ix
}

const sortTeachers = (a: TeacherV4, b: TeacherV4) => {
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

export default sortTeachers
