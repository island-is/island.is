import { useContext, useState } from 'react'
import {
  Box,
  Input,
  RadioButton,
  Stack,
  Text,
  Button,
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
        <Box marginTop={4}>
          <Button onClick={() => setShowInput(true)} variant="ghost">
            {formatMessage(m.addFormUrl)}
          </Button>
        </Box>
      )}

      {(showInput || submissionUrlInput) && (
        <Box marginTop={4}>
          <Text variant="eyebrow">
            Athugið að á meðan við vinnum að tengingum við ytri kerfi er
            einungis er í boði að nota tengingar við Zendesk
          </Text>
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

      <Box>
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
      </Box>
    </Stack>
  )
}
