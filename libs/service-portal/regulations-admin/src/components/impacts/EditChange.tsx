import { useMutation } from '@apollo/client'
import {
  Button,
  Box,
  Divider,
  GridContainer,
  GridRow,
  GridColumn,
  BoxProps,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import {
  DraftChangeForm,
  DraftField,
  HtmlDraftField,
  RegDraftForm,
} from '../../state/types'
import {
  getDiff,
  HTMLDump,
  HTMLText,
  PlainText,
  RegName,
  Regulation,
  toISODate,
} from '@island.is/regulations'
import { LayoverModal } from './LayoverModal'
import { ImpactModalTitle } from './ImpactModalTitle'
import {
  useGetCurrentRegulationFromApiQuery,
  useGetRegulationImpactsQuery,
} from '../../utils/dataHooks'
import {
  CREATE_DRAFT_REGULATION_CHANGE,
  UPDATE_DRAFT_REGULATION_CHANGE,
} from './impactQueries'
import { MagicTextarea } from '../MagicTextarea'
import { MiniDiff } from '../MiniDiff'
import { EditorInput } from '../EditorInput'
import { getTextContentDiff } from '@island.is/regulations'
import { MessageDescriptor } from 'react-intl'
import * as s from './Impacts.css'
import { ReferenceText } from './ReferenceText'
import { makeDraftAppendixForm } from '../../state/makeFields'
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
  closeModal: (updateImpacts?: boolean) => void
}

export const EditChange = (props: EditChangeProp) => {
  const { draft, change, closeModal } = props
  const [activeChange, setActiveChange] = useState(change) // Áhrifafærslan sem er verið að breyta
  const [showEditor, setShowEditor] = useState(false)
  const [createDraftRegulationChange] = useMutation(
    CREATE_DRAFT_REGULATION_CHANGE,
  )
  const [updateDraftRegulationChange] = useMutation(
    UPDATE_DRAFT_REGULATION_CHANGE,
  )

  const {
    data: regulation,
    loading /* , error */,
  } = useGetCurrentRegulationFromApiQuery(activeChange.name)

  const { data: draftImpacts } = useGetRegulationImpactsQuery(activeChange.name)
  const fHtml = (
    value: HTMLText,
    required?: true | MessageDescriptor,
  ): HtmlDraftField => ({
    value,
    required,
    type: 'html',
    warnings: [],
  })

  const fText = <T extends string>(
    value: T,
    required?: true | MessageDescriptor,
  ): DraftField<T, 'text'> => ({
    value,
    required,
    type: 'text',
  })

  regulation && console.log(fHtml(regulation?.text, true))
  useEffect(() => {
    if (!change.id && regulation) {
      setActiveChange({
        ...activeChange,
        text: fHtml(regulation.text, true),
        title: fText(regulation.title),
        appendixes: regulation.appendixes.map((a, i) =>
          makeDraftAppendixForm(a, String(i)),
        ),
      })
    }
  }, [regulation])

  useEffect(() => {
    if (activeChange.date.value) {
      console.log('has Date', activeChange.date)
      setShowEditor(true)
    }
  }, [activeChange])

  const changeDate = (newDate: Date | undefined) => {
    setActiveChange({
      ...activeChange,
      date: { value: newDate },
    })
  }

  const changeRegulationTitle = (newTitle: PlainText | undefined) => {
    setActiveChange({
      ...activeChange,
      title: { value: newTitle ?? '' }, //TODO: What is the best way to do this is?
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
            span={['12/12', '12/12', '12/12', '8/12']}
            offset={['0', '0', '0', '2/12']}
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

          {showEditor && (
            <GridColumn
              span={['12/12', '12/12', '12/12', '8/12']}
              offset={['0', '0', '0', '2/12']}
            >
              <Box marginBottom={3}>
                <MagicTextarea
                  label="Titill reglugerðar"
                  name="title"
                  value={activeChange.title.value}
                  onChange={(newValue) => changeRegulationTitle(newValue)}
                  required
                  error={undefined}
                />
                {activeChange.title.value &&
                  activeChange.title.value !== change.title.value && (
                    <MiniDiff
                      older={change.title.value || ''}
                      newer={activeChange.title.value}
                    />
                  )}
              </Box>
              <Box marginBottom={4}>
                <EditorInput
                  label="Uppfærður texti"
                  baseText={
                    regulation?.text !== activeChange.text.value
                      ? regulation?.text
                      : undefined
                  }
                  value={activeChange.text.value}
                  onChange={(newValue) => changeRegulationText(newValue)}
                  draftId={draft.id}
                  isImpact={true}
                  required
                  error={undefined}
                />
              </Box>
              {/* VIÐAUKI */}
              {/* <Appendixes
              draftId={draft.id}
              appendixes={change.appendixes}
              actions={} 
              />
            */}
            </GridColumn>
          )}
        </GridRow>
        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '8/12']}
            offset={['0', '0', '0', '2/12']}
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
              <Button onClick={saveChange} size="small" icon="arrowForward">
                Vista textabreytingu
              </Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </LayoverModal>
  )
}
