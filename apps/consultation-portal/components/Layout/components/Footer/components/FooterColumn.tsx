import { Box, Column } from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import FooterDivider from './FooterDivider'

interface Props {
  justifyContent?: 'flexStart' | 'center' | 'flexEnd'
  isDivider?: boolean
  children?: ReactNode
}

export const FooterColumn = ({
  justifyContent,
  isDivider,
  children,
}: Props) => {
  return (
    <Column width={isDivider ? 'content' : '1/4'}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={isDivider ? 'center' : justifyContent}
        width="full"
        textAlign={justifyContent === 'flexEnd' ? 'right' : 'left'}
      >
        {isDivider ? <FooterDivider /> : children}
      </Box>
    </Column>
  )
}

export default FooterColumn
