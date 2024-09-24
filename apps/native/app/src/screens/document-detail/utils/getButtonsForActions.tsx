import { Button } from '@ui'
import styled from 'styled-components'
import { View } from 'react-native'

import openIcon from '../../../assets/icons/external-link.png'
import downloadIcon from '../../../assets/icons/download.png'
import { DocumentV2Actions } from '../../../graphql/types/schema'

const Host = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

const Action = styled(View)`
  flex: 1;
`

const getIcons = (icon: string) => {
  switch (icon) {
    case 'open':
      return openIcon
    case 'download':
      return downloadIcon
    default:
      return null
  }
}

export const getButtonsForActions = (
  openBrowser: (link: string, componentId?: string) => void,
  onShare: () => void,
  componentId: string,
  actions?: DocumentV2Actions[] | null,
) => {
  if (!actions) {
    return
  }
  const buttons = actions.map((action) => {
    const icon = getIcons(action.icon ?? '')
    if (action.type === 'url' && action.data && action.title) {
      return (
        <Action key={`${action.title}-${action.type}`}>
          <Button
            isUtilityButton
            isOutlined
            title={action.title}
            icon={icon}
            onPress={() => openBrowser(action.data!, componentId)}
          />
        </Action>
      )
    }
    if (action.type === 'file' && action.data && action.title) {
      return (
        <Action key={`${action.title}-${action.type}`}>
          <Button
            isUtilityButton
            isOutlined
            title={action.title}
            icon={icon}
            onPress={onShare}
          />
        </Action>
      )
    }
    return []
  })
  return <Host>{buttons}</Host>
}
