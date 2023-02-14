export function getTagVariants(status) {
  switch (status) {
    case 'Til umsagnar':
      return 'purple'
    case 'Niðurstöður í vinnslu':
      return 'darkerBlue'
    case 'Niðurstöður birtar':
      return 'mint'
  }
}
export default getTagVariants
