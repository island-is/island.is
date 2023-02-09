import { createStore } from '@island.is/shared/mocking'
import { AirDiscountSchemeDiscount } from '../../types'
import { getAirDiscountsData } from './static'
export const store = createStore(() => {
  const airDiscounts: AirDiscountSchemeDiscount[] = getAirDiscountsData

  return {
    airDiscounts,
  }
})
