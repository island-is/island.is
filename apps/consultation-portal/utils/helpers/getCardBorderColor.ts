export const getCardBorderColor = (status: string) => {
  if (status === 'Til umsagnar') {
    return 'purple300'
  } else if (status === 'Niðurstöður í vinnslu') {
    return 'blue300'
  } else if (status === 'Niðurstöður birtar') {
    return 'mint300'
  }
  return 'dark300'
}

export default getCardBorderColor
