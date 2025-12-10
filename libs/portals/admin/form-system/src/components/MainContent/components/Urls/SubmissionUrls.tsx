import { useContext, useEffect, useState } from 'react'
import {
  Box,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import { ControlContext } from '../../../../context/ControlContext'
import { useIntl } from 'react-intl'
import {
  CREATE_FORM_URL,
  DELETE_FORM_URL,
} from '@island.is/form-system/graphql'
import { useMutation } from '@apollo/client'

export const SubmissionUrls = () => {
  const { formatMessage } = useIntl()
  const {
    control,
    submitUrls,
    controlDispatch,
    formUpdate,
    setFocus,
    focus,
    submissionUrls,
    setSubmissionUrls,
    submissionUrlInput,
    setSubmissionUrlInput,
  } = useContext(ControlContext)
  const { form } = control

  return (
    <Stack space={2}>
      <Box marginTop={6} marginBottom={4}>
        <Input
          label="Ný slóð fyrir innsendingar"
          placeholder="/r1/IS/..."
          name="submission-url"
          value={submissionUrlInput}
          backgroundColor="white"
          onChange={(e) => {
            setSubmissionUrlInput(e.target.value)
          }}
        />
      </Box>

      {submissionUrlInput && (
        <RadioButton
          label={submissionUrlInput}
          large
          name="customSubmissionUrl"
          id="customSubmissionUrl"
          checked={form.submissionServiceUrl === submissionUrlInput}
          onChange={() => {
            controlDispatch({
              type: 'CHANGE_SUBMISSION_URL',
              payload: { value: submissionUrlInput },
            })
            formUpdate({ ...form, submissionServiceUrl: submissionUrlInput })
            setSubmissionUrls((prevUrls) => {
              const next = submissionUrlInput.trim()
              if (!next) return prevUrls
              return prevUrls.includes(next) ? prevUrls : [next, ...prevUrls]
            })
          }}
        />
      )}

      {submissionUrls?.map(
        (url) =>
          url !== submissionUrlInput && (
            <Box key={url}>
              <RadioButton
                label={url}
                large
                name={url ?? undefined}
                id={url ?? undefined}
                checked={form.submissionServiceUrl === url}
                onChange={() => {
                  controlDispatch({
                    type: 'CHANGE_SUBMISSION_URL',
                    payload: { value: url ?? '' },
                  })
                  formUpdate({ ...form, submissionServiceUrl: url ?? '' })
                }}
              />
            </Box>
          ),
      )}

      <Box>
        <RadioButton
          label="Zendesk"
          large
          name="zendesk"
          id="zendesk"
          checked={form.submissionServiceUrl === 'zendesk'}
          onChange={(e) => {
            controlDispatch({
              type: 'CHANGE_SUBMISSION_URL',
              payload: { value: e.target.name },
            })
            formUpdate({ ...form, submissionServiceUrl: e.target.name })
          }}
        />
      </Box>
    </Stack>
  )

  // const [formUrls, setFormUrls] = useState<string[]>(
  //   (form.urls ?? []).filter((url): url is string => typeof url === 'string'),
  // )

  // useEffect(() => {
  //   controlDispatch({
  //     type: 'UPDATE_FORM_URLS',
  //     payload: { newValue: formUrls },
  //   })
  // }, [formUrls])

  // const [deleteUrl] = useMutation(DELETE_FORM_URL)
  // const [formSystemCreateFormUrlMutation] = useMutation(CREATE_FORM_URL, {
  //   onCompleted: (newUrlData) => {
  //     if (newUrlData?.createFormSystemFormUrl) {
  //       setFormUrls((prevUrls) => [
  //         ...prevUrls,
  //         newUrlData.createFormSystemFormUrl.organizationUrlId,
  //       ])
  //     }
  //   },
  // })

  // const handleCreateFormUrl = async (organizationUrlId: string) => {
  //   try {
  //     await formSystemCreateFormUrlMutation({
  //       variables: {
  //         input: {
  //           organizationUrlId,
  //           formId: form?.id,
  //         },
  //       },
  //     })
  //   } catch (error) {
  //     throw new Error(
  //       `Error creating form URL: ${
  //         error instanceof Error ? error.message : 'Unknown error'
  //       }`,
  //     )
  //   }
  // }

  // const handleDeleteFormUrl = async (organizationUrlId: string) => {
  //   try {
  //     await deleteUrl({
  //       variables: {
  //         input: {
  //           organizationUrlId,
  //           formId: form?.id,
  //         },
  //       },
  //     })
  //     setFormUrls((prevUrls) =>
  //       prevUrls.filter((url) => url !== organizationUrlId),
  //     )
  //   } catch (error) {
  //     throw new Error(
  //       `Error deleting form URL: ${
  //         error instanceof Error ? error.message : 'Unknown error'
  //       }`,
  //     )
  //   }
  // }

  // return (
  //   <Box marginTop={6}>
  //     <Text variant="h4">
  //       Veldu þær slóðir sem þú vilt nota fyrir þessa umsókn
  //     </Text>
  //     <GridRow>
  //       <GridColumn span="5/10">
  //         <Box marginTop={3}>
  //           <strong>{formatMessage(m.prodUrl)}</strong>
  //           {submitUrls &&
  //             submitUrls
  //               ?.filter((url) => !url?.isTest)
  //               .map((url) => (
  //                 <Box
  //                   key={url?.id}
  //                   display="flex"
  //                   alignItems="center"
  //                   marginTop={1}
  //                 >
  //                   <Checkbox
  //                     checked={formUrls?.some((u) => u === url?.id)}
  //                     onChange={async (e) => {
  //                       if (typeof url?.id === 'string') {
  //                         if (e.target.checked) {
  //                           await handleCreateFormUrl(url.id)
  //                         } else {
  //                           await handleDeleteFormUrl(url.id)
  //                         }
  //                       }
  //                     }}
  //                     name={`prod-url-${url?.id}`}
  //                     label={url?.url}
  //                   />
  //                 </Box>
  //               ))}
  //         </Box>
  //       </GridColumn>
  //       <GridColumn span="5/10">
  //         <Box marginTop={3}>
  //           <strong>{formatMessage(m.devUrl)}</strong>
  //           {submitUrls &&
  //             submitUrls
  //               ?.filter((url) => url?.isTest)
  //               .map((url) => (
  //                 <Box
  //                   key={url?.id}
  //                   display="flex"
  //                   alignItems="center"
  //                   marginTop={1}
  //                 >
  //                   <Checkbox
  //                     checked={formUrls?.some((u) => u === url?.id)}
  //                     onChange={async (e) => {
  //                       if (typeof url?.id === 'string') {
  //                         if (e.target.checked) {
  //                           await handleCreateFormUrl(url.id)
  //                         } else {
  //                           await handleDeleteFormUrl(url.id)
  //                         }
  //                       }
  //                       controlDispatch({
  //                         type: 'SET_IS_ZENDESK_ENABLED',
  //                         payload: {
  //                           value: e.target.checked,
  //                         },
  //                       })
  //                     }}
  //                     name={`test-url-${url?.id}`}
  //                     label={url?.url}
  //                   />
  //                 </Box>
  //               ))}
  //         </Box>
  //       </GridColumn>
  //     </GridRow>
  //   </Box>
  // )
}
