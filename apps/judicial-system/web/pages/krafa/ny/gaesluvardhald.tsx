import React from 'react'
import StepOne from '@island.is/judicial-system-web/src/routes/Prosecutor/RestrictionCase/StepOne/StepOne'
import { CaseType } from '@island.is/judicial-system/types'

const NewCustody = () => {
  return <StepOne type={CaseType.CUSTODY} />
}

export default NewCustody
