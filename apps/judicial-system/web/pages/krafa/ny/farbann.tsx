import React from 'react'
import StepOne from '@island.is/judicial-system-web/src/routes/Prosecutor/RestrictionRequest/StepOne/StepOne'
import { CaseType } from '@island.is/judicial-system/types'

const NewTravelBan = () => {
  return <StepOne type={CaseType.TRAVEL_BAN} />
}

export default NewTravelBan
