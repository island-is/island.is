import { Box, Button, Text, Inline } from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { TableRow } from '../../components/TableRow/TableRow'
import { CREATE_FORM } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import { FormsLoaderResponse } from './Forms.loader'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'



export const Forms = () => {
  const navigate = useNavigate()
  const { forms } = useLoaderData() as FormsLoaderResponse
  const { formatMessage } = useIntl()
  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM)
  if (forms) {
    return (
      <div>
        {/* Title and buttons  */}
        <div>
          <Text variant="h2">{formatMessage(m.templates)}</Text>
        </div>
        <Box marginTop={5}>
          <Inline space={2}>
            <Button
              variant="ghost"
              size="medium"
              onClick={async () => {
                const { data } = await formSystemCreateFormMutation({
                  variables: { input: { organizationId: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39' } },
                })
                console.log('createForm', data)
                navigate(
                  FormSystemPaths.Form.replace(
                    ':formId',
                    String(data?.formSystemCreateForm?.form?.id),
                  ),
                )
              }}
            >
              {formatMessage(m.newTemplate)}
            </Button>
          </Inline>
        </Box>

        <Box marginTop={5}></Box>

        <Box marginTop={5}>
          <Box width="half"></Box>
        </Box>
        <TableRow isHeader={true} />
        {forms &&
          forms?.map((f) => {
            console.log(f)
            return (
              <TableRow
                key={f?.id}
                id={f?.id}
                name={f?.name?.is ?? ''}
                org={f?.organizationId}
                isHeader={false}
                translated={f?.isTranslated ?? false}
                slug={f?.slug ?? ''}
              />
            )
          })}
      </div>
    )
  }
  return <></>
}

export default Forms
