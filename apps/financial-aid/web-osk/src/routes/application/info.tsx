import React from 'react'
import { Text } from '@island.is/island-ui/core'

import { FormContentContainer, FormFooter, FormLayout } from '../../components'

import * as styles from './info.treat'

const ApplicationInfo = () => {
  return (
    <FormLayout activeSection={0}>
      <FormContentContainer>
        <Text as="h1" variant="h1">
          Gagnaöflun
        </Text>
        <Text>Halloooo</Text>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter hidePreviousButton={true} nextUrl="/umsokn/netfang" />
      </FormContentContainer>
    </FormLayout>
  )
}

export default ApplicationInfo
