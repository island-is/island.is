import { Query } from '@island.is/api/schema'

export type Student = {
  name: string
  nationalId: string
}

export type GetDrivingLicenseBookStudentOverview = {
  drivingLicenseBookStudent: Query['drivingLicenseBookStudent']
}
