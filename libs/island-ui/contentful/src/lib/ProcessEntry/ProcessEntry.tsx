import React, { FC, useEffect } from 'react'
import {
  Text,
  ButtonDeprecated as Button,
  Box,
  GridRow,
  GridColumn,
  Stack,
  IconTypesDeprecated,
} from '@island.is/island-ui/core'
import { openDocument, fillAndSignKeyframes } from '../Taktikal/FillAndSign'

import '../Taktikal/FillAndSign.treat'
import * as styles from './ProcessEntry.treat'

export const Titles: { [k: string]: string } = {
  // TODO: translating these requires some effort
  Digital: 'Stafræn umsókn',
  'Digital w/login': 'Aðgangsstýrð stafræn umsókn',
  'Not digital': 'Handvirk umsókn',
  'Not digital w/login': 'Handvirk umsókn með innskráningu',
  'No type': '',
}

export interface ProcessEntryProps {
  processTitle: string
  processLink: string
  dropSignFileKey?: string
  type: string
  buttonText: string
}

export const getProcessEntryLinkProps = (
  props: Pick<ProcessEntryProps, 'processLink' | 'dropSignFileKey'>,
) => {
  const { processLink, dropSignFileKey } = props

  return {
    ...(!dropSignFileKey && {
      href: processLink,
      icon: 'external' as IconTypesDeprecated,
    }),
    ...(dropSignFileKey && {
      onClick: () => openDocument(dropSignFileKey),
    }),
  }
}

export const ProcessEntry: FC<ProcessEntryProps> = ({
  processTitle,
  processLink,
  dropSignFileKey,
  type,
  buttonText,
}) => {
  const label = Titles[type]

  // Add keyframes if they don't exist. This can hopefully be moved to globalStyle
  // in the treat file if this gets fixed: https://github.com/seek-oss/treat/issues/137
  useEffect(() => {
    const dataAttr = 'data-fillandsign-keyframes'
    if (dropSignFileKey && !document.querySelector(`style[${dataAttr}]`)) {
      const el = document.createElement('style')
      el.innerHTML = fillAndSignKeyframes
      el.setAttribute(dataAttr, '')
      document.getElementsByTagName('head')[0].appendChild(el)
    }
  }, [dropSignFileKey])

  const buttonProps = getProcessEntryLinkProps({ processLink, dropSignFileKey })

  return (
    <Box width="full" background="blue100" borderRadius="large">
      <GridRow className={styles.row}>
        <GridColumn
          className={styles.column}
          span={['9/9', '9/9', '9/9', '9/9', '7/9']}
          offset={['0', '0', '0', '0', '1/9']}
        >
          <Box
            paddingY={4}
            paddingX={[3, 3, 3, 3, 0]}
            display="flex"
            flexGrow={1}
            flexDirection={['column', 'column', 'row', 'row', 'row']}
          >
            <Box flexGrow={1}>
              <Stack space={1}>
                {Boolean(label) && (
                  <Text variant="eyebrow" color="blue400">
                    {label}
                  </Text>
                )}
                <Text variant="h3" as="h3">
                  {processTitle}
                </Text>
              </Stack>
            </Box>
            <Box
              flexShrink={0}
              paddingTop={[3, 3, 3, 3, 0]}
              paddingLeft={[0, 0, 0, 0, 8]}
              alignItems="flexStart"
              justifyContent="flexStart"
            >
              <Button noWrap {...buttonProps}>
                {buttonText}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
    </Box>
  )
}

export default ProcessEntry
