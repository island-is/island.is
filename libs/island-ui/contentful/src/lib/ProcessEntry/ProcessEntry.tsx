import React, { FC } from 'react'
import {
  Text,
  Button,
  Box,
  GridRow,
  GridColumn,
  Stack,
  Link,
  ButtonProps,
  ButtonTypes,
} from '@island.is/island-ui/core'
import IframeModal from '../IframeModal/IframeModal'

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
  openLinkInModal?: boolean
  type: string
  buttonText: string
}

export const ProcessEntryLinkButton: FC<
  Omit<ProcessEntryProps, 'type'> & ButtonProps & ButtonTypes
> = ({
  processTitle,
  buttonText,
  processLink,
  openLinkInModal,
  ...buttonProps
}) => {
  const button = (
    <Button icon="open" iconType="outline" {...buttonProps}>
      {buttonText}
    </Button>
  )

  return openLinkInModal ? (
    <IframeModal
      title={processTitle}
      baseId="process-entry-modal-iframe"
      disclosure={button}
      src={processLink}
    />
  ) : (
    <Link href={processLink}>{button}</Link>
  )
}

export const ProcessEntry: FC<ProcessEntryProps> = ({
  processTitle,
  processLink,
  openLinkInModal,
  type,
  buttonText,
}) => {
  const label = Titles[type]

  return (
    <>
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
              flexDirection={['column', 'column', 'column', 'row', 'row']}
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
                paddingLeft={[0, 0, 0, 4, 8]}
                alignItems="flexStart"
                justifyContent="flexStart"
              >
                <ProcessEntryLinkButton
                  processTitle={processTitle}
                  processLink={processLink}
                  openLinkInModal={openLinkInModal}
                  buttonText={buttonText}
                />
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </>
  )
}

export default ProcessEntry
