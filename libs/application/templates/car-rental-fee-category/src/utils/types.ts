export interface CarCategoryRecord {
    vehicleId: string
    mileage: number
    rateCategory: string
  }
  
export interface CarCategoryError {
    code: 1 | 2
    message: string
    carNr: string
}