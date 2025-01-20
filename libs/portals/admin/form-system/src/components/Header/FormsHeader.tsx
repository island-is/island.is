import {
  Box,
  Button,
  Text,
  Inline,
  GridRow as Row,
} from '@island.is/island-ui/core'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { FormSystemPaths } from '../../lib/paths'
import { TableRow } from '../TableRow/TableRow'
import { CREATE_FORM, GET_FORMS } from '@island.is/form-system/graphql'
// import { FormsLoaderResponse } from './Forms.loader'
import { useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FormSystemForm } from '@island.is/api/schema'

interface Props {
  setFormsState: Dispatch<SetStateAction<FormSystemForm[]>>
}

export const FormsHeader = (props: Props) => {
  const { setFormsState } = props
  const navigate = useNavigate()
  // const { forms } = useLoaderData() as FormsLoaderResponse
  const { formatMessage } = useIntl()
  // const [formSystemCreateFormMutation] = useMutation(CREATE_FORM)
  // const { data, refetch } = useQuery(GET_FORMS)
  // const [formSystemCreateFormMutation] = useMutation(CREATE_FORM, {
  //   onCompleted: (newFormData) => {
  //     if (newFormData?.formSystemCreateForm?.form) {
  //             setForms((prevForms) => [
  //               ...prevForms,
  //               newFormData.formSystemCreateForm.form,
  //             ])
  //           }
  //   },
  // })

  // const { data, refetch } = useQuery(GET_FORMS)
  // const [forms, setForms] = useState<FormSystemForm[]>([])

  const [formSystemCreateFormMutation] = useMutation(CREATE_FORM, {
    onCompleted: (newFormData) => {
      if (newFormData?.formSystemCreateForm?.form) {
        setFormsState((prevForms) => [
          ...prevForms,
          newFormData.formSystemCreateForm.form,
        ])
      }
    },
  })

  // useEffect(() => {
  //   if (data?.formSystemGetAllForms?.forms) {
  //     setForms(data.formSystemGetAllForms.forms)
  //   }
  // }, [data])

  return (
    <Box marginBottom={4} marginLeft={2}>
      <Row>
        <Box marginRight={4}>
          <Button
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
          </Button>
        </Box>
        <Box marginRight={4}>
          <Button variant="ghost" size="medium">
            {formatMessage(m.applications)}
          </Button>
        </Box>
      </Row>
    </Box>
  )
}
