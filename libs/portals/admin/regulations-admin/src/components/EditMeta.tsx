import {
  Box,
  Button,
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
import { getNextWorkday } from '../utils'

export const EditMeta = () => {
  const { formatMessage: t } = useLocale()
  const { draft, actions } = useDraftingState()

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
        <Column>
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

        <Column>
          <Box marginBottom={3}>
            <DatePicker
              size="sm"
              label={t(msg.effectiveDate)}
              placeholderText={t(msg.effectiveDate_default)}
              minDate={draft.idealPublishDate.value || null}
              selected={
                draft.idealPublishDate.value
                  ? getNextWorkday(draft.idealPublishDate.value)
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
