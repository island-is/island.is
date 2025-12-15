import {
  FC,
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import _uniqBy from 'lodash/uniqBy'
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
  toast,
  Tooltip,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  applyDativeCaseToCourtName,
  formatDOB,
  getRoleTitleFromCaseFileCategory,
  lowercase,
} from '@island.is/judicial-system/formatters'
import {
  BlueBox,
  DateTime,
  FileNotFoundModal,
  FormContext,
  Modal,
  MultipleValueList,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import EditableCaseFile, {
  Supplement,
} from '@island.is/judicial-system-web/src/components/EditableCaseFile/EditableCaseFile'
import {
  CaseFileCategory,
  CourtDocumentResponse,
  CourtDocumentType,
  CourtSessionClosedLegalBasis,
  CourtSessionResponse,
  CourtSessionRulingType,
  CourtSessionString,
  CourtSessionStringType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { api } from '@island.is/judicial-system-web/src/services'
import { validateAndSetErrorMessage } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  TUploadFile,
  useCourtDocuments,
  useCourtSessions,
  useFileList,
  useOnceOn,
  useUsers,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isCourtSessionValid } from '@island.is/judicial-system-web/src/utils/validate'

import { SelectRepresentative } from '../../../Shared/AddFiles/SelectCaseFileRepresentative'
import { CourtSessionMergedCaseEntries } from './CourtSessionMergedCaseEntries'
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
  const { workingCase, setWorkingCase, isCaseUpToDate } =
    useContext(FormContext)
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })
  const { courtDocument } = useCourtDocuments()
  const { updateCourtSession, updateCourtSessionString, deleteCourtSession } =
    useCourtSessions()
  const [readyForInitialization, setReadyForInitialization] = useState(false)
  const [locationErrorMessage, setLocationErrorMessage] = useState<string>('')
  const [entriesErrorMessage, setEntriesErrorMessage] = useState<string>('')
  const [rulingErrorMessage, setRulingErrorMessage] = useState<string>('')
  const [draggedFileId, setDraggedFileId] = useState<string | null>(null)
  const [draggedMergeFileId, setDraggedMergeFileId] = useState<string | null>(
    null,
  )

  const [modalVisible, setModalVisible] = useState<'DELETE'>()

  const {
    judges,
    districtCourtAssistants,
    registrars,
    loading: usersLoading,
  } = useUsers(workingCase.court?.id)

  const patchSession = useCallback(
    (
      courtSessionId: string,
      updates: Partial<CourtSessionResponse>,
      { persist = false } = {},
    ) => {
      setWorkingCase((prev) => ({
        ...prev,
        courtSessions: prev.courtSessions?.map((session) =>
          session.id === courtSessionId ? { ...session, ...updates } : session,
        ),
      }))

      if (persist) {
        const { courtSessionStrings, ...courtSessionUpdate } = updates
        updateCourtSession({
          ...courtSessionUpdate,
          courtSessionId,
          caseId: workingCase.id,
        })
      }
    },
    [setWorkingCase, updateCourtSession, workingCase.id],
  )

  const patchCourtSessionStrings = useCallback(
    (
      courtSessionId: string,
      mergedCaseId: string,
      updatedCourtSessionString: Pick<CourtSessionString, 'value'>,
      { persist = false } = {},
    ) => {
      const targetCourtSessionString = courtSession.courtSessionStrings?.find(
        (courtSessionString) =>
          courtSessionString.courtSessionId === courtSessionId &&
          courtSessionString.mergedCaseId === mergedCaseId &&
          courtSessionString.stringType === CourtSessionStringType.ENTRIES,
      )

      const updatedCourtSessionsStrings = targetCourtSessionString
        ? courtSession.courtSessionStrings?.map((courtSessionString) =>
            courtSessionString.id === targetCourtSessionString?.id
              ? {
                  ...courtSessionString,
                  value: updatedCourtSessionString.value,
                }
              : courtSessionString,
          )
        : [
            ...(courtSession.courtSessionStrings ?? []),
            {
              caseId: workingCase.id,
              courtSessionId,
              mergedCaseId,
              stringType: CourtSessionStringType.ENTRIES,
              value: updatedCourtSessionString.value,
            } as CourtSessionString,
          ]
      setWorkingCase((prev) => ({
        ...prev,
        courtSessions: prev.courtSessions?.map((session) =>
          session.id === courtSessionId
            ? { ...session, courtSessionStrings: updatedCourtSessionsStrings }
            : session,
        ),
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
    [
      courtSession.courtSessionStrings,
      setWorkingCase,
      updateCourtSessionString,
      workingCase.id,
    ],
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
          `\n${defendant.name} ákærði${dob ? ', ' : ''}${dob}, ${
            defendant.address
          }`,
        )
      })
    }

    return attendees.length > 0 ? attendees.join('') : undefined
  }, [workingCase.prosecutor, workingCase.defendants])

  const initialize = useCallback(() => {
    if (courtSession.startDate) {
      return
    }

    const now = formatDateForServer(new Date())
    const startDate =
      courtSession.startDate ??
      workingCase.courtDate?.date ??
      workingCase.arraignmentDate?.date ??
      now
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
  }, [
    courtSession,
    workingCase.judge?.id,
    workingCase.courtDate?.date,
    workingCase.arraignmentDate?.date,
    workingCase.court?.name,
    getInitialAttendees,
    patchSession,
  ])

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
      return onOpen(filedDocument.caseFileId ?? '')
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

    if (fileInSession.documentType !== CourtDocumentType.EXTERNAL_DOCUMENT) {
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

  const getMergedDocumentIndex = (fileIndex: number) => {
    const previousCourtSessionDocumentCount = countDocumentsBeforeSession(index)
    const currentCourtSessionFiledDocumentCount = filedDocuments?.length || 0

    return (
      previousCourtSessionDocumentCount +
      currentCourtSessionFiledDocumentCount +
      fileIndex
    )
  }

  const getFiledDocumentIndex = (fileIndex: number) =>
    countDocumentsBeforeSession(index) + fileIndex || 0

  // NOTE: - Properties in newOrder documents will not contain the correct state when it comes to document order.
  // In the court record, we always re-compute the file orders and merged filed orders in the client file ordering component,
  // and we additionally calculate it when posting the order changes for a given document to the server.
  // Thus when updating the state, the main thing we are updating here is the new order of the docs and we technically disregard
  // all the state related document properties that represent the document order.

  // - Updates the state for every reordered item where there will be a state change for every item
  // that the target item is dragged over
  const handleReorder = (newOrder: CourtDocumentResponse[]) => {
    if (courtSession.isConfirmed) {
      return
    }

    const mergedDocument = courtSession.mergedFiledDocuments?.find(
      (d) =>
        courtSession.id === d.mergedCourtSessionId &&
        d.id === draggedMergeFileId,
    )

    if (mergedDocument) {
      // For merged filed documents reordering, the newOrder will only contain the new order for merged documents for a single merged case id.
      // But courtSession.mergedFiledDocuments can contain merged filed documents for many cases that are linked to the same court session.
      // Thus we have to create a new merged documents array to persist the order state for other merged case filed documents.
      const currentMergedDocuments = courtSession.mergedFiledDocuments ?? []
      let newOrderIndex = 0
      const newMergedDocumentsOrder: CourtDocumentResponse[] =
        currentMergedDocuments.map((document) => {
          if (document.caseId !== mergedDocument.caseId) {
            return document
          }

          const reorderedDocument = newOrder[newOrderIndex]
          newOrderIndex += 1
          return reorderedDocument
        })

      if (newOrderIndex !== newOrder.length) {
        return
      }

      patchSession(courtSession.id, {
        mergedFiledDocuments: newMergedDocumentsOrder,
      })
    } else {
      patchSession(courtSession.id, { filedDocuments: newOrder })
    }
  }

  // we only trigger this when an document item is dropped when reordering files
  const handleOnDragEnd = (newOrder: CourtDocumentResponse[]) => {
    if (courtSession.isConfirmed) {
      return
    }

    const mergedDocument = courtSession.mergedFiledDocuments?.find(
      (d) =>
        courtSession.id === d.mergedCourtSessionId &&
        d.id === draggedMergeFileId,
    )

    const fileId = mergedDocument ? draggedMergeFileId : draggedFileId
    const targetFileIndex = newOrder.findIndex((f) => f.id === fileId)
    if (targetFileIndex === -1 || !fileId) {
      return
    }
    const newIndex = mergedDocument
      ? getMergedDocumentIndex(targetFileIndex)
      : getFiledDocumentIndex(targetFileIndex)

    courtDocument.update.action({
      caseId: workingCase.id,
      courtSessionId: courtSession.id,
      courtDocumentId: fileId,
      ...(mergedDocument
        ? { mergedDocumentOrder: newIndex + 1 }
        : { documentOrder: newIndex + 1 }),
    })
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

    const isMergedDocument = courtSession.mergedFiledDocuments?.find(
      (d) => courtSession.id === d.mergedCourtSessionId && d.id === fileId,
    )
    const updates = isMergedDocument
      ? {
          mergedFiledDocuments: courtSession.mergedFiledDocuments?.map((file) =>
            file.id === fileId
              ? {
                  ...file,
                  name: update.name ?? file.name,
                  submittedBy: update.submittedBy ?? file.submittedBy,
                }
              : file,
          ),
        }
      : {
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

    patchSession(courtSession.id, {
      filedDocuments: [...(courtSession.filedDocuments || []), res],
    })
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

    patchSession(courtSession.id, {
      filedDocuments: [...(courtSession.filedDocuments || []), res],
    })
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

  const filedDocuments = useMemo(
    () =>
      workingCase.courtSessions?.find((d) => d.id === courtSession.id)
        ?.filedDocuments || [],
    [courtSession.id, workingCase.courtSessions],
  )

  const mergedCaseDocumentsInCourtSession = useMemo(() => {
    const mergedFileDocuments =
      workingCase.courtSessions?.find((d) => d.id === courtSession.id)
        ?.mergedFiledDocuments || []

    const mergedCaseIds = _uniqBy(
      mergedFileDocuments ?? [],
      (d: CourtDocumentResponse) => d.caseId,
    ).map((document) => document.caseId)

    return mergedCaseIds.map((caseId) => {
      const mergedFileDocumentsPerCase = mergedFileDocuments.filter(
        (document) => document.caseId === caseId,
      )
      return {
        caseId,
        courtCaseNumber:
          workingCase.mergedCases?.find((c) => c.id === caseId)
            ?.courtCaseNumber ?? '',
        mergedFileDocuments: mergedFileDocumentsPerCase,
      }
    })
  }, [courtSession.id, workingCase.courtSessions, workingCase.mergedCases])

  const countDocumentsBeforeSession = (index: number) => {
    const sessionsBefore = workingCase.courtSessions?.slice(0, index) || []

    return sessionsBefore.reduce(
      (acc, session) =>
        (acc =
          acc +
          (session.filedDocuments?.length || 0) +
          (session.mergedFiledDocuments?.length || 0)),
      0,
    )
  }

  const isLastCourtSession =
    index >= 1 && index + 1 === workingCase.courtSessions?.length
  const hasMergedCourtDocuments = courtSession.mergedFiledDocuments?.length

  useEffect(() => {
    if (isExpanded && !courtSession.isConfirmed) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isExpanded, courtSession.isConfirmed])

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
            label={`Þinghald ${index + 1}`}
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
          {/* Note: Disable the option to delete a court session when it contains merged documents. 
        Currently we don't have the option to assign merged documents to a dedicated court session, they are automatically assigned
        to a court session on merge */}
          {isLastCourtSession && !hasMergedCourtDocuments && (
            <Button
              variant="text"
              colorScheme="destructive"
              size="small"
              icon="trash"
              onClick={() => setModalVisible('DELETE')}
            >
              Eyða
            </Button>
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
                    datepickerLabel="Dagsetning þingfestingar"
                    timeLabel="Þinghald hófst (kk:mm)"
                    selectedDate={
                      courtSession.startDate ??
                      workingCase.courtDate?.date ??
                      workingCase.arraignmentDate?.date
                    }
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
                        className={styles.twoColGrid}
                        key="grid"
                      >
                        {CLOSURE_GROUNDS.map(
                          ([label, tooltip, legalProvision]) => (
                            <motion.div
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              key={label}
                            >
                              <Checkbox
                                label={label}
                                name={`${label}-${courtSession.id}`}
                                tooltip={tooltip}
                                checked={courtSession.closedLegalProvisions?.includes(
                                  legalProvision,
                                )}
                                onChange={(evt) => {
                                  const initialValue =
                                    courtSession.closedLegalProvisions || []

                                  const closedLegalProvisions = evt.target
                                    .checked
                                    ? [...initialValue, legalProvision]
                                    : initialValue.filter(
                                        (v) => v !== legalProvision,
                                      )

                                  patchSession(
                                    courtSession.id,
                                    { closedLegalProvisions },
                                    { persist: true },
                                  )
                                }}
                                disabled={courtSession.isConfirmed || false}
                                large
                                filled
                              />
                            </motion.div>
                          ),
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </BlueBox>
              <Input
                data-testid="courtAttendees"
                name="courtAttendees"
                label="Mættir eru"
                value={courtSession.attendees ?? getInitialAttendees()}
                placeholder="Skrifa hér..."
                onChange={(event) => {
                  patchSession(courtSession.id, {
                    attendees: event.target.value,
                  })
                }}
                onBlur={(event) => {
                  patchSession(
                    courtSession.id,
                    { attendees: event.target.value },
                    { persist: true },
                  )
                }}
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
                  {filedDocuments && filedDocuments.length > 0 && (
                    <Box
                      display="flex"
                      columnGap={2}
                      justifyContent="spaceBetween"
                    >
                      <Reorder.Group
                        axis="y"
                        values={filedDocuments}
                        onReorder={handleReorder}
                        className={styles.grid}
                      >
                        <AnimatePresence>
                          {filedDocuments.map((item) => {
                            let supplement: Supplement | undefined = undefined

                            if (
                              item.documentType ===
                              CourtDocumentType.EXTERNAL_DOCUMENT
                            ) {
                              const split = item.submittedBy?.split('|')
                              const enabled = (
                                <Box marginTop={1}>
                                  <SelectRepresentative
                                    submitterName={split?.[0]}
                                    caseFileCategory={
                                      split?.[1] as CaseFileCategory
                                    }
                                    placeholder="Hver lagði fram?"
                                    size="small"
                                    updateRepresentative={(
                                      submitterName,
                                      caseFileCategory,
                                    ) => {
                                      handleUpdateFile(
                                        courtSession.id,
                                        item.id,
                                        {
                                          submittedBy:
                                            submitterName && caseFileCategory
                                              ? `${submitterName}|${caseFileCategory}`
                                              : null,
                                        },
                                      )
                                    }}
                                  />
                                </Box>
                              )
                              const disabled = split ? (
                                <Text variant="small" color="currentColor">
                                  {`${
                                    split[0]
                                  } (${getRoleTitleFromCaseFileCategory(
                                    split[1] as CaseFileCategory,
                                    { notRegistered: 'Málsaðili' },
                                  )})`}
                                </Text>
                              ) : null
                              supplement = { enabled, disabled }
                            } else if (
                              item.documentType ===
                              CourtDocumentType.UPLOADED_DOCUMENT
                            ) {
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
                                      file.fileRepresentative ??
                                      file.submittedBy
                                    } (${getRoleTitleFromCaseFileCategory(
                                      file.category,
                                      { notRegistered: 'Málsaðili' },
                                    )})`}
                                  </Text>
                                )
                                supplement = { enabled: node, disabled: node }
                              } else {
                                const node = (
                                  <Text variant="small" color="currentColor">
                                    Lagt er fram
                                  </Text>
                                )
                                supplement = { enabled: node, disabled: node }
                              }
                            } else {
                              const node = (
                                <Text variant="small" color="currentColor">
                                  Lagt er fram
                                </Text>
                              )
                              supplement = { enabled: node, disabled: node }
                            }

                            return (
                              <Reorder.Item
                                key={item.id}
                                value={item}
                                drag={!courtSession.isConfirmed}
                                data-reorder-item
                                onDragStart={() => {
                                  setDraggedFileId(item.id)
                                }}
                                onDragEnd={() => {
                                  handleOnDragEnd(
                                    courtSession.filedDocuments ?? [],
                                  )
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
                                    canOpen:
                                      item.documentType !==
                                      CourtDocumentType.EXTERNAL_DOCUMENT,
                                    canEdit: ['fileName'],
                                    supplement,
                                  }}
                                  backgroundColor="white"
                                  onOpen={handleOnOpen}
                                  onRename={(id: string, name: string) => {
                                    handleUpdateFile(courtSession.id, id, {
                                      name,
                                    })
                                  }}
                                  onDelete={handleDeleteFile}
                                  disabled={courtSession.isConfirmed || false}
                                />
                              </Reorder.Item>
                            )
                          })}
                        </AnimatePresence>
                      </Reorder.Group>
                      <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="spaceAround"
                        rowGap={2}
                      >
                        <AnimatePresence>
                          {filedDocuments.map((_item, i) => {
                            const currentIndex = getFiledDocumentIndex(i)

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
                          })}
                        </AnimatePresence>
                      </Box>
                    </Box>
                  )}
                  <Box borderRadius="large" background="white" paddingX={2}>
                    <Accordion dividerOnBottom={false} dividerOnTop={false}>
                      <AccordionItem
                        id={`unfiled-files-${courtSession.id}`}
                        label={`Önnur skjöl ${
                          workingCase.unfiledCourtDocuments
                            ? `(${workingCase.unfiledCourtDocuments.length})`
                            : ''
                        }`}
                        labelVariant="h5"
                      >
                        {workingCase.unfiledCourtDocuments?.length === 0 ? (
                          <AlertMessage
                            title="Engin óþingmerkt skjöl"
                            message="Öll skjöl málsins hafa verið lögð fram"
                            type="success"
                          />
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            columnGap={2}
                            rowGap={2}
                          >
                            {workingCase.unfiledCourtDocuments?.map((item) => (
                              <Box
                                display="flex"
                                alignItems="center"
                                columnGap={2}
                                key={item.id}
                              >
                                <Box
                                  flexGrow={1}
                                  background="white"
                                  borderRadius="large"
                                  border="standard"
                                  borderColor="blue200"
                                >
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    component="button"
                                    onClick={() => handleOnOpen(item.id)}
                                    paddingX={2}
                                    paddingY={2}
                                  >
                                    <Text variant="h5">{item.name}</Text>
                                    <Box marginLeft={1}>
                                      <Icon
                                        icon="open"
                                        type="outline"
                                        size="small"
                                      />
                                    </Box>
                                  </Box>
                                </Box>
                                <Tag
                                  outlined
                                  variant="darkerBlue"
                                  onClick={() => handleFileCourtDocument(item)}
                                  disabled={
                                    courtDocument.isLoading ||
                                    courtSession.isConfirmed ||
                                    false
                                  }
                                >
                                  Leggja fram
                                </Tag>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </Box>
              </MultipleValueList>
              {mergedCaseDocumentsInCourtSession.map(
                (mergeDocumentsPerCase) => {
                  const courtCaseNumber = mergeDocumentsPerCase.courtCaseNumber
                  const mergedFiledDocuments =
                    mergeDocumentsPerCase.mergedFileDocuments
                  const courtSessionString =
                    courtSession.courtSessionStrings?.find(
                      (string) =>
                        string.stringType === CourtSessionStringType.ENTRIES &&
                        string.mergedCaseId === mergeDocumentsPerCase.caseId,
                    )

                  return (
                    <Box key={`merged-case-${courtCaseNumber}`}>
                      <CourtSessionMergedCaseEntries
                        courtSessionId={courtSession.id}
                        courtCaseNumber={courtCaseNumber ?? ''}
                        courtSessionString={courtSessionString}
                        mergedCaseId={mergeDocumentsPerCase.caseId}
                        disabled={courtSession.isConfirmed || false}
                        patchCourtSessionStrings={patchCourtSessionStrings}
                      />
                      <SectionHeading
                        title={`Dómskjöl úr sameinuðu máli ${courtCaseNumber}`}
                      />
                      <BlueBox>
                        {mergedFiledDocuments &&
                          mergedFiledDocuments.length > 0 && (
                            <Box
                              display="flex"
                              columnGap={2}
                              justifyContent="spaceBetween"
                            >
                              <Reorder.Group
                                axis="y"
                                values={mergedFiledDocuments}
                                onReorder={handleReorder}
                                className={styles.grid}
                              >
                                <AnimatePresence>
                                  {mergedFiledDocuments.map((item) => (
                                    <Reorder.Item
                                      key={item.id}
                                      value={item}
                                      data-reorder-item
                                      onDragStart={() => {
                                        setDraggedMergeFileId(item.id)
                                      }}
                                      onDragEnd={() => {
                                        handleOnDragEnd(
                                          courtSession.mergedFiledDocuments ??
                                            [],
                                        )
                                        setDraggedMergeFileId(null)
                                      }}
                                      initial={{
                                        opacity: 0,
                                        y: -10,
                                        height: 'auto',
                                      }}
                                      animate={{
                                        opacity: 1,
                                        y: 0,
                                        height: 'auto',
                                      }}
                                      exit={{ opacity: 0, y: 10, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <EditableCaseFile
                                        enableDrag
                                        caseFile={{
                                          id: item.id,
                                          displayText: item.name,
                                          name: item.name,
                                          canEdit: ['fileName'],
                                        }}
                                        backgroundColor="white"
                                        onRename={(
                                          id: string,
                                          newName: string,
                                        ) => {
                                          handleUpdateFile(
                                            courtSession.id,
                                            id,
                                            {
                                              name: newName,
                                            },
                                          )
                                        }}
                                        disabled={
                                          courtSession.isConfirmed || false
                                        }
                                      />
                                    </Reorder.Item>
                                  ))}
                                </AnimatePresence>
                              </Reorder.Group>
                              <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="spaceAround"
                                rowGap={2}
                              >
                                <AnimatePresence>
                                  {mergedFiledDocuments.map((item, i) => {
                                    // we have to keep track of the previous merged case files within the same court session
                                    // to calculate the document order indexes correctly in the client for reordering purposes
                                    const previousMergedCaseDocumentCountInSession =
                                      (
                                        courtSession.mergedFiledDocuments?.filter(
                                          (document) =>
                                            item.mergedDocumentOrder &&
                                            document.mergedDocumentOrder &&
                                            item.mergedDocumentOrder >
                                              document.mergedDocumentOrder &&
                                            item.caseId !== document.caseId,
                                        ) ?? []
                                      ).length

                                    const currentIndex =
                                      getMergedDocumentIndex(i) +
                                      previousMergedCaseDocumentCountInSession

                                    return (
                                      <motion.div
                                        initial={{
                                          opacity: 0,
                                          y: -10,
                                          height: 'auto',
                                        }}
                                        animate={{
                                          opacity: 1,
                                          y: 0,
                                          height: 'auto',
                                        }}
                                        exit={{ opacity: 0, y: 10, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        key={`þingmerkt_nr_${currentIndex + 1}`}
                                      >
                                        <Tag
                                          variant="darkerBlue"
                                          outlined
                                          disabled
                                        >
                                          Þingmerkt nr. {currentIndex + 1}
                                        </Tag>
                                      </motion.div>
                                    )
                                  })}
                                </AnimatePresence>
                              </Box>
                            </Box>
                          )}
                      </BlueBox>
                    </Box>
                  )
                },
              )}
              <Box>
                <SectionHeading title="Bókanir" />
                <Input
                  data-testid="entries"
                  name="entries"
                  label="Afstaða varnaraðila, málflutningur og aðrar bókanir"
                  value={courtSession.entries || ''}
                  placeholder="Nánari útlistun á afstöðu varnaraðila, málflutningsræður og annað sem fram kom í þinghaldi er skráð hér."
                  onChange={(event) => {
                    setEntriesErrorMessage('')

                    patchSession(courtSession.id, {
                      entries: event.target.value,
                    })
                  }}
                  onBlur={(event) => {
                    validateAndSetErrorMessage(
                      ['empty'],
                      event.target.value,
                      setEntriesErrorMessage,
                    )

                    patchSession(
                      courtSession.id,
                      { entries: event.target.value },
                      { persist: true },
                    )
                  }}
                  hasError={entriesErrorMessage !== ''}
                  errorMessage={entriesErrorMessage}
                  rows={15}
                  disabled={courtSession.isConfirmed || false}
                  textarea
                  required
                />
              </Box>
              <Box>
                <SectionHeading
                  title="Er kveðinn upp dómur eða úrskurður í þinghaldinu?"
                  required
                />
                <BlueBox className={styles.grid}>
                  <RadioButton
                    name={`result_no-${courtSession.id}`}
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
                        },
                        { persist: true },
                      )
                    }
                    disabled={courtSession.isConfirmed || false}
                    large
                  />
                  <RadioButton
                    name={`result_verdict-${courtSession.id}`}
                    label="Dómur kveðinn upp"
                    backgroundColor="white"
                    checked={
                      courtSession.rulingType ===
                      CourtSessionRulingType.JUDGEMENT
                    }
                    onChange={() =>
                      patchSession(
                        courtSession.id,
                        { rulingType: CourtSessionRulingType.JUDGEMENT },
                        { persist: true },
                      )
                    }
                    disabled={courtSession.isConfirmed || false}
                    large
                  />
                  <RadioButton
                    name={`result_ruling-${courtSession.id}`}
                    label="Úrskurður kveðinn upp"
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
                    disabled={courtSession.isConfirmed || false}
                    large
                  />
                </BlueBox>
              </Box>
              {(courtSession.rulingType === CourtSessionRulingType.JUDGEMENT ||
                courtSession.rulingType === CourtSessionRulingType.ORDER) && (
                <>
                  <Box>
                    <SectionHeading
                      title={
                        courtSession.rulingType ===
                        CourtSessionRulingType.JUDGEMENT
                          ? 'Dómsorð'
                          : 'Úrskurðarorð'
                      }
                    />
                    <Input
                      data-testid="ruling"
                      name="ruling"
                      label={
                        courtSession.rulingType ===
                        CourtSessionRulingType.JUDGEMENT
                          ? 'Dómsorð'
                          : 'Úrskurðarorð'
                      }
                      value={courtSession.ruling || ''}
                      placeholder={`Hvert er ${
                        courtSession.rulingType ===
                        CourtSessionRulingType.JUDGEMENT
                          ? 'dómsorðið'
                          : 'úrskurðarorðið'
                      }?`}
                      onChange={(event) => {
                        setRulingErrorMessage('')

                        patchSession(courtSession.id, {
                          ruling: event.target.value,
                        })
                      }}
                      onBlur={(event) => {
                        validateAndSetErrorMessage(
                          ['empty'],
                          event.target.value,
                          setRulingErrorMessage,
                        )

                        patchSession(
                          courtSession.id,
                          { ruling: event.target.value },
                          { persist: true },
                        )
                      }}
                      hasError={rulingErrorMessage !== ''}
                      errorMessage={rulingErrorMessage}
                      rows={15}
                      disabled={courtSession.isConfirmed || false}
                      textarea
                      required
                    />
                  </Box>
                  <Box>
                    <SectionHeading title="Bókanir í lok þinghalds" />
                    <Input
                      data-testid="closingEntries"
                      name="closingEntries"
                      label="Bókanir í kjölfar dómsuppsögu eða uppkvaðningu úrskurðar"
                      value={courtSession.closingEntries || ''}
                      placeholder="T.d. Dómfelldi er ekki viðstaddur dómsuppsögu og verður lögreglu falið að birta dóminn fyrir honum..."
                      onChange={(event) =>
                        patchSession(courtSession.id, {
                          closingEntries: event.target.value,
                        })
                      }
                      onBlur={(event) =>
                        patchSession(
                          courtSession.id,
                          { closingEntries: event.target.value },
                          { persist: true },
                        )
                      }
                      rows={15}
                      disabled={courtSession.isConfirmed || false}
                      textarea
                    />
                  </Box>
                </>
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
                        disabled={!isCourtSessionValid(courtSession)}
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
              primaryButton={{
                text: 'Já, eyða',
                colorScheme: 'destructive',
                onClick: () => handleDeleteCourtSession(courtSession.id),
              }}
              secondaryButton={{
                text: 'Hætta við',
                onClick: () => setModalVisible(undefined),
              }}
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
