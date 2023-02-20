import {
  ActionCard,
  Box,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'

import format from 'date-fns/format'

type CardProps = {
  caseNumber: string
  nameOfReviewer: string
  reviewPeriod: string
}

export const WriteReviewCard = ({
  caseNumber,
  nameOfReviewer,
  reviewPeriod,
}: CardProps) => {
  caseNumber = '76/2022'
  nameOfReviewer = 'Helga Margret Olafsdottir'
  reviewPeriod = '01.08.2022 – 01.12.2022'

  return (
    // Add a check whether user is logged in or not and implement accordingly
    // This is an implementation when user is not logged in.
    <Box
      padding={3}
      borderRadius="standard"
      borderWidth="standard"
      borderColor="blue300"
    >
      <GridRow>
        <Box
          marginRight={1}
          borderRightWidth={'standard'}
          borderColor={'purple300'}
          paddingRight={1}
          paddingLeft={2}
        >
          <Text variant="eyebrow" color="purple400">
            Mál nr. {caseNumber}
          </Text>
        </Box>
        <Box>
          <Text variant="eyebrow" color="purple400">
            Til umsagnar: {reviewPeriod}
          </Text>
        </Box>
      </GridRow>
      <Text variant="h3" marginTop={1}>
        Skrifa umsögn
      </Text>
      <Text variant="default" marginBottom={2}>
        Umsagnaraðili: {nameOfReviewer}
      </Text>
      <Input
        textarea
        label="Umsögn"
        name="Test"
        placeholder="Hér skal skrifa umsögn"
        rows={10}
      />
    </Box>
  )
}

export default WriteReviewCard

// <ActionCard
//   headingVariant="h4"
//   heading="Skrifa umsögn"
//   text="Lorem ipsum dolar, ............"
//   cta={{ label: 'Skrá mig inn' }}
// >
//   {' '}

// </ActionCard>
