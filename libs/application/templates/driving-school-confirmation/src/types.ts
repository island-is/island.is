import { Query } from './types/schema'

export type Student = {
  name: string
  nationalId: string
}

export type GetDrivingLicenseBookStudentOverview = {
  drivingLicenseBookStudent: Query['drivingLicenseBookStudent']
}
