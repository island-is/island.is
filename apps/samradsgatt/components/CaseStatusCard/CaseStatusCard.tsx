import { Box, CategoryCard } from '@island.is/island-ui/core'

// Depending on the status of the card. Need to add props.

export const CaseStatusCard = () => {
  return (
    <Box paddingTop={4}>
      <CategoryCard
        heading="Niðurstöður í vinnslu"
        text=" Umsagnarfrestur er liðinn (01.01.2023–13.01.2023). Umsagnir voru birtar jafnóðum og þær bárust. Skoða umsagnir. Niðurstöður samráðsins verða birtar þegar unnið hefur verið úr þeim ábendingum og athugasemdum sem bárust."
        // TODO: change text to 16px
      />
    </Box>
  )
}

export default CaseStatusCard
