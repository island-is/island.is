import { SimpleCardSkeleton } from '../Card'
import StackedTitleAndDescription from '../StackedTitleAndDescription/StackedTitleAndDescription'

// Depending on the status of the card. Need to add props.

export const CaseStatusCard = ({ status }) => {
  const StatusCard = ({ heading, text }) => (
    <SimpleCardSkeleton borderColor="blue600" borderWidth="large">
      <StackedTitleAndDescription headingColor="blue400" title={heading}>
        {text}
      </StackedTitleAndDescription>
    </SimpleCardSkeleton>
  )
  //TODO: Get proper wording and info for card
  switch (status) {
    case 'Niðurstöður birtar':
      return (
        <StatusCard
          heading="Niðurstöður birtar"
          text="Sjá meðfylgjandi skjal."
        />
      )
    default:
      return <></>
  }
}

export default CaseStatusCard
