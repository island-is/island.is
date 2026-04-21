import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { UPDATE_FIELD } from '@island.is/form-system/graphql'
import { m } from '@island.is/form-system/ui'
import {
  Box,
  Button,
  Checkbox,
  Input,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { ControlContext } from '../../../../context/ControlContext'

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
  const { form, isReadOnly } = control
  const [updateField] = useMutation(UPDATE_FIELD)
  const [showInput, setShowInput] = useState(false)

  const sanitizeId = (url: string) => url.replace(/[^a-zA-Z0-9-_]/g, '-')

  const persistZendeskApplicantRequirements = async () => {
    const applicantFields = (control.form.fields ?? []).filter(
      (f): f is FormSystemField => !!f && f.fieldType === 'APPLICANT',
    )

    const toUpdate = applicantFields.filter((f) => {
      const fs = f.fieldSettings as Record<string, unknown> | null | undefined
      return fs?.isPhoneRequired != null && fs?.isEmailRequired != null
    })

    const results = await Promise.allSettled(
      toUpdate.map((field) =>
        updateField({
          variables: {
            input: {
              id: field.id,
              updateFieldDto: {
                fieldSettings: {
                  ...(field.fieldSettings ?? {}),
                  isEmailRequired: true,
                },
              },
            },
          },
        }),
      ),
    )
    const failures = results.filter((r) => r.status === 'rejected')
    if (failures.length > 0) {
      throw new Error(
        `Failed to persist Zendesk applicant requirements: ${JSON.stringify(
          failures,
        )}`,
      )
    }
  }

  return (
    <Stack space={2}>
      {!showInput && !submissionUrlInput && (
        <Box marginTop={7}>
          <Button
            onClick={() => setShowInput(true)}
            variant="ghost"
            disabled={isReadOnly}
          >
            {formatMessage(m.addFormUrl)}
          </Button>
        </Box>
      )}

      {(showInput || submissionUrlInput) && (
        <Box marginTop={7}>
          <Input
            label={formatMessage(m.newFormUrlButton)}
            placeholder="/r1/IS/..."
            name="submission-url"
            value={submissionUrlInput}
            readOnly={isReadOnly}
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
              {formatMessage(m.urlFormatInstruction)} <strong>/r1/IS/</strong>
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
          disabled={isReadOnly}
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
                disabled={isReadOnly}
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
        disabled={isReadOnly}
        onChange={async (e) => {
          controlDispatch({
            type: 'CHANGE_SUBMISSION_URL',
            payload: { value: e.target.id },
          })
          formUpdate({ ...form, submissionServiceUrl: e.target.id })
          await persistZendeskApplicantRequirements()
        }}
      />

      {form.submissionServiceUrl === 'zendesk' && (
        <Checkbox
          label={formatMessage(m.zendeskPrivate)}
          checked={!!form.zendeskInternal}
          disabled={isReadOnly}
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
            disabled={isReadOnly}
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
            disabled={isReadOnly}
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
