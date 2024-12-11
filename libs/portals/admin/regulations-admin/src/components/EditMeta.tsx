import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Column,
  Columns,
  DatePicker,
  Input,
} from '@island.is/island-ui/core'
import { editorMsgs as msg } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { LawChaptersSelect } from './LawChaptersSelect'
import { useDraftingState } from '../state/useDraftingState'
import { RegulationDraftTypes } from '../types'
import {
  getNextWorkday,
  getMinPublishDate,
  hasPublishEffectiveWarning,
  getWorkdayMinimumDate,
} from '../utils'
import { useEffect, useState } from 'react'

export const EditMeta = () => {
  const { formatMessage: t } = useLocale()
  const { draft, actions } = useDraftingState()
  const [hasSetDate, setHasSetDate] = useState(false)
  const { updateState } = actions

  useEffect(() => {
    if (
      !hasSetDate &&
      !draft.effectiveDate.value &&
      !draft.idealPublishDate.value
    ) {
      // Set default dates if no dates are set
      const defaultEffectiveDate = getWorkdayMinimumDate(11)
      const defaultPublishDate = getWorkdayMinimumDate(10)
      updateState('effectiveDate', defaultEffectiveDate)
      updateState('idealPublishDate', defaultPublishDate)
      setHasSetDate(true)
    }
  }, [hasSetDate, draft.effectiveDate.value, draft.idealPublishDate.value])

  const type = draft.type
  const typeName =
    type.value &&
    t(
      type.value === RegulationDraftTypes.amending
        ? msg.type_amending
        : msg.type_base,
    )

  return (
    <>
      <Columns space={3} collapseBelow="lg">
        <Column width="6/12">
          <Box marginBottom={3}>
            <Input
              label={t(msg.type)}
              value={typeName || ''}
              placeholder={t(msg.typePlaceholder)}
              name="_type"
              size="sm"
              readOnly
              hasError={type.showError && !!type.error}
              errorMessage={type.error && t(type.error)}
            />
          </Box>
        </Column>
      </Columns>
      <Box marginBottom={3}>
        <Columns space={3} collapseBelow="lg">
          <Column width="4/12">
            {/* idealPublishDate Input */}
            <DatePicker
              size="sm"
              label={t(msg.idealPublishDate)}
              placeholderText={t(msg.idealPublishDate_default)}
              minDate={getMinPublishDate(
                draft.fastTrack.value,
                draft.signatureDate.value,
              )}
              selected={draft.idealPublishDate.value}
              handleChange={(date: Date) => {
                updateState('idealPublishDate', date)
                setHasSetDate(true)
              }}
              hasError={
                draft.idealPublishDate.showError &&
                !!draft.idealPublishDate.error
              }
              errorMessage={
                draft.idealPublishDate.error && t(draft.idealPublishDate.error)
              }
              backgroundColor="blue"
            />
          </Column>
          <Column width="4/12">
            {/* Request fastTrack */}
            <Box display="flex" height="full" alignItems="center">
              <Checkbox
                label={t(msg.applyForFastTrack)}
                labelVariant="default"
                checked={draft.fastTrack.value}
                onChange={() => {
                  updateState('fastTrack', !draft.fastTrack.value)
                  setHasSetDate(true)
                }}
              />
            </Box>
          </Column>
        </Columns>
      </Box>
      <Columns space={3} collapseBelow="lg">
        <Column width="4/12">
          <Box marginBottom={3}>
            <DatePicker
              size="sm"
              label={t(msg.effectiveDate)}
              placeholderText={t(msg.effectiveDate_default)}
              selected={draft.effectiveDate.value}
              handleChange={(date: Date) => {
                actions.updateState('effectiveDate', date)
                setHasSetDate(true)
              }}
              hasError={
                draft.effectiveDate.showError && !!draft.effectiveDate.error
              }
              errorMessage={
                draft.effectiveDate.error && t(draft.effectiveDate.error)
              }
              backgroundColor="blue"
            />
            {!!draft.effectiveDate.value && (
              <Button
                size="small"
                variant="text"
                preTextIcon="close"
                onClick={() => {
                  actions.updateState('effectiveDate', undefined)
                  setHasSetDate(true)
                }}
              >
                {t(msg.effectiveDate_default)}
              </Button>
            )}
          </Box>
        </Column>
      </Columns>
      {hasPublishEffectiveWarning(
        draft.effectiveDate.value,
        draft.idealPublishDate.value,
        draft.fastTrack.value,
      ) ? (
        <Columns space={3} collapseBelow="lg">
          <Column width="content">
            <Box marginBottom={3}>
              <AlertMessage
                message={t(msg.publishEffectiveWarning)}
                type="default"
              />
            </Box>
          </Column>
        </Columns>
      ) : undefined}

      <LawChaptersSelect />
    </>
  )
}
