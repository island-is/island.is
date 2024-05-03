import {
  CountryOfResidenceViewModel,
  ResidenceAbroadViewModel,
  TravelDocumentViewModel,
} from '@island.is/clients/directorate-of-immigration'

export interface ApplicantInformation {
  currentCountryOfResidenceList?: CountryOfResidenceViewModel[]
  currentPassportItem?: TravelDocumentViewModel
  currentStaysAbroadList?: ResidenceAbroadViewModel[]
}
