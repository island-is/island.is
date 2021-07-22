export const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) return false
  const hours = parseInt(value.slice(0, 2))
  const minutes = parseInt(value.slice(2, 4))
  if (hours > 23) return false
  if (minutes > 59) return false
  return true
}

export * from './isGeneralWorkplaceAccident'
export * from './isFishermanAccident'
export * from './isProfessionalAthleteAccident'
export * from './isAgricultureAccident'
