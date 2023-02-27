import { createStore } from '@island.is/shared/mocking'
import {
  AirDiscountSchemeDiscount,
  AirDiscountSchemeFlightLeg,
} from '../../types'
import { getAirDiscountsData, getFlights } from './static'
export const store = createStore(() => {
  const airDiscounts: AirDiscountSchemeDiscount[] = getAirDiscountsData
  const flights: AirDiscountSchemeFlightLeg[] = getFlights

  return {
    airDiscounts,
    flights,
  }
})
