import { createStore } from '@island.is/shared/mocking'

import * as data from './static'
import {
  HealthDirectorateOrganDonation,
  HealthDirectorateVaccinations,
} from '../../types'

export const store = createStore(() => {
  const getOrganDonationStatus: HealthDirectorateOrganDonation =
    data.organDonationStatus
  const getVaccinations: HealthDirectorateVaccinations = data.vaccinations

  return {
    getOrganDonationStatus,
    getVaccinations,
  }
})
