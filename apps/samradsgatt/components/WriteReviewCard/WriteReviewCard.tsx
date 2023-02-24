import {
  ActionCard,
  Box,
  Input,
  Text,
  Button,
  Columns,
  Column,
  Icon,
} from '@island.is/island-ui/core'
import { style } from '@vanilla-extract/css'

import format from 'date-fns/format'

type CardInfo = {
  caseNumber: string
  nameOfReviewer: string
  reviewPeriod: string
}

type CardProps = {
  card: CardInfo
  isLoggedIn: boolean
}

const date = format(new Date(Date.now()), 'dd.MM.yyyy')

export const WriteReviewCard = ({ card, isLoggedIn }: CardProps) => {
  return isLoggedIn ? (
    <Box
      paddingTop={3}
      paddingX={3}
      borderRadius="standard"
      borderWidth="standard"
      borderColor="blue300"
    >
      <Columns>
        <Column width="content">
          <Box
            marginRight={1}
            borderRightWidth={'standard'}
            borderColor={'purple300'}
            paddingRight={1}
          >
            <Text variant="eyebrow" color="purple400">
              Mál nr. {card.caseNumber}
            </Text>
          </Box>
        </Column>
        <Column width="content">
          <Box style={{ display: 'flex', justifyItems: 'flex-end' }}>
            <Text variant="eyebrow" color="purple400">
              Til umsagnar: {card.reviewPeriod}
            </Text>
          </Box>
        </Column>
        <Column>
          <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Text variant="small">{date}</Text>
          </Box>
        </Column>
      </Columns>
      <Text variant="h3" marginTop={1}>
        Skrifa umsögn
      </Text>
      <Text variant="default" marginBottom={2}>
        Umsagnaraðili: {card.nameOfReviewer}
      </Text>
      <Input
        textarea
        label="Umsögn"
        name="Test"
        placeholder="Hér skal skrifa umsögn"
        rows={10}
      />
      <Columns>
        <Column width="content">
          <Box
            padding={2}
            marginY={2}
            borderRadius="large"
            borderWidth="standard"
            borderColor="blue400"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box paddingRight={1}>
              <Text variant="h5" color="blue400">
                Hlaða upp viðhengi
              </Text>
            </Box>
            <Icon type="outline" icon="documents" color="blue400"></Icon>
          </Box>
        </Column>
        <Column>
          <Box marginY={2} style={{ display: 'flex', justifyContent: 'end' }}>
            <Button size="default">Staðfesta umsögn</Button>
          </Box>
        </Column>
      </Columns>
    </Box>
  ) : (
    <ActionCard
      headingVariant="h4"
      heading="Skrifa umsögn"
      text="Þú verður að vera skráð(ur) inn til þess að geta skrifað umsögn um tillögur"
      cta={{ label: 'Skrá mig inn' }}
    >
      {' '}
    </ActionCard>
  )
}

export default WriteReviewCard
