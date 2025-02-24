import { Box, Button, Text, Inline } from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { TableRow } from '../../components/TableRow/TableRow'
import { CREATE_FORM } from '@island.is/form-system/graphql'
import { FormsLoaderResponse } from './Forms.loader'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'

export const Forms = () => {
  const navigate = useNavigate()
  const { forms } = useLoaderData() as FormsLoaderResponse
  const { formatMessage } = useIntl()
  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM)
  if (forms) {
    return (
      <div>
        <Box marginTop={5}></Box>

        <Box marginTop={5}>
          <Box width="half"></Box>
        </Box>
        <TableRow isHeader={true} />
        {forms &&
          forms?.map((f) => {
            return (
              <TableRow
                key={f?.id}
                id={f?.id}
                name={f?.name?.is ?? ''}
                org={f?.organizationId}
                isHeader={false}
                translated={f?.isTranslated ?? false}
                slug={f?.slug ?? ''}
                beenPublished={f?.beenPublished ?? false}
              />
            )
          })}
      </div>
    )
  }
  return <></>
}

export default Forms
