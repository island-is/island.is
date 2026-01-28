import {
  Box,
  GridColumn,
  GridRow,
  Hidden,
  Inline,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './AgendaCard.css'

type AgendaCardProps = {
  caseNumber: string
  type: string
  judgesString: string
  title: string
  date: string
  time: string
  court: string
  courtRoom: string
  addToCalendarButton: React.ReactNode
  closedHearingText: string
}

export const AgendaCard = ({
  title,
  caseNumber,
  type,
  judgesString,
  date,
  time,
  court,
  courtRoom,
  closedHearingText,
  addToCalendarButton,
}: AgendaCardProps) => {
  const detailLines: { text: string }[] = []

  if (court) {
    detailLines.push({
      text: court,
    })
  }

  if (courtRoom) {
    detailLines.push({
      text: courtRoom,
    })
  }

  if (time) {
    detailLines.push({
      text: time,
    })
  }

  if (closedHearingText) {
    detailLines.push({
      text: closedHearingText,
    })
  }

  const renderDetails = () => {
    return (
      <Stack space={1}>
        {detailLines.slice(0, 5).map((d, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection={'row'}
            justifyContent="flexEnd"
            className={styles.iconBox}
          >
            <Box marginLeft={2}>
              <Text textAlign="right" variant="medium">
                {d.text}
              </Text>
            </Box>
          </Box>
        ))}
      </Stack>
    )
  }

  return (
    <Box
      height="full"
      border="standard"
      borderRadius="large"
      padding={3}
      background="white"
    >
      <Stack space={3}>
        <Hidden below="sm">
          <Stack space={1}>
            <Inline space={1} alignY="center" justifyContent="spaceBetween">
              <Inline space={2} alignY="center">
                <Text variant="h5" as="h2">
                  {caseNumber}
                </Text>
                {Boolean(type) && (
                  <Tag variant="blue" disabled>
                    {type}
                  </Tag>
                )}
              </Inline>
              <Text variant="medium" color="purple400" fontWeight="semiBold">
                {date}
              </Text>
            </Inline>
            <GridRow direction="row">
              <GridColumn span="8/12">
                {judgesString && <Text variant="small">{judgesString}</Text>}
                {title && (
                  <Box flexGrow={1} marginTop={1}>
                    <Text className={styles.preLine}>{title}</Text>
                  </Box>
                )}
              </GridColumn>
              <GridColumn span="4/12">{renderDetails()}</GridColumn>
            </GridRow>
          </Stack>
        </Hidden>
        <Hidden above="xs">
          <Stack space={1}>
            <Inline space={1} alignY="center" justifyContent="spaceBetween">
              <Inline space={2} alignY="center">
                <Text variant="h5" as="h2">
                  {caseNumber}
                </Text>
                {Boolean(type) && (
                  <Tag variant="blue" disabled>
                    {type}
                  </Tag>
                )}
              </Inline>
              <Text variant="medium" color="purple400" fontWeight="semiBold">
                {date}
              </Text>
            </Inline>
            {judgesString && <Text variant="small">{judgesString}</Text>}
            {title && (
              <Box flexGrow={1} marginTop={1}>
                <Text className={styles.preLine}>{title}</Text>
              </Box>
            )}
            {renderDetails()}
          </Stack>
        </Hidden>
        {addToCalendarButton}
      </Stack>
    </Box>
  )
}
