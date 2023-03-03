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
  switch (status) {
    case 'Til umsagnar':
      return (
        <StatusCard
          heading="Niðurstöður í vinnslu"
          text="Umsagnarfrestur er liðinn (01.01.2023–13.01.2023). Umsagnir voru birtar jafnóðum og þær bárust. Skoða umsagnir. Niðurstöður samráðsins verða birtar þegar unnið hefur verið úr þeim ábendingum og athugasemdum sem bárust."
        />
      )
    default:
      return <></>
  }
}

export default CaseStatusCard
