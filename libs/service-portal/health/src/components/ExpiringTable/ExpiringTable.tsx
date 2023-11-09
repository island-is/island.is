import { FC } from 'react'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { LinkButton } from '@island.is/service-portal/core'

interface Props {
  header: React.ReactNode
  children: React.ReactNode
  footnote: string
  link: string
  linkText: string
}

const ExpiringTable: FC<React.PropsWithChildren<Props>> = ({
  header,
  children,
  footnote,
  link,
  linkText,
}) => {
  return (
    <Box marginTop={[2, 2, 5]}>
      <Box marginTop={2}>
        <T.Table>
          {header}
          <T.Body>{children}</T.Body>
        </T.Table>
      </Box>{' '}
      <Box paddingTop={4}>
        <Text variant="small" paddingBottom={2}>
          {footnote}
        </Text>
        <LinkButton to={link} text={linkText} />
      </Box>
    </Box>
  )
}

export default ExpiringTable
