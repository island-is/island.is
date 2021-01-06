export interface DrivingLicense {
  id: number
  issued: string
  expires: string
  eligibilities: {
    id: string
    issued: string
    expires: string
    comment: string
  }[]
}
