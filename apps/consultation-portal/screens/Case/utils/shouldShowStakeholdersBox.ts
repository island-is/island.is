import { Case } from '../../../types/interfaces'

interface ShouldShowStakeholdersBoxProps {
  chosenCase: Case
}

const shouldShowStakeholdersBox = ({
  chosenCase,
}: ShouldShowStakeholdersBoxProps) => {
  if (chosenCase?.created && chosenCase?.created !== null) {
    // start date is the date when stakeholders box can be shown
    const startDate = '2023-11-06T13:00:00.000Z'
    const createdDate = new Date(chosenCase?.created)

    const dateWhenBoxCanBeShown = new Date(startDate)
    return createdDate >= dateWhenBoxCanBeShown
  }
  return false
}

export default shouldShowStakeholdersBox
