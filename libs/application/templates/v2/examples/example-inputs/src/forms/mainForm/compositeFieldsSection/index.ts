import { SectionBuilder } from '@island.is/application/core'
import { addNationalIdWithNameSubsection } from './nationalIdWithNameSubsection'
import { addApplicantInfoSubsection } from './applicantInfoSubsection'
import { addBankAccountSubsection } from './bankAccountSubsection'
import { addVehiclePermnoSubsection } from './vehiclePermnoSubsection'

const compositeFieldsSectionBuilder = new SectionBuilder(
  'compositeFieldsSection',
  'Composite fields',
)

addNationalIdWithNameSubsection(compositeFieldsSectionBuilder)
addApplicantInfoSubsection(compositeFieldsSectionBuilder)
addBankAccountSubsection(compositeFieldsSectionBuilder)
addVehiclePermnoSubsection(compositeFieldsSectionBuilder)

export const compositeFieldsSection = compositeFieldsSectionBuilder.build()
