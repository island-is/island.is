import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

import { FormContext } from '../FormProvider/FormProvider'

interface Props {
  dataTestid?: string
}

const OverviewHeader: React.FC<Props> = (props) => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { dataTestid } = props

  return (
    <Box marginBottom={1} data-testid={dataTestid}>
      <Text as="h1" variant="h1">
        {titleForCase(formatMessage, workingCase)}
      </Text>
    </Box>
  )
}

export default OverviewHeader
