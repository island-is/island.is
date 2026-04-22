import styled from 'styled-components/native'
import { isAndroid } from '@/utils/devices'

export const ButtonDrawer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.spacing.p4,
  paddingTop: theme.spacing.p2,
  rowGap: theme.spacing.p2,
  ...(isAndroid && {
    paddingBottom: theme.spacing.p2,
  }),

  backgroundColor: theme.color.white,
  shadowColor: theme.color.blue400,
  shadowOffsetWidth: 0,
  shadowOffsetHeight: -4,
  shadowOpacity: '0.08',
  shadowRadius: 12,

  /* Android shadow */
  elevation: '4',
}))
