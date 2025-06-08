import styled from 'styled-components/native'

export const FloatingBottomFooter = styled.SafeAreaView`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.color.white};

  /* iOS shadow */
  shadow-color: ${({ theme }) => theme.color.blue400};
  shadow-offset: 0px -4px;
  shadow-opacity: 0.08;
  shadow-radius: 12px;

  /* Android shadow */
  elevation: 1;
`

export const FloatingBottomContent = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.p4}px;
  padding-top: ${({ theme }) => theme.spacing.p2}px;
`
