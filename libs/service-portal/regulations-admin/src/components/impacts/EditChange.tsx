import { useMutation } from '@apollo/client'
import {
  Button,
  Box,
  Divider,
  GridContainer,
  GridRow,
  GridColumn,
  BoxProps,
  FocusableBox,
  Text,
} from '@island.is/island-ui/core'
import React, { useEffect, useMemo, useState } from 'react'
import {
  AppendixDraftForm,
  AppendixFormSimpleProps,
  DraftChangeForm,
  RegDraftForm,
} from '../../state/types'
import {
  HTMLText,
  PlainText,
  RegName,
  Regulation,
  toISODate,
} from '@island.is/regulations'
import { LayoverModal } from './LayoverModal'
import { ImpactModalTitle } from './ImpactModalTitle'
import {
  useGetRegulationFromApiQuery,
  useGetRegulationImpactsQuery,
} from '../../utils/dataHooks'
import {
  CREATE_DRAFT_REGULATION_CHANGE,
  UPDATE_DRAFT_REGULATION_CHANGE,
} from './impactQueries'
import { MagicTextarea } from '../MagicTextarea'
import { MiniDiff } from '../MiniDiff'
import { EditorInput } from '../EditorInput'
import * as s from './Impacts.css'
import { ReferenceText } from './ReferenceText'
import { fHtml, fText, makeDraftAppendixForm } from '../../state/makeFields'
import { ImpactHistory } from './ImpactHistory'
import { Effects } from '../../types'
import { Appendixes } from '../Appendixes'
import { tidyUp, updateFieldValue } from '../../state/validations'
/* ---------------------------------------------------------------------------------------------------------------- */

export type HTMLBoxProps = BoxProps & {
  html: HTMLText
  dangerouslySetInnerHTML?: undefined
}

export const HTMLBox = (props: HTMLBoxProps) => {
  const { html, ...boxProps } = props
  return React.createElement(Box, {
    ...boxProps,
    dangerouslySetInnerHTML: { __html: html },
  })
}

/* ---------------------------------------------------------------------------------------------------------------- */

type EditChangeProp = {
  draft: RegDraftForm // Allt það sem er verið að breyta
  change: DraftChangeForm // Áhrifafærslan
  readOnly?: boolean
  closeModal: (updateImpacts?: boolean) => void
}

export const EditChange = (props: EditChangeProp) => {
  const { draft, change, closeModal, readOnly } = props
  const [activeChange, setActiveChange] = useState(change) // Áhrifafærslan sem er verið að breyta
  const [activeRegulation, setActiveRegulation] = useState<
    Regulation | undefined
  >() // Target reglugerðin sem á að breyta
  const [showEditor, setShowEditor] = useState(false)
  const today = toISODate(new Date())
  const minDate = toISODate(activeChange.minDate) ?? today
  const [createDraftRegulationChange] = useMutation(
    CREATE_DRAFT_REGULATION_CHANGE,
  )
  const [updateDraftRegulationChange] = useMutation(
    UPDATE_DRAFT_REGULATION_CHANGE,
  )

  // TODO: we need to refetch the regulation when activeChange.date is changed
  const { data: regulation } = useGetRegulationFromApiQuery(
    change.name,
    minDate,
  )
  useEffect(() => {
    setActiveRegulation(regulation)
  }, [regulation])

  const { data: draftImpacts } = useGetRegulationImpactsQuery(activeChange.name)

  const { effects } = useMemo(() => {
    const effects = activeRegulation?.history.reduce<Effects>(
      (obj, item) => {
        const arr = item.date > today ? obj.future : obj.past
        arr.push(item)
        return obj
      },
      { past: [], future: [] },
    )

    return {
      effects,
    }
  }, [activeRegulation, today])

  useEffect(() => {
    if (!change.id && !activeChange.title.value && activeRegulation) {
      setActiveChange({
        ...activeChange,
        text: fHtml(activeRegulation.text, true),
        title: fText(activeRegulation.title),
        appendixes: activeRegulation.appendixes.map((a, i) =>
          makeDraftAppendixForm(a, String(i)),
        ),
      })
    }
  }, [activeRegulation])

  useEffect(() => {
    setShowEditor(!!activeRegulation)
  }, [activeChange.date.value, activeRegulation])

  const changeDate = (newDate: Date | undefined) => {
    setActiveChange({
      ...activeChange,
      date: { value: newDate },
    })
  }

  const changeRegulationTitle = (newTitle: PlainText) => {
    setActiveChange({
      ...activeChange,
      title: fText(newTitle),
    })
  }

  const changeRegulationText = (newText: HTMLText) => {
    setActiveChange({
      ...activeChange,
      text: fHtml(newText, true),
    })
  }
  const saveChange = async () => {
    if (!activeChange.id) {
      await createDraftRegulationChange({
        variables: {
          input: {
            changingId: draft.id,
            regulation: activeChange.name,
            title: activeChange.title.value,
            text: activeChange.text.value,
            appendixes: activeChange.appendixes.map((apx) => ({
              title: apx.title.value,
              text: apx.text.value,
            })),
            date: toISODate(activeChange.date.value),
          },
        },
      })
        .then((res) => {
          if (res.errors && res.errors.length > 1) {
            throw res.errors[0]
          }
          return { success: true, error: undefined }
        })
        .catch((error) => {
          return { success: false, error: error as Error }
        })
    } else {
      await updateDraftRegulationChange({
        variables: {
          input: {
            id: activeChange.id,
            title: activeChange.title.value,
            text: activeChange.text.value,
            appendixes: activeChange.appendixes.map((apx) => ({
              title: apx.title.value,
              text: apx.text.value,
            })),
            date: toISODate(activeChange.date.value),
          },
        },
      })
        .then((res) => {
          if (res.errors && res.errors.length > 1) {
            throw res.errors[0]
          }
          return { success: true, error: undefined }
        })
        .catch((error) => {
          return { success: false, error: error as Error }
        })
    }

    closeModal(true)
  }

  const hasImpactMismatch = () => {
    return !!draftImpacts?.filter(
      (draftImpact) => draftImpact.changingId !== draft.id,
    ).length
  }

  // TODO: This could be better placed in the state reducer
  const localActions = {
    moveAppendixUp: (idx: number) => {
      const appendixes = activeChange.appendixes
      const prevIdx = idx - 1
      const appendix = appendixes[idx]
      const prevAppendix = appendixes[prevIdx]
      if (appendix && prevAppendix) {
        appendixes[prevIdx] = appendix
        appendixes[idx] = prevAppendix

        setActiveChange({
          ...activeChange,
          appendixes: appendixes,
        })
      }
    },

    setAppendixProp: <Prop extends AppendixFormSimpleProps>(
      idx: number,
      name: Prop,
      value: AppendixDraftForm[Prop]['value'],
    ) => {
      const appendixes = activeChange.appendixes
      let appendix = appendixes[idx]
      if (appendix) {
        const field = appendix[name]
        // @ts-expect-error VSCode says no error, but if you remove this line, the build will fail. FML
        value = tidyUp[field.type || '_'](value)

        updateFieldValue(field, value, true)

        const newAppendix = {
          ...appendix,
          [name]: value,
        }

        appendix = newAppendix
        const newAppendixes = appendixes

        setActiveChange({
          ...activeChange,
          appendixes: newAppendixes,
        })
      }
    },

    deleteAppendix: (idx: number) => {
      const appendixes = activeChange.appendixes
      if (appendixes[idx]) {
        appendixes.splice(idx, 1)
      }

      setActiveChange({
        ...activeChange,
        appendixes: appendixes,
      })
    },

    addAppendix: () => {
      const appendixes = activeChange.appendixes
      appendixes.push(
        makeDraftAppendixForm(
          { title: '', text: '' },
          String(appendixes.length),
        ),
      )

      setActiveChange({
        ...activeChange,
        appendixes: appendixes,
      })
    },

    revokeAppendix: (idx: number, revoked: boolean) => undefined,
  }

  return (
    <LayoverModal closeModal={closeModal} id="EditChangeModal">
      {draft && (
        <ReferenceText
          regulation={
            {
              title: draft.title.value,
              text: draft.text.value,
              name: '' as RegName,
              appendixes: draft.appendixes.map((apx) => ({
                title: apx.title.value,
                text: apx.text.value,
              })),
            } as Regulation
          }
          baseName={'' as RegName}
        />
      )}
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '6/12']}
            offset={['0', '0', '0', '1/12']}
          >
            <ImpactModalTitle
              type="edit"
              title={activeChange.regTitle}
              name={activeChange.name}
              impact={activeChange}
              onChangeDate={changeDate}
              tag={{
                first: 'Textabreyting reglugerðar',
                second: 'Stofnreglugerð',
              }}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '10/12', '8/12']}
            offset={['0', '0', '0', '1/12', '2/12']}
          >
            {effects?.future && (
              <ImpactHistory
                effects={effects}
                activeImpact={activeChange}
                draftImpacts={draftImpacts}
                draftId={draft.id}
              />
            )}
          </GridColumn>
        </GridRow>
        <GridRow>
          {showEditor && (
            <>
              <GridColumn
                span={['12/12', '12/12', '12/12', '10/12', '8/12']}
                offset={['0', '0', '0', '1/12', '2/12']}
              >
                <Box marginBottom={3}>
                  <MagicTextarea
                    label="Titill reglugerðar"
                    name="title"
                    value={activeChange.title.value}
                    onChange={(newValue) => changeRegulationTitle(newValue)}
                    required
                    readOnly={readOnly}
                    error={undefined}
                  />
                  {activeChange.title.value !== activeRegulation?.title && (
                    <MiniDiff
                      older={activeRegulation?.title || ''}
                      newer={activeChange.title.value}
                    />
                  )}
                </Box>
                <Box marginBottom={4} position="relative">
                  <Text fontWeight="semiBold" paddingBottom="p2">
                    Uppfærður texti
                  </Text>
                  <EditorInput
                    label=""
                    baseText={activeRegulation?.text}
                    value={activeChange.text.value}
                    onChange={(newValue) => changeRegulationText(newValue)}
                    draftId={draft.id}
                    isImpact={true}
                    error={undefined}
                    readOnly={readOnly}
                  />
                </Box>
              </GridColumn>
              <GridColumn
                span={['12/12', '12/12', '12/12', '10/12', '8/12']}
                offset={['0', '0', '0', '1/12', '2/12']}
              >
                <Text fontWeight="semiBold" paddingBottom="p2">
                  Viðaukar
                </Text>
                <Appendixes
                  draftId={draft.id}
                  appendixes={activeChange.appendixes}
                  actions={localActions}
                />
              </GridColumn>
            </>
          )}
        </GridRow>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '10/12', '8/12']}
            offset={['0', '0', '0', '1/12', '2/12']}
          >
            <Box paddingY={5}>
              <Divider />
            </Box>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              <Button
                onClick={() => closeModal()}
                variant="text"
                size="small"
                preTextIcon="arrowBack"
              >
                Til baka
              </Button>
              <Button
                onClick={saveChange}
                size="small"
                icon="arrowForward"
                disabled={hasImpactMismatch()}
              >
                Vista textabreytingu
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </LayoverModal>
  )
}
