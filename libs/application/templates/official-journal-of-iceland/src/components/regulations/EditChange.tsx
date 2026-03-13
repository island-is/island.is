/**
 * Ported from: libs/portals/admin/regulations-admin/src/components/impacts/EditChange.tsx
 *
 * Modal for editing a regulation text amendment (textabreyting).
 *
 * Key adaptations from regulations-admin:
 * - Removed GraphQL mutations (createDraftRegulationChange, updateDraftRegulationChange)
 * - Replaced with callback pattern: onSave/onClose props
 * - Uses RegulationImpactSchema instead of DraftChangeForm
 * - Simplified: no pristine regulation tracking, no ImpactHistory (deferred to Phase 4)
 * - EditorInput references kept but using existing OJOI editor components
 */
import {
  Button,
  Box,
  Divider,
  GridContainer,
  GridRow,
  GridColumn,
  Input,
  Text,
  LoadingDots,
} from '@island.is/island-ui/core'
import { useState, useEffect, useMemo } from 'react'
import { HTMLText, toISODate, getDiff } from '@island.is/regulations'
import dirtyClean from '@dmr.is/regulations-tools/dirtyClean-browser'
import { LayoverModal } from './LayoverModal'
import { ImpactModalTitle } from './ImpactModalTitle'
import { RegulationImpactSchema } from '../../lib/dataSchema'
import { useLocale } from '@island.is/localization'
import { useRegulationFetch } from '../../hooks/useRegulationFetch'
import { HTMLEditor } from '../htmlEditor/HTMLEditor'
import { useApplicationAssetUploader } from '../../hooks/useAssetUpload'
import { ReferenceText } from './ReferenceText'
import { getDefaultDate } from '../../lib/utils'

// ---------------------------------------------------------------------------

type EditChangeProps = {
  /** The amendment impact being edited (from answers.regulation.impacts[]) */
  change: RegulationImpactSchema
  /** The title of the parent regulation/draft */
  draftTitle?: string
  /** HTML body of the draft regulation (shown in reference panel) */
  draftHtml?: string
  /** Whether the base regulation type is 'base' */
  isBase?: boolean
  /** Read-only mode (for viewing historical impacts) */
  readOnly?: boolean
  /** Application ID needed for file uploads in the editor */
  applicationId: string
  /** Called when saving the impact */
  onSave: (impact: RegulationImpactSchema) => void
  /** Called when closing the modal */
  onClose: () => void
}

export const EditChange = (props: EditChangeProps) => {
  const {
    change,
    draftTitle,
    draftHtml,
    isBase,
    readOnly,
    applicationId,
    onSave,
    onClose,
  } = props
  const { formatMessage } = useLocale()

  // File uploader for the HTMLEditor (image uploads etc.)
  const { useFileUploader } = useApplicationAssetUploader({ applicationId })
  const fileUploader = useFileUploader()

  // Minimum date for the impact — MINIMUM_WEEKDAYS workdays from now
  // (consistent with the OJOI publication flow)
  const defaultMinDate = useMemo(() => new Date(getDefaultDate()), [])
  const [minDate] = useState(defaultMinDate)

  const [activeTitle, setActiveTitle] = useState(change.title || '')
  const [activeText, setActiveText] = useState(change.text || '')
  const [activeDate, setActiveDate] = useState<Date | undefined>(
    change.date ? new Date(change.date) : defaultMinDate,
  )
  const [activeAppendixes, setActiveAppendixes] = useState(
    change.appendixes || [],
  )
  const [activeComments, setActiveComments] = useState(change.comments || '')

  // Fetch the base regulation so we can pre-populate the form fields
  // when creating a new amendment impact (i.e. change has no existing text)
  const isNewImpact = !change.title && !change.text
  const isSelf = change.name === 'self'
  const { regulation: baseRegulation, loading: regulationLoading } =
    useRegulationFetch(isSelf ? undefined : change.name)

  // Track whether form fields have been initialized from the fetched data.
  // The HTMLEditor captures its value at mount time via a ref, so we must
  // NOT render it until the fields contain the correct initial content.
  const [initialized, setInitialized] = useState(!isNewImpact || isSelf)

  // Pre-populate title/text/appendixes from the fetched base regulation
  // when creating a new impact (fields start empty)
  useEffect(() => {
    if (!isNewImpact || isSelf || !baseRegulation) return

    if (!activeTitle && baseRegulation.title) {
      setActiveTitle(baseRegulation.title)
    }
    if (!activeText && baseRegulation.text) {
      setActiveText(baseRegulation.text)
    }
    if (
      (!activeAppendixes || activeAppendixes.length === 0) &&
      baseRegulation.appendixes?.length
    ) {
      setActiveAppendixes(
        baseRegulation.appendixes.map((a) => ({
          title: a.title || '',
          text: a.text || '',
        })),
      )
    }
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseRegulation])

  const changeDate = (newDate: Date | undefined) => {
    setActiveDate(newDate)
  }

  // ----------- Diff computation (ported from regulations-admin) -----------
  const emptyHTML = '' as HTMLText

  const getDiffHtml = () => {
    const prev = (baseRegulation?.text as HTMLText) || emptyHTML
    const curr = (activeText as HTMLText) || emptyHTML
    return getDiff(dirtyClean(prev), dirtyClean(curr)).diff || emptyHTML
  }

  const getAppendixDiffHtml = (i: number) => {
    const previous =
      (baseRegulation?.appendixes?.[i]?.text as HTMLText) || emptyHTML
    const current = (activeAppendixes[i]?.text as HTMLText) || emptyHTML

    const diff = getDiff(dirtyClean(previous), dirtyClean(current)).diff

    if (!baseRegulation?.appendixes?.[i]) {
      // New appendix
      return `<div data-diff="new">${diff}</div>`
    }

    const noChange = dirtyClean(previous) === dirtyClean(current)
    if (noChange) return undefined

    return diff || undefined
  }

  const saveChange = () => {
    onSave({
      ...change,
      title: activeTitle,
      text: activeText,
      diff: getDiffHtml(),
      date: toISODate(activeDate ?? defaultMinDate),
      appendixes: activeAppendixes.map((apx, i) => ({
        ...apx,
        diff: getAppendixDiffHtml(i),
      })),
      comments: activeComments,
    })
  }

  const isValidImpact = () => {
    // Date always has a value — defaults to today ("takes effect immediately")
    return !!activeTitle && !!activeText
  }

  // The base regulation text to use as the diff reference.
  // This is the original text before the user's edits.
  const baseRegText = baseRegulation?.text as HTMLText | undefined

  return (
    <LayoverModal closeModal={onClose} id="EditChangeModal">
      {/* Side panel showing the draft regulation text as reference */}
      {draftTitle && draftHtml && (
        <ReferenceText
          title={draftTitle as string}
          text={Buffer.from(draftHtml, 'base64').toString('utf-8') as HTMLText}
          asBase={isBase}
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
                change.name === 'self'
                  ? 'stofnreglugerð'
                  : change.regTitle || change.name
              }
              name={change.name}
              date={change.date}
              minDate={
                readOnly
                  ? change.date
                    ? new Date(change.date)
                    : undefined
                  : minDate
              }
              onChangeDate={changeDate}
              readOnly={readOnly}
              tag={{
                first: 'Textabreyting reglugerðar',
                second: isBase ? 'Stofnreglugerð' : 'Breytingareglugerð',
              }}
            />
          </GridColumn>
        </GridRow>

        <GridRow>
          <GridColumn
            span={['12/12', '12/12', '12/12', '10/12', '8/12']}
            offset={['0', '0', '0', '1/12', '2/12']}
          >
            {/* Show loading indicator while fetching the base regulation.
                Wait for both the fetch AND the useEffect that populates the
                form fields — the HTMLEditor captures its value at mount time
                via a ref, so it must not render before data is ready. */}
            {!initialized || regulationLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                paddingY={10}
              >
                <LoadingDots />
              </Box>
            ) : (
              <>
                <Box marginBottom={3}>
                  <Input
                    label="Titill reglugerðar"
                    name="impactTitle"
                    value={activeTitle}
                    onChange={(e) => setActiveTitle(e.target.value)}
                    required
                    readOnly={readOnly}
                    hasError={!activeTitle}
                    errorMessage={
                      !activeTitle
                        ? 'Þessi reitur má ekki vera tómur'
                        : undefined
                    }
                  />
                </Box>

                <Box zIndex={10} marginBottom={4} position="relative">
                  <HTMLEditor
                    title="Uppfærður texti"
                    name="impactText"
                    value={activeText as HTMLText}
                    onChange={(newValue) => setActiveText(newValue)}
                    readOnly={readOnly}
                    controller={false}
                    fileUploader={fileUploader()}
                    baseText={baseRegText}
                    isImpact={true}
                    error={
                      !activeText
                        ? 'Þessi reitur má ekki vera tómur'
                        : undefined
                    }
                  />
                </Box>

                {/* Appendixes section */}
                <Box marginBottom={4}>
                  <Text fontWeight="semiBold" paddingBottom="p2">
                    Viðaukar
                  </Text>
                  {activeAppendixes.map((appendix, index) => (
                    <Box
                      key={index}
                      border="standard"
                      borderRadius="large"
                      padding={3}
                      marginBottom={2}
                    >
                      <Box marginBottom={2}>
                        <Input
                          label={`Heiti viðauka ${index + 1}`}
                          name={`appendixTitle_${index}`}
                          value={appendix.title || ''}
                          onChange={(e) => {
                            const newAppendixes = [...activeAppendixes]
                            newAppendixes[index] = {
                              ...newAppendixes[index],
                              title: e.target.value,
                            }
                            setActiveAppendixes(newAppendixes)
                          }}
                          readOnly={readOnly}
                          size="sm"
                        />
                      </Box>
                      <HTMLEditor
                        name={`appendixText_${index}`}
                        value={(appendix.text || '') as HTMLText}
                        onChange={(newValue) => {
                          const newAppendixes = [...activeAppendixes]
                          newAppendixes[index] = {
                            ...newAppendixes[index],
                            text: newValue,
                          }
                          setActiveAppendixes(newAppendixes)
                        }}
                        readOnly={readOnly}
                        controller={false}
                        fileUploader={fileUploader()}
                      />
                      {!readOnly && (
                        <Box marginTop={1}>
                          <Button
                            variant="text"
                            size="small"
                            preTextIcon="trash"
                            colorScheme="destructive"
                            onClick={() => {
                              const newAppendixes = activeAppendixes.filter(
                                (_, i) => i !== index,
                              )
                              setActiveAppendixes(newAppendixes)
                            }}
                          >
                            Eyða viðauka
                          </Button>
                        </Box>
                      )}
                    </Box>
                  ))}
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="small"
                      icon="add"
                      onClick={() => {
                        setActiveAppendixes([
                          ...activeAppendixes,
                          { title: '', text: '' },
                        ])
                      }}
                    >
                      Bæta við viðauka
                    </Button>
                  )}
                </Box>
              </>
            )}
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
                onClick={onClose}
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
                  disabled={readOnly || !isValidImpact()}
                >
                  Vista textabreytingu
                </Button>
              )}
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </LayoverModal>
  )
}
