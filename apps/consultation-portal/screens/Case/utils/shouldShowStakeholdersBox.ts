import { Case } from '../../../types/interfaces'

interface ShouldShowStakeholdersBoxProps {
  chosenCase: Case
}

const shouldShowStakeholdersBox = ({
  chosenCase,
}: ShouldShowStakeholdersBoxProps) => {
  if (chosenCase?.created && chosenCase?.created !== null) {
    // start date is the date when stakeholders box can be shown
    const startDate = '2023-11-13T00:00:00.000Z'
    const createdDate = new Date(chosenCase?.created).getTime()

    const dateWhenBoxCanBeShown = new Date(startDate).getTime()
    return createdDate >= dateWhenBoxCanBeShown
  }
  return false
}

export default shouldShowStakeholdersBox
