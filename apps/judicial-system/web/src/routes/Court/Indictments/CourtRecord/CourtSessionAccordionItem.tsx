import type { FC, ForwardedRef } from 'react'
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AnimatePresence, LayoutGroup, motion, Reorder } from 'motion/react'

import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  Checkbox,
  Icon,
  Input,
  RadioButton,
  Select,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  applyDativeCaseToCourtName,
  formatDate,
  formatDOB,
  formatRulingOrderPronouncedOrallyName,
  getRoleTitleFromCaseFileCategory,
  getWordByGender,
  lowercase,
  Word,
} from '@island.is/judicial-system/formatters'
import { appealCorrectionLock } from '@island.is/judicial-system/types'
import {
  BlueBox,
  CheckboxList,
  DateTime,
  FileNotFoundModal,
  FormContext,
  Modal,
  MultipleValueList,
  RichTextEditor,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import type { Supplement } from '@island.is/judicial-system-web/src/components/EditableCaseFile/EditableCaseFile'
import EditableCaseFile from '@island.is/judicial-system-web/src/components/EditableCaseFile/EditableCaseFile'
import type {
  CourtDocumentResponse,
  CourtSessionResponse,
  CourtSessionString,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseFileCategory,
  CourtDocumentType,
  CourtSessionClosedLegalBasis,
  CourtSessionRulingType,
  CourtSessionStringType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { SelectRepresentative } from '@island.is/judicial-system-web/src/routes/Shared/AddFiles/SelectCaseFileRepresentative'
import { api } from '@island.is/judicial-system-web/src/services'
import { validateAndSetErrorMessage } from '@island.is/judicial-system-web/src/utils/formHelper'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  formatDateForServer,
  useCourtDocuments,
  useCourtSessions,
  useDebouncedField,
  useFileList,
  useOnceOn,
  useUsers,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'
import {
  applyMergedCaseEntries,
  reconcileAppealDecisionsForRulingFileChange,
  rulingOrderAppealCase,
  rulingOrderChoices,
} from '@island.is/judicial-system-web/src/utils/utils'
import { isCourtSessionValid } from '@island.is/judicial-system-web/src/utils/validate'

import {
  arrangeCourtSessionDocuments,
  groupCourtSessionDocuments,
  isKeptWhenRemovedFromCourtSession,
  placeFiledCourtDocument,
  reorderCourtSessionSection,
} from './CourtSessionAccordionItem.logic'
import { CourtSessionMergedCaseEntries } from './CourtSessionMergedCaseEntries'
import CourtSessionRuling from './CourtSessionRuling'
import { UnfiledCourtDocumentList } from './UnfiledCourtDocumentList'
import * as styles from './CourtRecord.css'

interface Props {
  index: number
  courtSession: CourtSessionResponse
  isExpanded: boolean
  onToggle: () => void
}

interface CourtSessionLabelProps {
  label: string
  isConfirmed?: CourtSessionResponse['isConfirmed']
}

const CLOSURE_GROUNDS: [string, string, CourtSessionClosedLegalBasis][] = [
  [
    'a-lið 10. gr. sml nr. 88/2008',
    'til hlífðar sakborningi, brotaþola, vandamanni þeirra, vitni eða öðrum sem málið varðar',
    CourtSessionClosedLegalBasis._2008_88_10_A,
  ],
  [
    'b-lið 10. gr. sml nr. 88/2008',
    'vegna nauðsynjar sakbornings, brotaþola, vitnis eða annars sem málið varðar á því að halda leyndum atriðum varðandi hagsmuni í viðskiptum eða samsvarandi aðstöðu',
    CourtSessionClosedLegalBasis._2008_88_10_B,
  ],
  [
    'c-lið 10. gr. sml nr. 88/2008',
    'vegna hagsmuna almennings eða öryggis ríkisins',
    CourtSessionClosedLegalBasis._2008_88_10_C,
  ],
  [
    'd-lið 10. gr. sml nr. 88/2008',
    'af velsæmisástæðum',
    CourtSessionClosedLegalBasis._2008_88_10_D,
  ],
  [
    'e-lið 10. gr. sml nr. 88/2008',
    'til að halda uppi þingfriði',
    CourtSessionClosedLegalBasis._2008_88_10_E,
  ],
  [
    'f-lið 10. gr. sml nr. 88/2008',
    'meðan á rannsókn máls stendur og hætta þykir á sakarspjöllum ef þing væri háð fyrir opnum dyrum',
    CourtSessionClosedLegalBasis._2008_88_10_F,
  ],
  [
    'g-lið 10. gr. sml nr. 88/2008',
    'meðan vitni gefur skýrslu án þess að það þurfi að skýra frá nafni sínu í heyranda hljóði, sbr. 8. mgr. 122. gr.',
    CourtSessionClosedLegalBasis._2008_88_10_G,
  ],
]

const getCourtSessionFallbackStartDate = (
  courtSession: Pick<CourtSessionResponse, 'startDate'>,
  workingCase: {
    courtDate?: { date?: string | null } | null
    arraignmentDate?: { date?: string | null } | null
  },
): string | undefined =>
  courtSession.startDate ??
  workingCase.courtDate?.date ??
  workingCase.arraignmentDate?.date ??
  undefined

const CourtSessionLabel = forwardRef(
  (props: CourtSessionLabelProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { label, isConfirmed = true } = props

    return (
      <Box ref={ref} display="flex" alignItems="flexEnd" columnGap={1}>
        <Text variant="h4">{label}</Text>
        {!isConfirmed && (
          <Tooltip placement="top" as="span" text="Óstaðfest þinghald">
            <span>
              <Icon icon="warning" type="filled" color="yellow600" />
            </span>
          </Tooltip>
        )}
      </Box>
    )
  },
)

const CourtSessionAccordionItem: FC<Props> = (props) => {
  const { index, courtSession, isExpanded, onToggle } = props
  const ref = useRef<HTMLDivElement>(null)
  const { workingCase, setWorkingCase, isCaseUpToDate, refreshCase } =
    useContext(FormContext)
  // Moving the ruling type off ORDER removes the ruling, which discards its
  // decisions and deletes the appeal it produced - not allowed once the appeal
  // has left the court record's reach (a party filed it itself, or Landsréttur
  // has the case). courtSession.service.validateRulingRemovalAllowed rejects the
  // same change server-side. Swapping the ruling onto another file stays open at
  // every appeal state: it means the same ruling is now a different document, and
  // everything moves with it.
  // The reason is kept, not just the boolean, so the section can say which of the
  // two locks applies - the appeal decision cards next to it report the appeal's
  // state, not why these controls are locked.
  const rulingAppealCase = rulingOrderAppealCase(
    workingCase,
    courtSession.rulingFileId,
  )
  const rulingRemovalLock = appealCorrectionLock(rulingAppealCase)
  // A session whose ruling has been appealed cannot be deleted at all - not
  // just corrected - because deleting it would strand the appeal.
  const rulingHasBeenAppealed = Boolean(rulingAppealCase)
  const rulingRemovalDisabled =
    courtSession.isConfirmed || Boolean(rulingRemovalLock)
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })
  const { courtDocument } = useCourtDocuments()
  const {
    updateCourtSession,
    updateCourtSessionString,
    pronounceRulingOrally,
    deleteCourtSession,
  } = useCourtSessions()
  const [readyForInitialization, setReadyForInitialization] = useState(false)
  const [locationErrorMessage, setLocationErrorMessage] = useState<string>('')
  const [entriesErrorMessage, setEntriesErrorMessage] = useState<string>('')
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null)

  const [modalVisible, setModalVisible] = useState<'DELETE'>()
  // 'pronouncing' covers the request, 'refreshing' the wait for the case state
  // that follows it. Both have to keep the control disabled: refreshCase() only
  // asks for new case state, and until it lands the radio is still unchecked, so
  // releasing the guard when the request resolves would reopen the window it
  // exists to close.
  const [pronounceOrallyState, setPronounceOrallyState] = useState<
    'idle' | 'pronouncing' | 'refreshing'
  >('idle')
  const isPronouncingOrally = pronounceOrallyState !== 'idle'

  const {
    judges,
    districtCourtAssistants,
    registrars,
    loading: usersLoading,
  } = useUsers(workingCase.court?.id)

  const patchSession = useCallback(
    async (
      courtSessionId: string,
      updates: Partial<CourtSessionResponse>,
      { persist = false } = {},
    ) => {
      setWorkingCase((prev) => {
        const courtSessions = prev.courtSessions?.map((session) =>
          session.id === courtSessionId ? { ...session, ...updates } : session,
        )

        // Changing a session's ruling order file re-keys (swap) or discards
        // (removal) that ruling's appeal decisions on the backend. Mirror it on
        // the working case so the decision cards keep their selections.
        const appealDecisions =
          'rulingFileId' in updates
            ? reconcileAppealDecisionsForRulingFileChange(
                prev.appealDecisions,
                prev.courtSessions?.find(
                  (session) => session.id === courtSessionId,
                )?.rulingFileId,
                updates.rulingFileId,
              )
            : prev.appealDecisions

        return { ...prev, courtSessions, appealDecisions }
      })

      if (persist) {
        const { courtSessionStrings, ...courtSessionUpdate } = updates
        const success = await updateCourtSession({
          ...courtSessionUpdate,
          courtSessionId,
          caseId: workingCase.id,
        })

        // A failed confirm/unconfirm must not leave the UI in the new state
        // (button re-labelled to "Leiðrétta", read-only mode). Roll the flag
        // back to what it was. Only isConfirmed is reverted - other optimistic
        // field edits keep their value so unsaved input is not lost on a
        // transient failure. (Confirm/unconfirm always toggle the flag.)
        if (!success && 'isConfirmed' in updates) {
          setWorkingCase((prev) => ({
            ...prev,
            courtSessions: prev.courtSessions?.map((session) =>
              session.id === courtSessionId
                ? { ...session, isConfirmed: !updates.isConfirmed }
                : session,
            ),
          }))
        }
      }
    },
    [setWorkingCase, updateCourtSession, workingCase.id],
  )

  // Pronouncing the session's ruling orally creates the ruling itself, not just
  // a field on the session, so the court record and the case's files both have
  // to come back from the server rather than be patched locally.
  const pronounceRulingOrallyInSession = useCallback(async () => {
    // The radio stays unchecked until the refreshed case arrives, so without a
    // guard every further activation sends another request - and each one
    // creates a ruling of its own.
    if (pronounceOrallyState !== 'idle') {
      return
    }

    setPronounceOrallyState('pronouncing')

    const updatedCourtSession = await pronounceRulingOrally({
      caseId: workingCase.id,
      courtSessionId: courtSession.id,
    })

    if (!updatedCourtSession) {
      // Nothing to wait for - let them try again.
      setPronounceOrallyState('idle')

      return
    }

    setPronounceOrallyState('refreshing')
    refreshCase()
  }, [
    courtSession.id,
    pronounceOrallyState,
    pronounceRulingOrally,
    refreshCase,
    workingCase.id,
  ])

  // The refreshed case has landed, so the radio now shows the ruling that was
  // pronounced and the control can be released.
  useEffect(() => {
    if (pronounceOrallyState === 'refreshing' && isCaseUpToDate) {
      setPronounceOrallyState('idle')
    }
  }, [pronounceOrallyState, isCaseUpToDate])

  const patchCourtSessionStrings = useCallback(
    (
      courtSessionId: string,
      mergedCaseId: string,
      updatedCourtSessionString: Pick<CourtSessionString, 'value'>,
      { persist = false } = {},
    ) => {
      // The strings are read off `prev` rather than the render this call was
      // created in. A debounced save fires up to `delay` after the keystroke
      // that scheduled it, so a closed-over array can be stale by then - and
      // rebuilding from it would revert an edit made to a sibling merged case
      // in the meantime.
      setWorkingCase((prev) => ({
        ...prev,
        courtSessions: prev.courtSessions?.map((session) => {
          if (session.id !== courtSessionId) {
            return session
          }

          return {
            ...session,
            courtSessionStrings: applyMergedCaseEntries(
              session.courtSessionStrings,
              {
                caseId: workingCase.id,
                courtSessionId,
                mergedCaseId,
                value: updatedCourtSessionString.value,
              },
            ),
          }
        }),
      }))

      if (persist) {
        updateCourtSessionString({
          caseId: workingCase.id,
          courtSessionId,
          mergedCaseId,
          stringType: CourtSessionStringType.ENTRIES,
          value: updatedCourtSessionString.value,
        })
      }
    },
    [setWorkingCase, updateCourtSessionString, workingCase.id],
  )

  const getInitialAttendees = useCallback(() => {
    const attendees = []
    if (workingCase.prosecutor) {
      attendees.push(
        `${workingCase.prosecutor.name} ${lowercase(
          workingCase.prosecutor.title,
        )}`,
      )
    }

    if (workingCase.defendants && workingCase.defendants.length > 0) {
      workingCase.defendants.forEach((defendant) => {
        if (defendant.defenderName) {
          attendees.push(
            `\n${defendant.defenderName} skipaður verjandi ${defendant.name}`,
          )
        }
        const dob = formatDOB(defendant.nationalId, defendant.noNationalId, '')
        attendees.push(
          `\n${defendant.name} ${getWordByGender(
            Word.AKAERDI,
            defendant.gender,
          )}${dob ? ', ' : ''}${dob}, ${defendant.address}`,
        )
      })
    }

    return `Mættir eru:\n${attendees.join('')}`
  }, [workingCase.prosecutor, workingCase.defendants])

  // No guard against writing into a confirmed session is needed: a confirmed
  // session renders this field disabled, so nothing can be pending, and
  // confirming moves focus off the field, which flushes first.
  const attendeesField = useDebouncedField({
    value: courtSession.attendees ?? getInitialAttendees(),
    onChange: (attendees) => patchSession(courtSession.id, { attendees }),
    onSave: (attendees) =>
      patchSession(courtSession.id, { attendees }, { persist: true }),
  })

  const initialize = useCallback(() => {
    if (courtSession.startDate) {
      return
    }

    const now = formatDateForServer(new Date())
    const startDate =
      getCourtSessionFallbackStartDate(courtSession, workingCase) ?? now
    const judgeId = courtSession.judgeId ?? workingCase.judge?.id
    const location =
      courtSession.location ??
      (workingCase.court?.name
        ? `í ${applyDativeCaseToCourtName(workingCase.court?.name)}`
        : '')
    const attendees = courtSession.attendees ?? getInitialAttendees()
    const endDate = courtSession.endDate ?? (now > startDate ? now : startDate)

    patchSession(
      courtSession.id,
      { startDate, judgeId, location, attendees, endDate },
      { persist: true },
    )
  }, [courtSession, workingCase, getInitialAttendees, patchSession])

  // Initialize when the case is up to date and the accordion item is expanded
  useOnceOn(isCaseUpToDate, () => setReadyForInitialization(true))
  useOnceOn(readyForInitialization && isExpanded, initialize)

  const defaultJudge = judges?.find(
    (judge) => judge.value === (courtSession.judgeId ?? workingCase.judge?.id),
  )

  const handleOnOpen = (id: string) => {
    const filedDocument =
      courtSession.filedDocuments?.find((doc) => doc.id === id) ??
      workingCase.unfiledCourtDocuments?.find((doc) => doc.id === id)

    if (!filedDocument) {
      return
    }

    if (filedDocument.documentType === CourtDocumentType.UPLOADED_DOCUMENT) {
      // A document copied in from a merged case shares the original's case
      // file, which is still that case's - so it is read through the merged
      // case file route, keyed by the case it came from rather than by this
      // one, which now owns the document.
      return onOpen(
        filedDocument.caseFileId ?? '',
        filedDocument.mergedFromCaseId ?? undefined,
      )
    }

    if (filedDocument.documentType === CourtDocumentType.GENERATED_DOCUMENT) {
      window.open(`${api.apiUrl}${filedDocument.generatedPdfUri}`, '_blank')
    }
  }

  const handleDeleteFile = async (file: TUploadFile) => {
    if (!file.id) {
      return
    }

    const id = file.id
    const fileInSession = courtSession.filedDocuments?.find(
      (doc) => doc.id === file.id,
    )

    if (!fileInSession) {
      return
    }

    const deleted = await courtDocument.delete.action({
      caseId: workingCase.id,
      courtSessionId: courtSession.id,
      courtDocumentId: id,
    })

    if (!deleted) {
      return
    }

    if (isKeptWhenRemovedFromCourtSession(fileInSession)) {
      setWorkingCase((prev) => ({
        ...prev,
        unfiledCourtDocuments: [
          fileInSession,
          ...(prev.unfiledCourtDocuments || []),
        ],
      }))
    }

    patchSession(courtSession.id, {
      filedDocuments: courtSession.filedDocuments?.filter(
        (i) => i.id !== file.id,
      ),
    })
  }

  const getFiledDocumentIndex = (fileIndex: number) =>
    countDocumentsBeforeSession(index) + fileIndex || 0

  // NOTE: - Properties in newOrder documents will not contain the correct state when it comes to document order.
  // In the court record, we always re-compute the file orders in the client file ordering component,
  // and we additionally calculate it when posting the order changes for a given document to the server.
  // Thus when updating the state, the main thing we are updating here is the new order of the docs and we technically disregard
  // all the state related document properties that represent the document order.

  // - Updates the state for every reordered item where there will be a state change for every item
  // that the target item is dragged over
  //
  // A section is dragged within itself: the copies of a merged case are that
  // case's part of the record and stay together, and the case's own documents
  // cannot be dropped into the middle of them. The server refuses either, so
  // the drop is never offered.
  const handleReorder = (
    mergedFromCaseId: string | undefined,
    newOrder: CourtDocumentResponse[],
  ) => {
    if (courtSession.isConfirmed) {
      return
    }

    patchSession(courtSession.id, {
      filedDocuments: reorderCourtSessionSection(
        documentSections,
        mergedFromCaseId,
        newOrder,
      ),
    })
  }

  // we only trigger this when an document item is dropped when reordering files
  const handleOnDragEnd = () => {
    if (courtSession.isConfirmed || !draggedFileId) {
      return
    }

    const position = arrangeCourtSessionDocuments(documentSections).findIndex(
      (document) => document.id === draggedFileId,
    )

    if (position === -1) {
      return
    }

    courtDocument.update.action({
      caseId: workingCase.id,
      courtSessionId: courtSession.id,
      courtDocumentId: draggedFileId,
      documentOrder: getFiledDocumentIndex(position) + 1,
    })
  }

  // Puts a document the court has just laid before it where the court record
  // shows it, and tells the server so when that is not where it filed it. The
  // server files one of the case's own documents at the end of the session,
  // behind the merged cases' sections; the record lists the case's own
  // documents first, so the two have to be brought back together - otherwise
  // the number on screen and the number in the court record PDF differ.
  const fileCourtDocumentInRecord = (
    courtDocumentToFile: CourtDocumentResponse,
  ) => {
    const { arrangement, position } = placeFiledCourtDocument(
      documentSections,
      courtDocumentToFile,
    )

    patchSession(courtSession.id, { filedDocuments: arrangement })

    const documentOrder = getFiledDocumentIndex(position) + 1

    if (courtDocumentToFile.documentOrder !== documentOrder) {
      courtDocument.update.action({
        caseId: workingCase.id,
        courtSessionId: courtSession.id,
        courtDocumentId: courtDocumentToFile.id,
        documentOrder,
      })
    }
  }

  const handleUpdateFile = (
    courtSessionId: string,
    fileId: string,
    update: { name?: string; submittedBy?: string | null },
  ) => {
    courtDocument.update.action({
      caseId: workingCase.id,
      courtSessionId,
      courtDocumentId: fileId,
      name: update.name,
      submittedBy: update.submittedBy,
    })

    const updates = {
      filedDocuments: courtSession.filedDocuments?.map((file) =>
        file.id === fileId
          ? {
              ...file,
              name: update.name ?? file.name,
              submittedBy: update.submittedBy ?? file.submittedBy,
            }
          : file,
      ),
    }

    patchSession(courtSession.id, updates)
  }

  const handleFileCourtDocument = async (file: CourtDocumentResponse) => {
    const res = await courtDocument.fileInCourtSession.action({
      caseId: workingCase.id,
      courtSessionId: courtSession.id,
      courtDocumentId: file.id,
    })

    if (!res) return

    setWorkingCase((prev) => ({
      ...prev,
      unfiledCourtDocuments: prev.unfiledCourtDocuments?.filter(
        (item) => item.id !== file.id,
      ),
    }))

    fileCourtDocumentInRecord(res)
  }

  const handleChangeWitness = (value?: string | null) => {
    const selectedUser = [...districtCourtAssistants, ...registrars].find(
      (u) => u.value === value,
    )

    if (!selectedUser) {
      return
    }

    patchSession(courtSession.id, {
      attestingWitness: {
        id: selectedUser.value || '',
        name: selectedUser.label,
      },
    })

    patchSession(
      courtSession.id,
      { attestingWitnessId: value },
      { persist: true },
    )
  }

  const handleEndTimeChange = (date: Date | undefined, valid: boolean) => {
    if (!date || !valid) {
      return
    }

    const startDate = courtSession.startDate
      ? new Date(courtSession.startDate)
      : new Date()

    const merged = new Date(startDate)
    merged.setHours(date.getHours(), date.getMinutes(), 0, 0)

    if (merged < startDate) {
      toast.error('Þinghaldi slitið má ekki vera á undan Þinghald hófst')
      return
    }

    patchSession(
      courtSession.id,
      { endDate: formatDateForServer(merged) },
      { persist: true },
    )
  }

  const handleAddCourtDocument = async (
    value: string,
    courtSessionId: string,
  ) => {
    const res = await courtDocument.create.action({
      caseId: workingCase.id,
      courtSessionId,
      name: value,
    })

    if (!res) return

    fileCourtDocumentInRecord(res)
  }

  const handleDeleteCourtSession = async (courtSessionId: string) => {
    const deleted = await deleteCourtSession({
      caseId: workingCase.id,
      courtSessionId,
    })

    if (!deleted) {
      return
    }

    setWorkingCase((prev) => ({
      ...prev,
      courtSessions: prev.courtSessions?.filter(
        (session) => session.id !== courtSessionId,
      ),
    }))

    setModalVisible(undefined)
  }

  const containerVariants = {
    hidden: { height: 0 },
    visible: { height: 'auto' },
    exit: { height: 0, transition: { duration: 0.6 } },
  }

  const titleVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0, marginBottom: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      marginTop: `${theme.spacing[2]}px`,
      marginBottom: `${theme.spacing[2]}px`,
    },
    exit: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
      transition: { delay: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3 } },
    exit: { opacity: 0 },
  }

  const documentSections = groupCourtSessionDocuments({
    courtSessionId: courtSession.id,
    courtSessions: workingCase.courtSessions,
    unfiledCourtDocuments: workingCase.unfiledCourtDocuments,
    mergedCases: workingCase.mergedCases,
  })

  const countDocumentsBeforeSession = (index: number) => {
    const sessionsBefore = workingCase.courtSessions?.slice(0, index) || []

    return sessionsBefore.reduce(
      (acc, session) => acc + (session.filedDocuments?.length || 0),
      0,
    )
  }

  const isLastCourtSession = index + 1 === workingCase.courtSessions?.length

  const availableRulingOrders = useMemo(
    () => rulingOrderChoices(workingCase, courtSession),
    [workingCase, courtSession],
  )
  const pronouncedOrally = availableRulingOrders.pronouncedOrally

  // The same fallback the backend uses when it stores the name, so the court is
  // not shown one name before pronouncing and given another after. Deliberately
  // not getCourtSessionFallbackStartDate, whose court/arraignment dates the
  // backend does not consider.
  const pronouncedOrallyPreviewName = formatRulingOrderPronouncedOrallyName(
    workingCase.courtCaseNumber,
    courtSession.startDate ?? new Date(),
  )

  const accordionTitle = useMemo(() => {
    const dateLabel = formatDate(
      getCourtSessionFallbackStartDate(courtSession, workingCase),
    )
    return dateLabel
      ? `Þinghald ${index + 1} - ${dateLabel}`
      : `Þinghald ${index + 1}`
  }, [courtSession, workingCase, index])

  useEffect(() => {
    if (isExpanded && !courtSession.isConfirmed) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isExpanded, courtSession.isConfirmed])

  const courtDocumentSupplement = (item: CourtDocumentResponse): Supplement => {
    if (item.documentType === CourtDocumentType.EXTERNAL_DOCUMENT) {
      const split = item.submittedBy?.split('|')
      const enabled = (
        <Box marginTop={1}>
          <SelectRepresentative
            submitterName={split?.[0]}
            caseFileCategory={split?.[1] as CaseFileCategory}
            placeholder="Hver lagði fram?"
            size="small"
            updateRepresentative={(submitterName, caseFileCategory) => {
              handleUpdateFile(courtSession.id, item.id, {
                submittedBy:
                  submitterName && caseFileCategory
                    ? `${submitterName}|${caseFileCategory}`
                    : null,
              })
            }}
          />
        </Box>
      )
      const disabled = split ? (
        <Text variant="small" color="currentColor">
          {`${split[0]} (${getRoleTitleFromCaseFileCategory(
            split[1] as CaseFileCategory,
            { notRegistered: 'Málsaðili' },
          )})`}
        </Text>
      ) : null

      return { enabled, disabled }
    }

    if (item.documentType === CourtDocumentType.UPLOADED_DOCUMENT) {
      // A copy from a merged case points at that case's file, which is not
      // among this case's, so it falls through to the plain wording.
      const file = workingCase.caseFiles?.find(
        (file) => file.id === item.caseFileId,
      )

      if (
        file &&
        file.category &&
        [
          CaseFileCategory.PROSECUTOR_CASE_FILE,
          CaseFileCategory.DEFENDANT_CASE_FILE,
          CaseFileCategory.INDEPENDENT_DEFENDANT_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE,
          CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE,
        ].includes(file.category)
      ) {
        const node = (
          <Text variant="small" color="currentColor">
            {`${
              file.fileRepresentative ?? file.submittedBy
            } (${getRoleTitleFromCaseFileCategory(file.category, {
              notRegistered: 'Málsaðili',
            })})`}
          </Text>
        )

        return { enabled: node, disabled: node }
      }
    }

    const node = (
      <Text variant="small" color="currentColor">
        Lagt er fram
      </Text>
    )

    return { enabled: node, disabled: node }
  }

  const renderCourtDocument = (item: CourtDocumentResponse) => (
    <Reorder.Item
      key={item.id}
      value={item}
      drag={!courtSession.isConfirmed}
      data-reorder-item
      onDragStart={() => {
        setDraggedFileId(item.id)
      }}
      onDragEnd={() => {
        handleOnDragEnd()
        setDraggedFileId(null)
      }}
      initial={{ opacity: 0, y: -10, height: 101 }}
      animate={{ opacity: 1, y: 0, height: 101 }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <EditableCaseFile
        enableDrag
        caseFile={{
          id: item.id,
          displayText: item.name,
          name: item.name,
          canOpen: item.documentType !== CourtDocumentType.EXTERNAL_DOCUMENT,
          canEdit: ['fileName'],
          supplement: courtDocumentSupplement(item),
        }}
        backgroundColor="white"
        onOpen={handleOnOpen}
        onRename={(id: string, name: string) => {
          handleUpdateFile(courtSession.id, id, { name })
        }}
        onDelete={handleDeleteFile}
        disabled={courtSession.isConfirmed || false}
      />
    </Reorder.Item>
  )

  // The number the court record gives a document, counted over the session's
  // documents as the record arranges them and over every session before it.
  const renderCourtDocumentNumber = (position: number) => {
    const currentIndex = getFiledDocumentIndex(position)

    return (
      <motion.div
        initial={{ opacity: 0, y: -10, height: 'auto' }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: 10, height: 0 }}
        transition={{ duration: 0.2 }}
        key={`þingmerkt_nr_${currentIndex + 1}`}
      >
        <Tag variant="darkerBlue" outlined disabled>
          Þingmerkt nr. {currentIndex + 1}
        </Tag>
      </motion.div>
    )
  }

  const renderCourtDocuments = (
    documents: CourtDocumentResponse[],
    mergedFromCaseId: string | undefined,
    offset: number,
  ) => (
    <Box display="flex" columnGap={2} justifyContent="spaceBetween">
      <Reorder.Group
        axis="y"
        values={documents}
        onReorder={(newOrder: CourtDocumentResponse[]) =>
          handleReorder(mergedFromCaseId, newOrder)
        }
        className={styles.grid}
      >
        <AnimatePresence>{documents.map(renderCourtDocument)}</AnimatePresence>
      </Reorder.Group>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="spaceAround"
        rowGap={2}
      >
        <AnimatePresence>
          {documents.map((_item, i) => renderCourtDocumentNumber(offset + i))}
        </AnimatePresence>
      </Box>
    </Box>
  )

  // Always rendered, even when empty, so the court can see at a glance that a
  // list holds everything it should - and so a merged case whose documents were
  // all taken out of the record still has somewhere to put them back.
  const renderUnfiledCourtDocuments = (
    id: string,
    documents: CourtDocumentResponse[],
    emptyMessage: string,
  ) => (
    <Box borderRadius="large" background="white" paddingX={2}>
      <Accordion dividerOnBottom={false} dividerOnTop={false}>
        <AccordionItem
          id={id}
          label={`Önnur skjöl (${documents.length})`}
          labelVariant="h5"
        >
          {documents.length === 0 ? (
            <AlertMessage
              title="Engin óþingmerkt skjöl"
              message={emptyMessage}
              type="success"
            />
          ) : (
            <UnfiledCourtDocumentList
              courtDocuments={documents}
              isDisabled={
                courtDocument.isLoading || courtSession.isConfirmed || false
              }
              onOpen={handleOnOpen}
              onFile={handleFileCourtDocument}
            />
          )}
        </AccordionItem>
      </Accordion>
    </Box>
  )
  return (
    <Box
      component="span"
      onMouseOver={() =>
        ref.current && ref.current.style.setProperty('z-index', '50')
      }
      onMouseOut={() =>
        ref.current && ref.current.style.setProperty('z-index', null)
      }
    >
      <AccordionItem
        id={`courtRecordAccordionItem-${courtSession.id}`}
        label={
          <CourtSessionLabel
            label={accordionTitle}
            ref={ref}
            isConfirmed={courtSession.isConfirmed}
          />
        }
        labelVariant="h3"
        expanded={isExpanded}
        onToggle={onToggle}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flexEnd"
          rowGap={5}
          paddingY={3}
        >
          {isLastCourtSession && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flexEnd"
              rowGap={1}
            >
              {/* The appeal is not the court record's to discard: deleting the
              session would leave it pointing at a ruling no court record says
              was pronounced, hiding it from the parties who appealed it.
              courtSession.service.validateCourtSessionDeletionAllowed rejects
              the same deletion server-side. */}
              {rulingHasBeenAppealed && (
                <AlertMessage
                  type="info"
                  message="Úrskurður sem kveðinn var upp í þinghaldinu hefur verið kærður og því er ekki hægt að eyða þinghaldinu."
                />
              )}
              <Button
                variant="text"
                colorScheme="destructive"
                size="small"
                icon="trash"
                onClick={() => setModalVisible('DELETE')}
                disabled={rulingHasBeenAppealed}
              >
                Eyða
              </Button>
            </Box>
          )}
          <LayoutGroup>
            <Box
              id={`courtRecordAccordionItemFirstSection-${courtSession.id}`}
              className={styles.containerGrid}
            >
              <BlueBox>
                <div className={styles.grid}>
                  <DateTime
                    name="courtStartDate"
                    datepickerLabel="Dagsetning þinghalds"
                    timeLabel="Þinghald hófst (kk:mm)"
                    selectedDate={getCourtSessionFallbackStartDate(
                      courtSession,
                      workingCase,
                    )}
                    onChange={(date: Date | undefined, valid: boolean) => {
                      if (date && valid) {
                        patchSession(
                          courtSession.id,
                          { startDate: formatDateForServer(date) },
                          { persist: true },
                        )
                      }
                    }}
                    disabled={courtSession.isConfirmed || false}
                    blueBox={false}
                    required
                  />
                  <Select
                    name="judge"
                    label="Veldu dómara/aðstoðarmann"
                    placeholder="Veldu héraðsdómara"
                    value={defaultJudge}
                    options={judges}
                    onChange={(selectedOption) => {
                      const selectedUser = judges.find(
                        (u) => u.value === selectedOption?.value,
                      )
                      if (!selectedUser) {
                        return
                      }
                      patchSession(courtSession.id, {
                        judge: {
                          id: selectedUser.value || '',
                          name: selectedUser.label,
                        },
                      })

                      patchSession(
                        courtSession.id,
                        { judgeId: selectedUser.value },
                        { persist: true },
                      )
                    }}
                    required
                    isDisabled={
                      usersLoading || courtSession.isConfirmed || false
                    }
                  />
                  <Input
                    data-testid="courtLocation"
                    name="courtLocation"
                    tooltip='Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.'
                    label="Hvar var dómþing haldið?"
                    value={
                      courtSession.location ??
                      (workingCase.court?.name
                        ? `í ${applyDativeCaseToCourtName(
                            workingCase.court?.name,
                          )}`
                        : '')
                    }
                    placeholder='Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"'
                    onChange={(event) => {
                      setLocationErrorMessage('')
                      patchSession(courtSession.id, {
                        location: event.target.value,
                      })
                    }}
                    onBlur={(event) => {
                      const location = event.target.value

                      validateAndSetErrorMessage(
                        ['empty'],
                        location,
                        setLocationErrorMessage,
                      )

                      patchSession(
                        courtSession.id,
                        { location },
                        { persist: true },
                      )
                    }}
                    errorMessage={locationErrorMessage}
                    hasError={locationErrorMessage !== ''}
                    autoComplete="off"
                    disabled={courtSession.isConfirmed || false}
                    required
                  />
                  <Checkbox
                    name={`isClosedProceeding-${courtSession.id}`}
                    label="Þinghaldið er lokað"
                    onChange={(evt) =>
                      patchSession(
                        courtSession.id,
                        {
                          isClosed: evt.target.checked,
                          closedLegalProvisions: [],
                        },
                        { persist: true },
                      )
                    }
                    checked={Boolean(courtSession.isClosed)}
                    disabled={courtSession.isConfirmed || false}
                    filled
                    large
                  />
                </div>
                <AnimatePresence>
                  {courtSession.isClosed && (
                    <>
                      <motion.div
                        variants={titleVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <SectionHeading
                          title="Lagaákvæði sem lokun þinghalds byggir á"
                          marginBottom={0}
                          variant="h4"
                          required
                        />
                      </motion.div>
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key="grid"
                      >
                        <motion.div
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <CheckboxList
                            blueBox={false}
                            checkboxes={CLOSURE_GROUNDS.map(
                              ([label, tooltip, legalProvision]) => ({
                                id: `${legalProvision}-${courtSession.id}`,
                                title: label,
                                info: tooltip,
                                checked:
                                  courtSession.closedLegalProvisions?.includes(
                                    legalProvision,
                                  ) ?? false,
                                disabled: courtSession.isConfirmed || false,
                                onChange: (checked) => {
                                  const initialValue =
                                    courtSession.closedLegalProvisions || []

                                  const closedLegalProvisions = checked
                                    ? [...initialValue, legalProvision]
                                    : initialValue.filter(
                                        (v) => v !== legalProvision,
                                      )

                                  patchSession(
                                    courtSession.id,
                                    { closedLegalProvisions },
                                    { persist: true },
                                  )
                                },
                              }),
                            )}
                          />
                        </motion.div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </BlueBox>
              <Input
                data-testid="courtAttendees"
                name="courtAttendees"
                label="Mættir eru"
                value={attendeesField.value}
                placeholder="Skrifa hér..."
                onChange={(event) =>
                  attendeesField.onChange(event.target.value)
                }
                onBlur={(event) => attendeesField.onBlur(event.target.value)}
                textarea
                rows={7}
                disabled={courtSession.isConfirmed || false}
              />
              <MultipleValueList
                onAddValue={(val) =>
                  handleAddCourtDocument(val, courtSession.id)
                }
                inputLabel="Heiti dómskjals"
                inputPlaceholder={
                  !courtSession.isConfirmed ? 'Skrá inn heiti á skjali hér' : ''
                }
                buttonText="Bæta við skjali"
                name="indictmentCourtDocuments"
                isButtonDisabled={() =>
                  courtDocument.create.loading ||
                  courtSession.isConfirmed ||
                  false
                }
                isDisabled={courtSession.isConfirmed || false}
                isLoading={courtDocument.create.loading}
              >
                <Box display="flex" flexDirection="column" rowGap={2}>
                  {index > 0 && (
                    <Box
                      background="white"
                      paddingX={3}
                      paddingY={2}
                      borderRadius="large"
                    >
                      <Text variant="h5">{`Skjöl málsins nr. 1-${countDocumentsBeforeSession(
                        index,
                      )} liggja frammi`}</Text>
                    </Box>
                  )}
                  {documentSections.ownFiledDocuments.length > 0 &&
                    renderCourtDocuments(
                      documentSections.ownFiledDocuments,
                      undefined,
                      0,
                    )}
                  {renderUnfiledCourtDocuments(
                    `unfiled-files-${courtSession.id}`,
                    documentSections.ownUnfiledDocuments,
                    'Öll skjöl málsins hafa verið lögð fram',
                  )}
                </Box>
              </MultipleValueList>
              {documentSections.mergedCaseSections.map((section) => (
                // Keyed by merged case id, not court case number: the number
                // falls back to an empty string, so two unnumbered merged
                // cases would collide and React would hand one row's
                // debounced entries to the other.
                <Box key={`merged-case-${section.mergedFromCaseId}`}>
                  {/* Bookings are asked for only where there is something to
                  book about - a merged case whose documents have all been taken
                  out of the record is not part of this session's account of
                  itself, and the confirm check does not ask for it either. */}
                  {section.filedDocuments.length > 0 && (
                    <CourtSessionMergedCaseEntries
                      courtSessionId={courtSession.id}
                      courtCaseNumber={section.courtCaseNumber}
                      courtSessionString={courtSession.courtSessionStrings?.find(
                        (string) =>
                          string.stringType ===
                            CourtSessionStringType.ENTRIES &&
                          string.mergedCaseId === section.mergedFromCaseId,
                      )}
                      mergedCaseId={section.mergedFromCaseId}
                      disabled={courtSession.isConfirmed || false}
                      patchCourtSessionStrings={patchCourtSessionStrings}
                    />
                  )}
                  <SectionHeading
                    title={`Dómskjöl úr sameinuðu máli ${section.courtCaseNumber}`}
                  />
                  <BlueBox>
                    <Box display="flex" flexDirection="column" rowGap={2}>
                      {section.filedDocuments.length > 0 &&
                        renderCourtDocuments(
                          section.filedDocuments,
                          section.mergedFromCaseId,
                          section.offset,
                        )}
                      {renderUnfiledCourtDocuments(
                        `unfiled-merged-case-files-${courtSession.id}-${section.mergedFromCaseId}`,
                        section.unfiledDocuments,
                        'Öll skjöl sameinaða málsins hafa verið lögð fram',
                      )}
                    </Box>
                  </BlueBox>
                </Box>
              ))}
              <Box>
                <SectionHeading title="Bókanir" />
                <RichTextEditor
                  data-testid="entries"
                  label="Afstaða ákærða, málflutningur og aðrar bókanir"
                  placeholder="Nánari útlistun á afstöðu ákærða, málflutningsræður og annað sem fram kom í þinghaldi er skráð hér."
                  defaultValue={courtSession.entries || ''}
                  onChange={(html) => {
                    setEntriesErrorMessage('')
                    patchSession(courtSession.id, { entries: html })
                  }}
                  onDebouncedChange={(html) =>
                    patchSession(
                      courtSession.id,
                      { entries: html },
                      { persist: true },
                    )
                  }
                  onBlur={(html) => {
                    // RichTextEditor normalizes blank documents to '' on output.
                    validateAndSetErrorMessage(
                      ['empty'],
                      html,
                      setEntriesErrorMessage,
                    )
                    patchSession(
                      courtSession.id,
                      { entries: html },
                      { persist: true },
                    )
                  }}
                  errorMessage={entriesErrorMessage || undefined}
                  disabled={courtSession.isConfirmed || false}
                  required
                />
              </Box>
              <Box>
                <SectionHeading
                  title="Er kveðinn upp dómur eða úrskurður í þinghaldinu?"
                  required
                />
                {/* Only shown while the session is open for correction - a
                confirmed session disables everything anyway, and the reason is
                then obvious. */}
                {rulingRemovalLock && !courtSession.isConfirmed && (
                  <Box marginBottom={2}>
                    <AlertMessage
                      type="info"
                      message={`${
                        rulingRemovalLock === 'OUT_OF_COURT'
                          ? 'Úrskurðurinn hefur verið kærður utan þinghalds'
                          : 'Kæra úrskurðarins er komin til Landsréttar'
                      } og því er ekki hægt að fella úrskurðinn úr þingbókinni. Áfram er hægt að velja annað skjal fyrir úrskurðinn.`}
                    />
                  </Box>
                )}
                <BlueBox className={styles.grid}>
                  <RadioButton
                    name="result_verdict"
                    id={`result_no-${courtSession.id}`}
                    label="Nei"
                    backgroundColor="white"
                    checked={
                      courtSession.rulingType === CourtSessionRulingType.NONE
                    }
                    onChange={() =>
                      patchSession(
                        courtSession.id,
                        {
                          rulingType: CourtSessionRulingType.NONE,
                          ruling: '',
                          closingEntries: '',
                          rulingFileId: null,
                        },
                        { persist: true },
                      )
                    }
                    disabled={rulingRemovalDisabled || false}
                    large
                  />
                  <RadioButton
                    name="result_verdict"
                    id={`result_verdict-${courtSession.id}`}
                    label="Dómur kveðinn upp"
                    backgroundColor="white"
                    checked={
                      courtSession.rulingType ===
                      CourtSessionRulingType.JUDGEMENT
                    }
                    onChange={() =>
                      patchSession(
                        courtSession.id,
                        {
                          rulingType: CourtSessionRulingType.JUDGEMENT,
                          rulingFileId: null,
                        },
                        { persist: true },
                      )
                    }
                    disabled={rulingRemovalDisabled || false}
                    large
                  />
                  <RadioButton
                    name="result_verdict"
                    id={`result_dismissal-ruling-${courtSession.id}`}
                    label="Úrskurður vegna frávísunar"
                    backgroundColor="white"
                    checked={
                      courtSession.rulingType ===
                      CourtSessionRulingType.DISMISSAL_ORDER
                    }
                    onChange={() =>
                      patchSession(
                        courtSession.id,
                        {
                          rulingType: CourtSessionRulingType.DISMISSAL_ORDER,
                          rulingFileId: null,
                        },
                        { persist: true },
                      )
                    }
                    disabled={rulingRemovalDisabled || false}
                    large
                  />
                  <RadioButton
                    name="result_verdict"
                    id={`result_ruling-${courtSession.id}`}
                    label="Úrskurður undir rekstri máls"
                    backgroundColor="white"
                    checked={
                      courtSession.rulingType === CourtSessionRulingType.ORDER
                    }
                    onChange={() =>
                      patchSession(
                        courtSession.id,
                        { rulingType: CourtSessionRulingType.ORDER },
                        { persist: true },
                      )
                    }
                    disabled={rulingRemovalDisabled || false}
                    large
                  />
                  {courtSession.rulingType === CourtSessionRulingType.ORDER && (
                    <Box>
                      <Box marginBottom={2}>
                        <Text variant="h5" as="h4">
                          Veldu úrskurð undir rekstri máls
                        </Text>
                      </Box>
                      <Box className={styles.grid}>
                        {availableRulingOrders.files.length === 0 && (
                          <AlertMessage
                            type="info"
                            message="Enginn skriflegur úrskurður fannst"
                          />
                        )}
                        <Box className={styles.grid}>
                          {availableRulingOrders.files.map((file) => {
                            const takenByOther =
                              availableRulingOrders.takenIds.has(file.id) &&
                              courtSession.rulingFileId !== file.id
                            return (
                              <RadioButton
                                key={file.id}
                                name={`result_ruling_file-${courtSession.id}`}
                                id={`result_ruling_file-${file.id}-${courtSession.id}`}
                                label={`${
                                  file.userGeneratedFilename ?? file.name ?? ''
                                }`}
                                backgroundColor="white"
                                checked={courtSession.rulingFileId === file.id}
                                onChange={() =>
                                  patchSession(
                                    courtSession.id,
                                    { rulingFileId: file.id },
                                    { persist: true },
                                  )
                                }
                                disabled={
                                  Boolean(courtSession.isConfirmed) ||
                                  takenByOther
                                }
                                large
                              />
                            )
                          })}
                        </Box>
                        <RadioButton
                          name={`result_ruling_file-${courtSession.id}`}
                          id={`result_ruling_pronounced_orally-${courtSession.id}`}
                          label={
                            pronouncedOrally?.userGeneratedFilename ??
                            pronouncedOrally?.name ??
                            pronouncedOrallyPreviewName
                          }
                          subLabel="Úrskurður kveðinn upp munnlega"
                          backgroundColor="white"
                          checked={Boolean(pronouncedOrally)}
                          onChange={() =>
                            pronouncedOrally
                              ? undefined
                              : pronounceRulingOrallyInSession()
                          }
                          disabled={
                            Boolean(courtSession.isConfirmed) ||
                            isPronouncingOrally
                          }
                          large
                        />
                      </Box>
                    </Box>
                  )}
                </BlueBox>
              </Box>
              {(courtSession.rulingType === CourtSessionRulingType.JUDGEMENT ||
                courtSession.rulingType ===
                  CourtSessionRulingType.DISMISSAL_ORDER ||
                courtSession.rulingType === CourtSessionRulingType.ORDER) && (
                <CourtSessionRuling
                  courtSession={courtSession}
                  patchSession={patchSession}
                />
              )}
              <Box>
                <SectionHeading title="Vottur" />
                <BlueBox className={styles.grid}>
                  <Checkbox
                    label="Skrá vott að þinghaldi"
                    name={`isAttestingWitness-${courtSession.id}`}
                    checked={courtSession.isAttestingWitness || false}
                    onChange={(evt) => {
                      patchSession(courtSession.id, {
                        attestingWitness: evt.target.checked
                          ? courtSession.attestingWitness ?? null
                          : null,
                      })

                      patchSession(
                        courtSession.id,
                        {
                          isAttestingWitness: evt.target.checked,
                          attestingWitnessId: evt.target.checked
                            ? courtSession.attestingWitnessId ?? null
                            : null,
                        },
                        { persist: true },
                      )
                    }}
                    disabled={courtSession.isConfirmed || false}
                    large
                    filled
                  />
                  <Select
                    name="courtUsers"
                    options={[...districtCourtAssistants, ...registrars].sort(
                      (a, b) => a.label.localeCompare(b.label),
                    )}
                    value={
                      courtSession.attestingWitness
                        ? {
                            label: courtSession.attestingWitness.name || '',
                            value: courtSession.attestingWitnessId,
                          }
                        : null
                    }
                    onChange={(evt) => handleChangeWitness(evt?.value)}
                    size="md"
                    label="Veldu vott"
                    placeholder="Veldu vott að þinghaldi"
                    isDisabled={
                      !courtSession.isAttestingWitness ||
                      courtSession.isConfirmed ||
                      false
                    }
                    isLoading={usersLoading}
                    required
                  />
                </BlueBox>
              </Box>
              <Box>
                <SectionHeading title="Þinghaldi slitið" />
                <BlueBox className={styles.courtEndTimeContainer}>
                  <div className={styles.fullWidth}>
                    <DateTime
                      name="courtEndTime"
                      onChange={handleEndTimeChange}
                      blueBox={false}
                      selectedDate={
                        courtSession.endDate
                          ? new Date(courtSession.endDate)
                          : courtSession.startDate
                          ? new Date(courtSession.startDate)
                          : new Date()
                      }
                      disabled={courtSession.isConfirmed || false}
                      timeOnly
                    />
                  </div>
                  <Box className={styles.button}>
                    {courtSession.isConfirmed ? (
                      <Button
                        icon="pencil"
                        onClick={() =>
                          patchSession(
                            courtSession.id,
                            { isConfirmed: false },
                            { persist: true },
                          )
                        }
                        size="small"
                      >
                        Leiðrétta þingbók
                      </Button>
                    ) : (
                      <Button
                        dataTestId="confirm-court-record"
                        icon="checkmark"
                        onClick={() =>
                          patchSession(
                            courtSession.id,
                            { isConfirmed: true },
                            { persist: true },
                          )
                        }
                        size="small"
                        disabled={
                          !isCourtSessionValid(courtSession, workingCase)
                        }
                      >
                        Staðfesta þingbók
                      </Button>
                    )}
                  </Box>
                </BlueBox>
              </Box>
            </Box>
          </LayoutGroup>
          {modalVisible === 'DELETE' && (
            <Modal
              title="Ertu viss?"
              text={`Ertu viss um að þú viljir eyða þinghaldi ${index + 1}?`}
              buttons={[
                {
                  text: 'Hætta við',
                  onClick: () => setModalVisible(undefined),
                  variant: 'ghost',
                },
                {
                  text: 'Já, eyða',
                  colorScheme: 'destructive',
                  onClick: () => handleDeleteCourtSession(courtSession.id),
                },
              ]}
            />
          )}
        </Box>
        <AnimatePresence>
          {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
        </AnimatePresence>
      </AccordionItem>
    </Box>
  )
}
export default CourtSessionAccordionItem
