import { useContext, useState } from 'react'
import {
  Box,
  Input,
  RadioButton,
  Stack,
  Text,
  Button,
  Divider,
  Checkbox,
} from '@island.is/island-ui/core'
import { m } from '@island.is/form-system/ui'
import { ControlContext } from '../../../../context/ControlContext'
import { useIntl } from 'react-intl'

export const SubmissionUrls = () => {
  const { formatMessage } = useIntl()
  const {
    control,
    controlDispatch,
    formUpdate,
    submissionUrls,
    setSubmissionUrls,
    submissionUrlInput,
    setSubmissionUrlInput,
  } = useContext(ControlContext)
  const { form } = control

  const [showInput, setShowInput] = useState(false)

  const sanitizeId = (url: string) => url.replace(/[^a-zA-Z0-9-_]/g, '-')

  return (
    <Stack space={2}>
      {!showInput && !submissionUrlInput && (
        <Box marginTop={7}>
          <Button onClick={() => setShowInput(true)} variant="ghost">
            {formatMessage(m.addFormUrl)}
          </Button>
        </Box>
      )}

      {(showInput || submissionUrlInput) && (
        <Box marginTop={7}>
          <Input
            label={formatMessage(m.newFormUrlButton)}
            placeholder="IS/..."
            name="submission-url"
            value={submissionUrlInput}
            backgroundColor="white"
            onChange={(e) => {
              setSubmissionUrlInput(e.target.value)
            }}
          />
          <Box marginTop={2}>
            <Text variant="small">
              {formatMessage(m.urlReuseEncouragement)}
            </Text>
          </Box>
          <Box marginTop={2}>
            <Text variant="small">
              {formatMessage(m.urlFormatInstruction)} <strong>IS/</strong>
            </Text>
          </Box>
        </Box>
      )}

      {submissionUrlInput && (
        <RadioButton
          label={submissionUrlInput}
          large
          name="submissionUrl"
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
                name="submissionUrl"
                id={`submission-url-${sanitizeId(url ?? '')}`}
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

      <RadioButton
        label="Zendesk"
        large
        name="submissionUrl"
        id="zendesk"
        checked={form.submissionServiceUrl === 'zendesk'}
        onChange={(e) => {
          controlDispatch({
            type: 'CHANGE_SUBMISSION_URL',
            payload: { value: e.target.id },
          })
          formUpdate({ ...form, submissionServiceUrl: e.target.id })
        }}
      />

      {form.submissionServiceUrl === 'zendesk' && (
        <Checkbox
          label={formatMessage(m.zendeskPrivate)}
          checked={!!form.zendeskInternal}
          onChange={(e) => {
            controlDispatch({
              type: 'CHANGE_ZENDESK_INTERNAL',
              payload: { value: e.target.checked },
            })
            formUpdate({ ...form, zendeskInternal: e.target.checked })
          }}
        />
      )}

      {form.submissionServiceUrl && form.submissionServiceUrl !== 'zendesk' && (
        <>
          <Checkbox
            label={formatMessage(m.useValidate)}
            checked={!!form.useValidate}
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_USE_VALIDATE',
                payload: { value: e.target.checked },
              })
              formUpdate({ ...form, useValidate: e.target.checked })
            }}
          />
          <Checkbox
            label={formatMessage(m.usePopulate)}
            checked={!!form.usePopulate}
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_USE_POPULATE',
                payload: { value: e.target.checked },
              })
              formUpdate({ ...form, usePopulate: e.target.checked })
            }}
          />
        </>
      )}
    </Stack>
  )
}
