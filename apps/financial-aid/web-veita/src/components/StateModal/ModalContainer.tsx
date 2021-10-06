import React, { useState } from 'react'
import { ModalBase, Text, Box } from '@island.is/island-ui/core'

import * as styles from './StateModal.treat'
import cn from 'classnames'

import {
  InputModal,
  OptionsModal,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  Application,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { useApplicationState } from '../../utils/useApplicationState'

interface Props {}

const ModalContainer = ({}: Props) => {
  const [selected, setSelected] = useState<ApplicationState | undefined>()

  return (
    <Box
      position="relative"
      borderRadius="large"
      overflow="hidden"
      background="white"
      className={styles.modal}
    >
      <Box
        paddingLeft={4}
        paddingY={2}
        background="blue400"
        className={styles.modalHeadline}
      >
        <Text fontWeight="semiBold" color="white">
          stöðubreyting
        </Text>
      </Box>
      <Box display="block" width="full" padding={4}>
        helo hvað er hér?
      </Box>
    </Box>
  )
}

export default ModalContainer
