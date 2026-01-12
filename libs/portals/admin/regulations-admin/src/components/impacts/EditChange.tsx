import { useMutation } from '@apollo/client'
import {
  Button,
  Box,
  Divider,
  GridContainer,
  GridRow,
  GridColumn,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { useEffect, useState, useMemo } from 'react'
import {
  AppendixDraftForm,
  AppendixFormSimpleProps,
  DraftChangeForm,
  RegDraftForm,
} from '../../state/types'
import {
  getDiff,
  HTMLText,
  PlainText,
  RegName,
  Regulation,
  toISODate,
} from '@island.is/regulations'
import dirtyClean from '@dmr.is/regulations-tools/dirtyClean-browser'
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
import { ReferenceText } from './ReferenceText'
import {
  fDate,
  fHtml,
  fText,
  makeDraftAppendixForm,
} from '../../state/makeFields'
import { ImpactHistory } from './ImpactHistory'
import { Appendixes } from '../Appendixes'
import {
  tidyUp,
  updateFieldValue,
  validateImpact,
} from '../../state/validations'
import {
  useGetRegulationHistory,
  usePristineRegulations,
} from '../../utils/hooks'
import { DraftRegulationChange } from '@island.is/regulations/admin'
import { useLocale } from '@island.is/localization'
import { cleanTitle } from '@dmr.is/regulations-tools/cleanTitle'
import { errorMsgs as msg } from '../../lib/messages'
import { getWorkdayMinimumDate } from '../../utils'

/* ---------------------------------------------------------------------------------------------------------------- */

type EditChangeProp = {
  draft: RegDraftForm // Allt það sem er verið að breyta
  change: DraftChangeForm // Áhrifafærslan
  readOnly?: boolean
  closeModal: (updateImpacts?: boolean) => void
}

export const EditChange = (props: EditChangeProp) => {
  const t = useLocale().formatMessage
  const { draft, change, closeModal, readOnly } = props
  const [activeChange, setActiveChange] = useState(change) // Áhrifafærslan sem er verið að breyta
  const today = useMemo(() => new Date(), [])
  const [minDate, setMinDate] = useState<Date | undefined>()
  const [showChangeForm, setShowChangeForm] = useState(false)
  const { addPristineRegulation } = usePristineRegulations()

  // Target regulation for impact
  const [activeRegulation, setActiveRegulation] = useState<
    Regulation | DraftRegulationChange | undefined
  >()

  // Previous regulation for diff viewer
  const [previousRegulation, setPreviousRegulation] = useState<
    Regulation | DraftRegulationChange | undefined
  >()

  const [createDraftRegulationChange] = useMutation(
    CREATE_DRAFT_REGULATION_CHANGE,
  )
  const [updateDraftRegulationChange] = useMutation(
    UPDATE_DRAFT_REGULATION_CHANGE,
  )

  // fetch base version of the regulation from api
  const { data: regulationBase } = useGetRegulationFromApiQuery(change.name)

  // fetch all regulation impacts
  const { data: draftImpacts, loading: impactsLoading } =
    useGetRegulationImpactsQuery(change.name)

  const { allFutureEffects, hasImpactMismatch } = useGetRegulationHistory(
    regulationBase,
    activeChange,
    draftImpacts,
    draft.id,
  )

  // fetch regulation as it is on a specific date, there might be future effects that are not in regulationBase
  const { data: regulation, loading: regulationLoading } =
    useGetRegulationFromApiQuery(
      change.name,
      minDate ? toISODate(minDate) : true,
    )

  // if there is draftimpacts, use them, otherwise use regulation
  useEffect(() => {
    if (!impactsLoading && !regulationLoading && minDate) {
      const editDraft = draftImpacts?.find((i) => i.id === change.id)
      const targetDraft = editDraft ? editDraft : draftImpacts?.slice(-1)[0]

      // if drafts are present, base changes on latest drafts
      if (targetDraft && 'text' in targetDraft) {
        setActiveRegulation(targetDraft)
        const draftIndex =
          draftImpacts?.findIndex((i) => i.id === targetDraft.id) || 0

        // for new impact, use latest impact if available
        if (!editDraft && draftImpacts?.[draftIndex]) {
          setPreviousRegulation(
            draftImpacts[draftIndex] as DraftRegulationChange,
          )
        }
        // if viewing, use previous impact if available
        else if (editDraft && draftImpacts?.[draftIndex - 1]) {
          setPreviousRegulation(
            draftImpacts[draftIndex - 1] as DraftRegulationChange,
          )
        }
        // otherwise use latest regulation version from api
        else {
          setPreviousRegulation(regulation)
        }
      }
      // otherwise base changes on latest regulation version from api
      else if (regulation) {
        setActiveRegulation(regulation)
        setPreviousRegulation(regulation)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regulation, regulationLoading, draftImpacts, impactsLoading, minDate])

  useEffect(() => {
    const lastDay = allFutureEffects
      .filter((eff) => eff.origin !== 'self')
      .slice(-1)?.[0]?.date
    const minDateDate = lastDay ? new Date(lastDay) : today
    if (!impactsLoading && toISODate(minDateDate) !== toISODate(minDate)) {
      setMinDate(minDateDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [impactsLoading, allFutureEffects])

  // once correct activeRegulation has been found, set activeChange
  useEffect(() => {
    if (
      !change.id &&
      activeRegulation &&
      !activeChange.title.value &&
      !activeChange.text.value
    ) {
      setActiveChange({
        ...activeChange,
        text: fHtml(activeRegulation.text, true),
        title: fText(activeRegulation.title, true),
        appendixes: activeRegulation.appendixes.map((a, i) =>
          makeDraftAppendixForm(a, String(i)),
        ),
      })
      setShowChangeForm(true)
    } else if (change.id) {
      setShowChangeForm(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRegulation])

  const changeDate = (newDate: Date | undefined) => {
    setActiveChange({
      ...activeChange,
      date: fDate(newDate, true, { min: minDate }),
    })
  }

  useEffect(() => {
    if (
      !impactsLoading &&
      !regulationLoading &&
      toISODate(minDate) !== toISODate(activeChange.date.value)
    ) {
      changeDate(getWorkdayMinimumDate(11))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate, impactsLoading, regulationLoading])

  const changeRegulationTitle = (newTitle: PlainText) => {
    setActiveChange({
      ...activeChange,
      title: fText(cleanTitle(newTitle), true),
    })
  }

  const changeRegulationText = (newText: HTMLText) => {
    setActiveChange({
      ...activeChange,
      text: fHtml(newText, true),
    })
  }

  useEffect(() => {
    validateImpact(activeChange)
  }, [activeChange])

  const emptyHTML = '' as HTMLText
  const getDiffHtml = (previous?: HTMLText, current?: HTMLText) => {
    const prev = previous || previousRegulation?.text || emptyHTML
    const curr = current || activeChange.text.value || emptyHTML

    return getDiff(dirtyClean(prev), dirtyClean(curr)).diff || emptyHTML
  }

  const getAppendixDiffHtml = (i: number) => {
    const previous = previousRegulation?.appendixes[i]?.text || emptyHTML
    const current = activeChange?.appendixes[i]?.text.value || emptyHTML

    const diff = getDiff(dirtyClean(previous), dirtyClean(current)).diff

    if (!previousRegulation?.appendixes[i]) {
      // If the appendix is new
      return `<div data-diff="new">${diff}</div>` as HTMLText
    }

    const noChange = dirtyClean(previous) === dirtyClean(current)
    if (noChange) {
      // If the appendix has no changes
      return undefined
    }

    if (diff) {
      // If the appendix has changes
      return diff
    } else {
      // If the appendix has no diff
      return undefined
    }
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
            diff: getDiffHtml(),
            appendixes: activeChange.appendixes.map((apx, i) => ({
              title: apx.title.value,
              text: apx.text.value,
              diff: getAppendixDiffHtml(i),
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
        .then(() => {
          addPristineRegulation(draft.id)
          closeModal(true)
        })
        .catch((error) => {
          toast.error(t(msg.errorOnSaveReg))
          return { success: false, error: error as Error }
        })
    } else {
      await updateDraftRegulationChange({
        variables: {
          input: {
            id: activeChange.id,
            title: activeChange.title.value,
            text: activeChange.text.value,
            diff: getDiffHtml(),
            appendixes: activeChange.appendixes.map((apx, i) => ({
              title: apx.title.value,
              text: apx.text.value,
              diff: getAppendixDiffHtml(i),
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
        .then(() => {
          addPristineRegulation(draft.id)
          closeModal(true)
        })
        .catch((error) => {
          toast.error(t(msg.errorOnSaveReg))
          return { success: false, error: error as Error }
        })
    }
  }

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

    moveAppendixDown: (idx: number) => {
      const appendixes = activeChange.appendixes
      const nextIdx = idx + 1
      const appendix = appendixes[idx]
      const nextAppendix = appendixes[nextIdx]
      if (appendix && nextAppendix) {
        appendixes[nextIdx] = appendix
        appendixes[idx] = nextAppendix

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

  const isValidImpact = () => {
    return (
      activeChange.date?.value &&
      activeChange.title?.value &&
      activeChange.text?.value &&
      activeChange.appendixes.every(
        (apx) => apx.title?.value && apx.text?.value,
      )
    )
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
          asBase={draft.type.value === 'base'}
        />
      )}
      <GridContainer>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '6/12']}
            offset={['0', '0', '0', '2/12']}
          >
            <ImpactModalTitle
              type="edit"
              title={
                activeChange.name === 'self'
                  ? 'stofnreglugerð'
                  : activeChange.regTitle
              }
              name={activeChange.name}
              impact={activeChange}
              minDate={readOnly ? activeChange.date.value : minDate}
              onChangeDate={changeDate}
              readOnly={readOnly}
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
            <ImpactHistory
              impactDate={activeChange.date.value}
              allFutureEffects={allFutureEffects}
              targetName={activeChange.name}
              draftId={draft.id}
              impactId={activeChange.id}
            />
          </GridColumn>
        </GridRow>
        {activeRegulation && showChangeForm && (
          <>
            <GridRow>
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
                    error={
                      !activeChange.title.value
                        ? t(msg.fieldRequired)
                        : undefined
                    }
                  />
                  {activeChange.title.value !== previousRegulation?.title && (
                    <MiniDiff
                      older={previousRegulation?.title || ''}
                      newer={activeChange.title.value}
                    />
                  )}
                </Box>
                <Box zIndex={10} marginBottom={4} position="relative">
                  <Text fontWeight="semiBold" paddingBottom="p2">
                    Uppfærður texti
                  </Text>
                  <EditorInput
                    label=""
                    baseText={previousRegulation?.text}
                    value={activeChange.text.value}
                    onChange={(newValue) => changeRegulationText(newValue)}
                    draftId={draft.id}
                    isImpact={true}
                    error={
                      !activeChange.text.value
                        ? t(msg.fieldRequired)
                        : undefined
                    }
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
                  baseAppendixes={previousRegulation?.appendixes}
                />
              </GridColumn>
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
                  {!readOnly && (
                    <Button
                      onClick={saveChange}
                      size="small"
                      icon="arrowForward"
                      disabled={
                        hasImpactMismatch || readOnly || !isValidImpact()
                      }
                    >
                      Vista textabreytingu
                    </Button>
                  )}
                </Box>
              </GridColumn>
            </GridRow>
          </>
        )}
      </GridContainer>
    </LayoverModal>
  )
}
