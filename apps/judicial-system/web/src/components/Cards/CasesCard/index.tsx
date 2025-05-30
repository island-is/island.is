import { FC } from 'react'

import { Box, LinkV2, Text } from '@island.is/island-ui/core'

import * as styles from './index.css'

interface CasesCardProps {
  title: string
  description: string
  href: string
}

const CasesCard: FC<CasesCardProps> = (props) => (
  <LinkV2 href={props.href}>
    <Box
      borderRadius="large"
      border="standard"
      paddingX={4}
      paddingY={3}
      height="full"
      className={styles.container}
    >
      <Text variant="h4" color="blue400" marginBottom={1}>
        {props.title}
      </Text>
      <Text>{props.description}</Text>
    </Box>
  </LinkV2>
)

export default CasesCard
