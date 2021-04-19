import React from 'react';
import styled from 'styled-components/native';

enum TableViewGroupType {
  PLAIN,
  GROUPED,
  INSET_GROUPED,
}

interface TableViewGroupProps {
  /**
   * Displayed above the group
   */
  header?: React.ReactNode;
  /**
   * Displayed below the group
   */
  footer?: React.ReactNode;
  /**
   * Group cells
   */
  children?: React.ReactNode;
  type?: TableViewGroupType;
}

const Host = styled.View`
  margin-bottom: 32px;
`;

const Header = styled.SafeAreaView`
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
`;

const HeaderText = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 16px;
  color: ${props => props.theme.color.dark400};
`;

const Footer = styled.SafeAreaView``;
const FooterText = styled.Text``;


export function TableViewGroup(props: TableViewGroupProps) {
  const { header, footer, children, type = TableViewGroupType.PLAIN } = props;

  return (
    <Host>
      {header && (
        <Header>
          {typeof header === 'string' ? <HeaderText>{header}</HeaderText> : header}
        </Header>
      )}
      {children}
      {footer && (
        <Footer>
          {typeof footer === 'string' ? <FooterText>{footer}</FooterText> : footer}
        </Footer>
      )}
    </Host>
  )
}
