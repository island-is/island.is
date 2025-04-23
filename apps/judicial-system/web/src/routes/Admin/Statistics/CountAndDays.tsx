import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { LabelValue } from '@island.is/judicial-system-web/src/components'

interface Props {
  label: string
  count?: number
  days?: number
}

export const CountAndDays = ({ label, count, days }: Props) => {
  console.log(label, count, days)
  return (
    <Box
      background="blue100"
      borderRadius="large"
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
    >
      <LabelValue label={label} value={count ?? 0} />

      {days !== undefined && (
        <>
          <Box flexGrow={1} marginX={2}>
            <div
              style={{
                height: '1px',
                borderBottom: `1px dotted ${theme.color.blue200}`,
                width: '100%',
              }}
            />
          </Box>
          <Text>
            <b>{`${days} ${days === 1 ? 'dagur' : 'dagar'}`}</b>
          </Text>
        </>
      )}
    </Box>
  )
}

export default CountAndDays
