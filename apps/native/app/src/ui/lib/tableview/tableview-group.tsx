import React from 'react'
import styled from 'styled-components/native'
import { font } from '../../utils/font'

enum TableViewGroupType {
  PLAIN,
  GROUPED,
  INSET_GROUPED,
}

interface TableViewGroupProps {
  /**
   * Displayed above the group
   */
  header?: React.ReactNode
  /**
   * Displayed below the group
   */
  footer?: React.ReactNode
  /**
   * Group cells
   */
  children?: React.ReactNode
  type?: TableViewGroupType
}

const Host = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
  width: 100%;
`

const Header = styled.SafeAreaView`
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const HeaderText = styled.Text`
  ${font({
    fontWeight: '600',
  })}
`

const Footer = styled.SafeAreaView``

const FooterText = styled.Text`
  ${font()}
`

export const TableViewGroup = React.memo((props: TableViewGroupProps) => {
  const {
    header,
    footer,
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type = TableViewGroupType.PLAIN,
  } = props

  return (
    <Host>
      {header && (
        <Header>
          {typeof header === 'string' ? (
            <HeaderText>{header}</HeaderText>
          ) : (
            header
          )}
        </Header>
      )}
      {children}
      {footer && (
        <Footer>
          {typeof footer === 'string' ? (
            <FooterText>{footer}</FooterText>
          ) : (
            footer
          )}
        </Footer>
      )}
    </Host>
  )
})
