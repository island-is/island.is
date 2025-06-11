import styled from 'styled-components/native'
import { isAndroid } from '../../../utils/devices'

export const FloatingBottomFooter = styled.SafeAreaView`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.color.white};

  shadow-color: ${({ theme }) => theme.color.blue400};
  shadow-offset-width: 0px;
  shadow-offset-height: -4px;
  shadow-opacity: 0.08;
  shadow-radius: 12px;

  /* Android shadow */
  elevation: 4;
`

export const FloatingBottomContent = styled.View(({ theme }) => ({
  paddingHorizontal: theme.spacing.p4,
  paddingTop: theme.spacing.p2,
  rowGap: theme.spacing.p2,
  ...(isAndroid && {
    paddingBottom: theme.spacing.p2,
  }),
}))
