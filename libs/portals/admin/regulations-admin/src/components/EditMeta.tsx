import {
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
import { getNextWorkday, getMinPublishDate } from '../utils'

export const EditMeta = () => {
  const { formatMessage: t } = useLocale()
  const { draft, actions } = useDraftingState()
  const { updateState } = actions

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
              handleChange={(date: Date) =>
                updateState('idealPublishDate', date)
              }
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
              minDate={draft.idealPublishDate.value || null}
              selected={
                draft.effectiveDate.value
                  ? getNextWorkday(draft.effectiveDate.value)
                  : undefined
              }
              handleChange={(date: Date) =>
                actions.updateState('effectiveDate', date)
              }
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
                }}
              >
                {t(msg.effectiveDate_default)}
              </Button>
            )}
          </Box>
        </Column>
      </Columns>

      <LawChaptersSelect />
    </>
  )
}
