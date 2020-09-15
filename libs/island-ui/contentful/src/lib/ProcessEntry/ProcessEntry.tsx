import React, { FC } from 'react'
import {
  Typography,
  Button,
  Box,
  GridRow,
  GridColumn,
  Stack,
} from '@island.is/island-ui/core'
import * as styles from './ProcessEntry.treat'

export const Titles: { [k: string]: string } = {
  // TODO: translating these requires some effort
  Digital: 'Stafræn umsókn',
  'Digital w/login': 'Aðgangsstýrð stafræn umsókn',
  'Not digital': 'Handvirk umsókn',
  'Not digital w/login': 'Handvirk umsókn með innskráningu',
  'No type': '',
}

interface ProcessEntryProps {
  processTitle: string
  processLink: string
  type: string
  buttonText: string
}

export const ProcessEntry: FC<ProcessEntryProps> = ({
  processTitle,
  processLink,
  type,
  buttonText,
}) => {
  const eyebrow = Titles[type]

  return (
    <Box background="blue100" className={styles.container}>
      <GridRow>
        <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
          <Box display="flex" flexDirection={['column', 'column', 'row']}>
            <Box flexGrow={1}>
              <Stack space={1}>
                {Boolean(eyebrow) && (
                  <Typography variant="eyebrow" as="p" color="blue400">
                    {eyebrow}
                  </Typography>
                )}
                <Typography variant="h3" as="h3">
                  {processTitle}
                </Typography>
              </Stack>
            </Box>
            <Box
              flexShrink={0}
              paddingTop={[3, 3, 0]}
              paddingLeft={[0, 0, 4, 8]}
            >
              <Button noWrap href={processLink} icon="external">
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
