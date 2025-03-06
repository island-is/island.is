import {
  Box,
  Button,
  Text,
  Inline,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { CREATE_FORM, GET_FORMS } from '@island.is/form-system/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FormSystemForm } from '@island.is/api/schema'

export const FormHeader = () => {
  const navigate = useNavigate()
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={4} marginLeft={2}>
      <Row>
        <Box marginRight={4}>
          <Button
            variant="ghost"
            size="default"
            onClick={async () => {
              navigate(FormSystemPaths.FormSystemRoot)
            }}
          >
            {formatMessage(m.back)}
          </Button>
        </Box>
      </Row>
    </Box>
  )
}
