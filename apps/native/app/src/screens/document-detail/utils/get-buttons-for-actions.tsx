import styled from 'styled-components'
import { View } from 'react-native'
import { isValidElement } from 'react'

import { Button } from '../../../ui'
import openIcon from '../../../assets/icons/external-link.png'
import downloadIcon from '../../../assets/icons/download.png'
import { DocumentV2Action } from '../../../graphql/types/schema'

const Host = styled(View)<{ setMaxWidth: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
  max-width: ${({ setMaxWidth }) => (setMaxWidth ? '150px' : 'auto')};
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
  actions?: DocumentV2Action[] | null,
) => {
  if (!actions?.length) {
    return
  }
  const buttons = actions.map((action) => {
    const icon = getIcons(action.icon ?? '')
    const isFile = action.type === 'file'
    const isUrl = action.type === 'url'

    if ((isFile || isUrl) && action.data && action.title) {
      return (
        <Action key={`${action.title}-${action.type}`}>
          <Button
            isUtilityButton
            isOutlined
            title={action.title}
            icon={icon}
            onPress={() =>
              isUrl ? openBrowser(action.data ?? '', componentId) : onShare()
            }
            style={{
              paddingTop: 9,
              paddingBottom: 9,
            }}
          />
        </Action>
      )
    }

    return []
  })

  const filteredButtons = buttons.filter((b) => isValidElement(b))
  return (
    <Host setMaxWidth={filteredButtons.length === 1}>{filteredButtons}</Host>
  )
}
