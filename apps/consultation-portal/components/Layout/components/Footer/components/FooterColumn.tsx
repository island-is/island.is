import { Box, Column } from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import FooterDivider from './FooterDivider'
import { useIsMobile } from '../../../../../hooks'

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
  const { isMobile } = useIsMobile()
  const _justifyContent = isMobile ? 'flexStart' : justifyContent
  return (
    <Column width={isDivider ? 'content' : '1/4'}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={isDivider ? 'center' : _justifyContent}
        width="full"
        textAlign={_justifyContent === 'flexEnd' ? 'right' : 'left'}
      >
        {isDivider ? <FooterDivider /> : children}
      </Box>
    </Column>
  )
}

export default FooterColumn
