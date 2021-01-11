export interface DrivingLicense {
  id: number
  issued: string
  expires: string
  isProvisional: boolean
  eligibilities: {
    id: string
    issued: string
    expires: string
    comment: string
  }[]
}
