import {
  Box,
  GridColumn,
  GridRow,
  Hidden,
  Icon,
  IconMapIcon,
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
  addToCalendarButton,
}: AgendaCardProps) => {
  const detailLines: { icon: IconMapIcon; text: string }[] = []

  if (court) {
    detailLines.push({
      icon: 'hammer',
      text: court,
    })
  }

  if (courtRoom) {
    detailLines.push({
      icon: 'home',
      text: courtRoom,
    })
  }

  if (time) {
    detailLines.push({
      icon: 'time',
      text: time,
    })
  }

  const renderDetails = () => {
    return (
      <Box marginTop={2}>
        <Stack space={1}>
          {detailLines?.slice(0, 5).map((d, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection={'row'}
              alignItems="center"
              className={styles.iconBox}
            >
              <Icon
                icon={d.icon}
                size="medium"
                type="outline"
                color="blue400"
              />
              <Box marginLeft={2}>
                <Text variant="small">{d.text}</Text>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
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
                <Text variant="h5">{caseNumber}</Text>
                {Boolean(type) && (
                  <Tag variant="blue" disabled>
                    {type}
                  </Tag>
                )}
              </Inline>
              <Text variant="medium">{date}</Text>
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
                <Text variant="h5">{caseNumber}</Text>
                {Boolean(type) && (
                  <Tag variant="blue" disabled>
                    {type}
                  </Tag>
                )}
              </Inline>
              <Text variant="medium">{date}</Text>
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
