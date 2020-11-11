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

export const Titles: {
  [Digital: string]: { is: string; en: string }
} = {
  Digital: { is: 'Stafræn umsókn', en: 'Digital application' },
  'Digital w/login': {
    is: 'Aðgangsstýrð stafræn umsókn',
    en: 'Digital application with access control',
  },
  'Not digital': { is: 'Handvirk umsókn', en: 'Manual application' },
  'Not digital w/login': {
    is: 'Handvirk umsókn með innskráningu',
    en: 'Manual application with access control',
  },
  'No type': { is: '', en: '' },
}

export interface ProcessEntryProps {
  processTitle: string
  processLink: string
  openLinkInModal?: boolean
  type: string
  buttonText: string
  locale?: string
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
  locale = 'is',
}) => {
  const titleType = type && type.length > 0 ? type : 'No type'
  const localeType = locale && locale.length > 0 ? locale : 'is'
  const translatedLabel = Titles[titleType][localeType]
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
                  {Boolean(translatedLabel) && (
                    <Text variant="eyebrow" color="blue400">
                      {translatedLabel}
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
