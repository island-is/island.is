import React, { useEffect, useState, useCallback } from 'react'
import { Text, Icon, Box, Checkbox } from '@island.is/island-ui/core'

import {
  FormContentContainer,
  FormFooter,
  FormLayout,
} from '@island.is/financial-aid-web/osk/src/components'
import * as styles from './confirmation.treat'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/useFormNavigation'
import { NavigationProps } from '@island.is/financial-aid/types'

const Confirmation = () => {
  const router = useRouter()

  const [accept, setAccept] = useState(false)
  const [error, setError] = useState(false)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  return (
    <FormLayout activeSection={navigation?.activeSectionIndex}>
      <FormContentContainer>
        <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
          Staðfesting
        </Text>

        <Text as="h1" variant="h2" marginBottom={[3, 3, 5]}>
          TODO
        </Text>
      </FormContentContainer>

      <FormFooter
        previousIsDestructive={true}
        nextButtonText="Staðfesta"
        nextButtonIcon="checkmark"
        onNextButtonClick={() => {
          if (!accept) {
            setError(true)
          } else {
            router.push(navigation?.nextUrl ?? '/')
          }
        }}
      />
    </FormLayout>
  )
}

export default Confirmation
