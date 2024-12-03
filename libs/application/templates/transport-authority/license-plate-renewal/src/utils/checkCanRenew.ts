import { PlateOwnership } from '../shared'

export const checkCanRenew = (plate?: PlateOwnership | null): boolean => {
  const inThreeMonths = new Date().setMonth(new Date().getMonth() + 3)
  return plate ? +new Date(plate.endDate) <= +inThreeMonths : false
}
