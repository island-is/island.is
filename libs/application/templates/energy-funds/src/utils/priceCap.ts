export const PRICE_CAP = 10000000
export const PASSENGER_CAR_PRICE_CAP = 8000000

// Regulation 1090/2026 lowers the cap for passenger cars (M1) by application
// date from 1 November 2026. Iceland is on UTC all year.
export const PASSENGER_CAR_PRICE_CAP_START = new Date('2026-11-01T00:00:00Z')

const isPassengerCar = (vehicleRegistrationCode?: string | null) =>
  vehicleRegistrationCode?.trim().toUpperCase().startsWith('M1') ?? false

export const getPriceCap = (
  vehicleRegistrationCode?: string | null,
  date: Date = new Date(),
) =>
  isPassengerCar(vehicleRegistrationCode) &&
  date >= PASSENGER_CAR_PRICE_CAP_START
    ? PASSENGER_CAR_PRICE_CAP
    : PRICE_CAP
