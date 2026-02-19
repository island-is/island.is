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
  const {
    control,
    controlDispatch,
    setFocus,
    focus,
    formUpdate,
    getTranslation,
  } = useContext(ControlContext)
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
            onFocus={async (e) => {
              if (!form?.name?.en && form?.name?.is !== '') {
                const translation = await getTranslation(form.name.is ?? '')
                controlDispatch({
                  type: 'CHANGE_FORM_NAME',
                  payload: { lang: 'en', newValue: translation.translation },
                })
              }
              setFocus(e.target.value)
            }}
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
              const response: UpdateFormResponse = await formUpdate()
              if (response && response.errors) {
                setErrorMsg(response.errors[0].message as string)
              } else {
                setErrorMsg('')
              }
            }}
            onChange={(e) => {
              const input = e.target as HTMLInputElement
              const cursor = input.selectionStart ?? 0
              const removed = (input.value.slice(0, cursor).match(/\//g) || [])
                .length
              const nextValue = input.value.replaceAll('/', '')
              controlDispatch({
                type: 'CHANGE_SLUG',
                payload: { newValue: nextValue },
              })
              // Restore cursor after React reconciles the value
              requestAnimationFrame(() => {
                input.setSelectionRange(cursor - removed, cursor - removed)
              })
            }}
          />
        </Column>
      </Row>
      <Box marginTop={5} />
      <Row>
        <Column span="5/10">
          <Input
            label={formatMessage(m.daysUntilExpiration)}
            placeholder={formatMessage(m.max30Days)}
            name="applicationsDaysToRemove"
            value={
              form.daysUntilApplicationPrune === 0
                ? ''
                : form.daysUntilApplicationPrune ?? ''
            }
            backgroundColor="blue"
            type="number"
            max={30}
            min={1}
            onFocus={(e) => setFocus(e.target.value)}
            onBlur={(e) => {
              if (e.target.value !== focus) {
                if (e.target.value === '' || Number(e.target.value) < 1) {
                  e.target.value = '1'
                  controlDispatch({
                    type: 'CHANGE_DAYS_UNTIL_APPLICATION_PRUNE',
                    payload: { value: 1 },
                  })
                  formUpdate({ ...form, daysUntilApplicationPrune: 1 })
                } else {
                  formUpdate()
                }
              }
            }}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (value <= 30) {
                controlDispatch({
                  type: 'CHANGE_DAYS_UNTIL_APPLICATION_PRUNE',
                  payload: { value: parseInt(e.target.value) },
                })
              }
            }}
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
              form.allowProceedOnValidationFail !== null &&
              form.allowProceedOnValidationFail !== undefined
                ? form.allowProceedOnValidationFail
                : false
            }
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_ALLOW_PROCEED_ON_VALIDATION_FAIL',
                payload: {
                  value: e.target.checked,
                  update: formUpdate,
                },
              })
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Checkbox
            label={formatMessage(m.summaryScreen)}
            checked={
              form.hasSummaryScreen !== null &&
              form.hasSummaryScreen !== undefined
                ? form.hasSummaryScreen
                : false
            }
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_HAS_SUMMARY_SCREEN',
                payload: {
                  value: e.target.checked,
                  update: formUpdate,
                },
              })
            }}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <Checkbox
            label={formatMessage(m.payment)}
            checked={
              form.hasPayment !== null && form.hasPayment !== undefined
                ? form.hasPayment
                : false
            }
            onChange={(e) => {
              controlDispatch({
                type: 'CHANGE_HAS_PAYMENT',
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
