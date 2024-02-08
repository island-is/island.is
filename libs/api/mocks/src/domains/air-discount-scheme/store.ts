import { createStore } from '@island.is/shared/mocking'
import {
  AirDiscountSchemeDiscount,
  AirDiscountSchemeFlightLeg,
  AirDiscountSchemeNewDiscount,
} from '../../types'
import {
  getAirNewDiscountsData,
  getAirDiscountsData,
  getFlights,
} from './static'
export const store = createStore(() => {
  const airDiscounts: AirDiscountSchemeDiscount[] = getAirDiscountsData
  const airNewDiscounts: AirDiscountSchemeNewDiscount[] = getAirNewDiscountsData
  const flights: AirDiscountSchemeFlightLeg[] = getFlights

  return {
    airNewDiscounts,
    airDiscounts,
    flights,
  }
})
