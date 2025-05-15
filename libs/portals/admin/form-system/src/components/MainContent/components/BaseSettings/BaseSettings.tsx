import {
  Stack,
  GridRow as Row,
  GridColumn as Column,
  Input,
  DatePicker,
  Checkbox,
  Box,
} from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { useIntl } from 'react-intl'
import { m } from '@island.is/form-system/ui'
import { UpdateFormResponse } from '@island.is/form-system/shared'
import { convertToSlug } from '../../../../lib/utils/convertToSlug'

export const BaseSettings = () => {
  const { control, controlDispatch, setFocus, focus, formUpdate } =
    useContext(ControlContext)
  const { form } = control
  const { formatMessage } = useIntl()
  const [errorMsg, setErrorMsg] = useState('')

  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Input
            label={formatMessage(m.organizationName)}
            placeholder={formatMessage(m.organizationName)}
            name="organizationName"
            value={form?.organizationTitle ?? ''}
            disabled={true}
          />
        </Column>
        <Column span="5/10">
          <Input
            label={formatMessage(m.organizationNameEn)}
            placeholder={formatMessage(m.organizationNameEn)}
            name="organizationNameEn"
            value={form?.organizationTitleEn ?? ''}
            disabled={true}
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <Input
            label={formatMessage(m.organizationDisplayName)}
            placeholder={formatMessage(m.organizationDisplayName)}
            name="organizationDisplayName"
            value={form?.organizationDisplayName?.is ?? ''}
            backgroundColor="blue"
            onFocus={(e) => {
              if (!form.organizationDisplayName?.is) {
                controlDispatch({
                  type: 'CHANGE_ORGANIZATION_DISPLAY_NAME',
                  payload: {
                    lang: 'is',
                    newValue: form?.organizationTitle ?? '',
                  },
                })
              }
              setFocus(e.target.value)
            }}
            onBlur={(e) => e.target.value !== focus && formUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_ORGANIZATION_DISPLAY_NAME',
                payload: {
                  lang: 'is',
                  newValue: e.target.value,
                },
              })
            }
          />
        </Column>
        <Column span="5/10">
          <Input
            label={formatMessage(m.organizationDisplayNameEn)}
            placeholder={formatMessage(m.organizationDisplayNameEn)}
            name="organizationDisplayNameEn"
            value={form?.organizationDisplayName?.en ?? ''}
            backgroundColor="blue"
            onFocus={(e) => {
              if (!form.organizationDisplayName?.en) {
                controlDispatch({
                  type: 'CHANGE_ORGANIZATION_DISPLAY_NAME',
                  payload: {
                    lang: 'en',
                    newValue: form?.organizationTitleEn ?? '',
                  },
                })
              }
              setFocus(e.target.value)
            }}
            onBlur={(e) => e.target.value !== focus && formUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_ORGANIZATION_DISPLAY_NAME',
                payload: { lang: 'en', newValue: e.target.value },
              })
            }
          />
        </Column>
      </Row>
      <Box marginTop={5} />
      <Row>
        <Column span="8/10">
          <Input
            label={formatMessage(m.applicationName)}
            placeholder={formatMessage(m.applicationName)}
            name="formName"
            value={form?.name?.is ?? ''}
            backgroundColor="blue"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formUpdate()}
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_FORM_NAME',
                payload: { lang: 'is', newValue: e.target.value },
              })
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column span="8/10">
          <Input
            label={formatMessage(m.applicationNameEnglish)}
            placeholder={formatMessage(m.applicationNameEnglish)}
            name="formNameEn"
            value={form?.name?.en ?? ''}
            backgroundColor="blue"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_FORM_NAME',
                payload: { lang: 'en', newValue: e.target.value },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column span="8/10">
          <Input
            label={formatMessage(m.slug)}
            placeholder={formatMessage(m.slug)}
            name="slug"
            value={form?.slug ?? ''}
            backgroundColor="blue"
            errorMessage={errorMsg}
            onFocus={(e) => {
              if (!form.slug) {
                controlDispatch({
                  type: 'CHANGE_SLUG',
                  payload: {
                    newValue: form?.name?.is ? convertToSlug(form.name.is) : '',
                  },
                })
              }
              setFocus(e.target.value)
            }}
            onBlur={async (e) => {
              if (e.target.value !== focus) {
                const response: UpdateFormResponse = await formUpdate()
                if (response.errors) {
                  setErrorMsg(response.errors[0].message as string)
                } else {
                  setErrorMsg('')
                }
              }
            }}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_SLUG',
                payload: { newValue: e.target.value },
              })
            }
          />
        </Column>
      </Row>
      <Box marginTop={5} />
      <Row>
        <Column span="5/10">
          <Input
            label={formatMessage(m.daysUntilExpiration)}
            placeholder={formatMessage(m.max120Days)}
            name="applicationsDaysToRemove"
            value={
              form.applicationDaysToRemove === 0
                ? ''
                : form.applicationDaysToRemove ?? ''
            }
            backgroundColor="blue"
            type="number"
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => e.target.value !== focus && formUpdate()}
            onChange={(e) =>
              controlDispatch({
                type: 'CHANGE_APPLICATION_DAYS_TO_REMOVE',
                payload: { value: parseInt(e.target.value) },
              })
            }
          />
        </Column>
      </Row>
      <Row>
        <Column span="5/10">
          <DatePicker
            label={formatMessage(m.deadline)}
            placeholderText={formatMessage(m.chooseDate)}
            backgroundColor="blue"
            selected={
              form.invalidationDate ? new Date(form.invalidationDate) : null
            }
            handleChange={(e) => {
              controlDispatch({
                type: 'CHANGE_INVALIDATION_DATE',
                payload: { value: e },
              })
            }}
            handleCloseCalendar={() => formUpdate()}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Checkbox
            label={formatMessage(m.allowProgress)}
            checked={
              form.stopProgressOnValidatingScreen !== null &&
              form.stopProgressOnValidatingScreen !== undefined
                ? form.stopProgressOnValidatingScreen
                : false
            }
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_STOP_PROGRESS_ON_VALIDATING_SCREEN',
                payload: {
                  value: e.target.checked,
                  update: formUpdate,
                },
              })
            }}
          />
        </Column>
      </Row>
    </Stack>
  )
}
