import { Box, Button, Text, Inline } from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { TableRow } from '../../components/TableRow/TableRow'
import { CREATE_FORM, GET_FORMS } from '@island.is/form-system/graphql'
import { FormsLoaderResponse } from './Forms.loader'
import { useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { FormsHeader } from '../../components/Header/FormsHeader'
import { FormSystemForm } from '@island.is/api/schema'
import { useEffect, useState } from 'react'
import { TableHeader } from '../../components/TableRow/TableHeader'

export const Forms = () => {
  const navigate = useNavigate()
  const { forms } = useLoaderData() as FormsLoaderResponse
  // const { data, refetch } = useQuery(GET_FORMS,)
  const { formatMessage } = useIntl()
  // const [formSystemCreateFormMutation] = useMutation(CREATE_FORM, {
  //   onCompleted: () => {
  //     refetch()
  //   },
  // })

  // useEffect(() => {
  //   refetch()
  // })

  // const { data } = useQuery(GET_FORMS)

  // const forms: FormSystemForm[] = data?.formSystemGetAllForms?.forms

  // const { data, refetch } = useQuery(GET_FORMS)
  const [formsState, setFormsState] = useState<FormSystemForm[]>(forms)

  // const [formSystemCreateFormMutation] = useMutation(CREATE_FORM, {
  //   onCompleted: (newFormData) => {
  //     if (newFormData?.formSystemCreateForm?.form) {
  //       setFormsState((prevForms) => [
  //         ...prevForms,
  //         newFormData.formSystemCreateForm.form,
  //       ])
  //     }
  //     refetch() // Refetch the data after mutation
  //   },
  // })

  // useEffect(() => {
  //   console.log('formsState', formsState)
  // }, [formsState])

  if (forms) {
    return (
      <>
        {/* Title and buttons  */}
        {/* <div>
          <Text variant="h2">{formatMessage(m.forms)}</Text>
        </div> */}
        {/* <Box marginTop={5}> */}
        {/* <Inline space={2}> */}
        <FormsHeader setFormsState={setFormsState} />
        {/* <Button
          variant="ghost"
          size="medium"
          onClick={async () => {
            const { data } = await formSystemCreateFormMutation()
            navigate(
              FormSystemPaths.Form.replace(
                ':formId',
                String(data?.formSystemCreateForm?.form?.id),
              ),
            )
          }}
        >
          {formatMessage(m.newForm)}
        </Button> */}
        {/* </Inline> */}
        {/* </Box> */}

        {/* <Box marginTop={5}></Box> */}

        {/* <Box marginTop={5}>
          <Box width="half"></Box>
        </Box> */}
        <TableHeader />
        {forms &&
          formsState.map((f) => {
            // console.log('formId', f.id)
            return (
              <TableRow
                key={f?.id}
                id={f?.id}
                name={f?.name?.is ?? ''}
                org={f?.organizationId}
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
