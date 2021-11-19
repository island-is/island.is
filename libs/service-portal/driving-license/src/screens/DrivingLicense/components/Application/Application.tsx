import React from 'react'
import { Link } from 'react-router-dom'
import { MessageDescriptor } from 'react-intl'

import { useLocale, useNamespaces } from '@island.is/localization'
import { ServicePortalPath, m } from '@island.is/service-portal/core'
import {
  Box,
  GridColumn,
  GridRow,
  ArrowLink,
  Text,
} from '@island.is/island-ui/core'

interface PropTypes {
  heading: MessageDescriptor | string
  subText: MessageDescriptor | string
}

function Application({ heading, subText }: PropTypes): JSX.Element {
  useNamespaces('sp.driving-license')
  const { formatMessage } = useLocale()

  return (
    <GridRow>
      <GridColumn span="12/12" order={[2, 2, 1]}>
        <Box
          display="flex"
          flexDirection="column"
          height="full"
          justifyContent="center"
          marginTop={[3, 3, 0]}
        >
          <Box marginBottom={2}>
            <Text variant="h4" as="h2">
              {formatMessage(heading)}
            </Text>
          </Box>
          <Text marginBottom={[3, 4]}>{formatMessage(subText)}</Text>
          <Box>
            <Link to={ServicePortalPath.ApplicationDrivingLicense}>
              <ArrowLink>{formatMessage(m.continue)}</ArrowLink>
            </Link>
          </Box>
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export default Application
