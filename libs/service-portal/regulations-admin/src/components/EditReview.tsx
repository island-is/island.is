import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  DatePicker,
  Divider,
  Inline,
  Option,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { StepComponent } from '../state/useDraftingState'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { buttonsMsgs as msg } from '../messages'
import {
  emptyOption,
  findAffectedRegulationsInText,
  findValueOption,
} from '../utils'
import { RegName } from '@island.is/regulations'

import { mockRegulationOptions, useMockQuery } from '../_mockData'

// const RegulationListQuery = gql`
//   query RegulationListQuery {
//     getRegulationList
//   }
// `

// ---------------------------------------------------------------------------

export const EditReview: StepComponent = (props) => {
  const { draft, actions } = props
  // const { ... } = actions
  const t = useIntl().formatMessage

  return (
    <Box marginY={[4, 4, 8]}>
      <Text>Vinsamlega staðfestu að reglugerðin sé rétt skráð, ...</Text>
      <Text marginBottom={[4, 4, 8]}>(Hér á eftir að hanna yfirlit...)</Text>
      <Inline space={[2, 2, 3, 4]} align="center" alignY="center">
        <Button icon="document">{t(msg.publish)}</Button>
      </Inline>
    </Box>
  )
}
