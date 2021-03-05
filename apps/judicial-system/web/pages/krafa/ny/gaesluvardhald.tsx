import StepOne from '@island.is/judicial-system-web/src/routes/Prosecutor/CreateDetentionRequest/StepOne/StepOne'
import { CaseType } from 'libs/judicial-system/types/src'

const NewCustody = () => {
  return <StepOne type={CaseType.CUSTODY} />
}

export default NewCustody
