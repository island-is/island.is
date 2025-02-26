import { Box, Button, Text, Inline } from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { TableRow } from '../../components/TableRow/TableRow'
import { CREATE_FORM } from '@island.is/form-system/graphql'
import { FormsLoaderResponse } from './Forms.loader'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { useState } from 'react'
import { FormSystemForm } from '@island.is/api/schema'
import { FormsHeader } from './FormsHeader'
import { TableRowHeader } from '../../components/TableRow/TableRowHeader'

export const Forms = () => {
  const navigate = useNavigate()
  const { forms } = useLoaderData() as FormsLoaderResponse
  const { formatMessage } = useIntl()
  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM)

  const [formsState, setFormsState] = useState<FormSystemForm[]>(forms)

  if (forms) {
    return (
      <>
        <FormsHeader setFormsState={setFormsState} />

        <Box marginTop={5}></Box>

        <TableRowHeader />
        {forms &&
          formsState?.map((f) => {
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
                setFormsState={setFormsState}
              />
            )
          })}
      </>
    )
  }
  return <></>
}

export default Forms
