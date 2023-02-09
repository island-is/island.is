import { ActionCard } from '@island.is/island-ui/core'

export const WriteReviewCard = () => {
  return (
    // Add a check whether user is logged in or not and implement accordingly
    // This is an implementation when user is not logged in.
    <ActionCard
      headingVariant="h4"
      heading="Skrifa umsögn"
      text="Lorem ipsum dolar, ............"
      cta={{ label: 'Skrá mig inn' }}
    ></ActionCard>
  )
}

export default WriteReviewCard
