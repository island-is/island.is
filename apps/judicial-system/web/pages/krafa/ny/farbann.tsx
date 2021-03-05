import StepOne from '@island.is/judicial-system-web/src/routes/Prosecutor/CreateDetentionRequest/StepOne/StepOne'
import { CaseType } from 'libs/judicial-system/types/src'

const NewTravelBan = () => {
  return <StepOne type={CaseType.TRAVEL_BAN} />
}

export default NewTravelBan
