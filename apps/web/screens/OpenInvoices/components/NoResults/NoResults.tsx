import { useIntl } from 'react-intl'

import { Box, problemTemplateContainer, Text } from '@island.is/island-ui/core'

import { m } from '../../messages'
import * as styles from './NoResults.css'

export const NoResults = () => {
  const { formatMessage } = useIntl()

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={['columnReverse', 'columnReverse', 'row']}
      columnGap={[2, 4, 8, 8, 12]}
      rowGap={[7, 7, 0]}
      paddingY={[5, 8]}
      paddingX={[3, 3, 5, 10]}
      background="white"
      className={problemTemplateContainer({ blue: true })}
    >
      <Box display="flex" flexDirection="column" rowGap={1}>
        <Text variant="h3" as="h3" color="dark400">
          {formatMessage(m.overview.noResultsTitle)}
        </Text>
        <Text>{formatMessage(m.overview.noResultsDescription)}</Text>
      </Box>
      <img
        src="/assets/openinvoices/le-moving-s1.svg"
        alt={formatMessage(m.overview.noResultsIllustrationAlt)}
        className={styles.illustration}
      />
    </Box>
  )
}
