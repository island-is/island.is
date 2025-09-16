import { Dispatch, FC, SetStateAction, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, Reorder } from 'motion/react'
import { uuid } from 'uuidv4'

import {
  AccordionItem,
  Box,
  Button,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Tag,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  BlueBox,
  DateTime,
  MultipleValueList,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import EditableCaseFile from '@island.is/judicial-system-web/src/components/EditableCaseFile/EditableCaseFile'
import {
  Case,
  CourtSessionClosedLegalBasis,
  CourtSessionResponse,
  CourtSessionRulingType,
  UpdateCourtSessionInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { validateAndSetErrorMessage } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  TUploadFile,
  useCourtSessions,
  useUsers,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isCourtSessionValid } from '@island.is/judicial-system-web/src/utils/validate'

import * as styles from './CourtRecord.css'

interface Props {
  index: number
  courtSession: CourtSessionResponse
  isExpanded: boolean
  onToggle: () => void
  onConfirmClick: () => void
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

interface ReorderableFile {
  id: string
  name: string
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

const useCourtSessionUpdater = (
  workingCase: Case,
  setWorkingCase: Dispatch<SetStateAction<Case>>,
  updateFn: (updateCourtSession: UpdateCourtSessionInput) => Promise<boolean>,
) => {
  return (sessionId: string, updates: Partial<CourtSessionResponse>) => {
    setWorkingCase((prev) => {
      if (!prev.courtSessions) return prev

      return {
        ...prev,
        courtSessions: prev.courtSessions?.map((item) =>
          item.id === sessionId ? { ...item, ...updates } : item,
        ),
      }
    })

    updateFn({
      caseId: workingCase.id,
      courtSessionId: sessionId,
      ...updates,
    })
  }
}

const CourtSessionAccordionItem: FC<Props> = (props) => {
  const {
    index,
    courtSession,
    isExpanded,
    onToggle,
    onConfirmClick,
    workingCase,
    setWorkingCase,
  } = props
  const { updateCourtSession } = useCourtSessions()
  const [locationErrorMessage, setLocationErrorMessage] = useState<string>('')
  const [entriesErrorMessage, setEntriesErrorMessage] = useState<string>('')
  const [rulingErrorMessage, setRulingErrorMessage] = useState<string>('')
  const [reorderableFiles, setReorderableFiles] = useState<ReorderableFile[]>(
    [],
  )

  const {
    judges,
    registrars,
    loading: usersLoading,
  } = useUsers(workingCase.court?.id)

  const updateSession = useCourtSessionUpdater(
    workingCase,
    setWorkingCase,
    updateCourtSession,
  )

  const patchSession = (
    id: string,
    updates: Partial<CourtSessionResponse>,
    { persist = false } = {},
  ) => {
    setWorkingCase((prev) => ({
      ...prev,
      courtSessions: prev.courtSessions?.map((session) =>
        session.id === id ? { ...session, ...updates } : session,
      ),
    }))

    if (persist) {
      updateSession(id, updates)
    }
  }

  const containerVariants = {
    hidden: {
      height: 0,
    },
    visible: {
      height: 'auto',
    },
    exit: {
      height: 0,
      transition: { duration: 0.6 },
    },
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
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: { delay: 0.3 },
    },
    exit: {
      opacity: 0,
    },
  }

  return (
    <AccordionItem
      id={`courtRecordAccordionItem-${courtSession.id}`}
      label={`Þinghald ${index + 1}`}
      labelVariant="h3"
      key={courtSession.id}
      expanded={isExpanded}
      onToggle={onToggle}
    >
      <LayoutGroup>
        <Box className={styles.containerGrid}>
          <LayoutGroup>
            <BlueBox>
              <div className={styles.grid}>
                <DateTime
                  name="courtStartDate"
                  datepickerLabel="Dagsetning þingfestingar"
                  timeLabel="Þinghald hófst (kk:mm)"
                  maxDate={new Date()}
                  selectedDate={courtSession.startDate}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    if (date && valid) {
                      patchSession(
                        courtSession.id,
                        { startDate: formatDateForServer(date) },
                        { persist: true },
                      )
                    }
                  }}
                  blueBox={false}
                  required
                />
                <Input
                  data-testid="courtLocation"
                  name="courtLocation"
                  tooltip='Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.'
                  label="Hvar var dómþing haldið?"
                  value={courtSession.location || ''}
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

                                const closedLegalProvisions = evt.target.checked
                                  ? [...initialValue, legalProvision]
                                  : initialValue.filter(
                                      (v) => v !== legalProvision,
                                    )

                                patchSession(
                                  courtSession.id,
                                  {
                                    closedLegalProvisions,
                                  },
                                  { persist: true },
                                )
                              }}
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
              value={courtSession.attendees || ''}
              placeholder="Skrifa hér..."
              onChange={(event) => {
                patchSession(courtSession.id, {
                  attendees: event.target.value,
                })
              }}
              onBlur={(event) => {
                patchSession(
                  courtSession.id,
                  {
                    attendees: event.target.value,
                  },
                  { persist: true },
                )
              }}
              textarea
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
            <MultipleValueList
              onAddValue={(v) =>
                setReorderableFiles((prev) => [
                  ...prev,
                  { id: uuid(), name: v },
                ])
              }
              inputLabel="Heiti dómskjals"
              inputPlaceholder="Skrá inn heiti á skjali hér"
              buttonText="Bæta við skjali"
              name="indictmentCourtDocuments"
              isDisabled={() => false}
            >
              <Box
                display="flex"
                rowGap={2}
                justifyContent="spaceBetween"
                className={styles.reorderGroup}
              >
                <Reorder.Group
                  axis="y"
                  values={reorderableFiles}
                  onReorder={setReorderableFiles}
                  className={styles.grid}
                >
                  {reorderableFiles.map((item) => {
                    return (
                      <Reorder.Item
                        key={item.id}
                        value={item}
                        data-reorder-item
                      >
                        <EditableCaseFile
                          enableDrag
                          caseFile={{
                            id: item.id,
                            displayText: item.name,
                            canEdit: ['fileName'],
                          }}
                          backgroundColor="white"
                          onOpen={(_id: string): void => {
                            throw new Error('Function not implemented.')
                          }}
                          onRename={(
                            _id: string,
                            _name: string,
                            _displayDate: string,
                          ): void => {
                            throw new Error('Function not implemented.')
                          }}
                          onDelete={(file: TUploadFile) => {
                            setReorderableFiles((prev) =>
                              prev.filter((i) => i.id !== file.id),
                            )
                          }}
                          onStartEditing={() => console.log('start')}
                          onStopEditing={() => console.log('stop')}
                        />
                      </Reorder.Item>
                    )
                  })}
                </Reorder.Group>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="spaceAround"
                  rowGap={2}
                >
                  {reorderableFiles.map((item, index) => (
                    <Box key={item.name}>
                      <Tag variant="darkerBlue" outlined disabled>
                        Þingmerkt nr. {index + 1}
                      </Tag>
                    </Box>
                  ))}
                </Box>
              </Box>
            </MultipleValueList>
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
                    {
                      entries: event.target.value,
                    },
                    { persist: true },
                  )
                }}
                hasError={entriesErrorMessage !== ''}
                errorMessage={entriesErrorMessage}
                rows={15}
                autoExpand={{ on: true, maxHeight: 300 }}
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
                  large
                />
                <RadioButton
                  name={`result_verdict-${courtSession.id}`}
                  label="Dómur kveðinn upp"
                  backgroundColor="white"
                  checked={
                    courtSession.rulingType === CourtSessionRulingType.JUDGEMENT
                  }
                  onChange={() =>
                    patchSession(
                      courtSession.id,
                      {
                        rulingType: CourtSessionRulingType.JUDGEMENT,
                      },
                      { persist: true },
                    )
                  }
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
                      {
                        rulingType: CourtSessionRulingType.ORDER,
                      },
                      { persist: true },
                    )
                  }
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
                        {
                          ruling: event.target.value,
                        },
                        { persist: true },
                      )
                    }}
                    hasError={rulingErrorMessage !== ''}
                    errorMessage={rulingErrorMessage}
                    rows={15}
                    autoExpand={{ on: true, maxHeight: 300 }}
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
                    onChange={(event) => {
                      patchSession(courtSession.id, {
                        closingEntries: event.target.value,
                      })
                    }}
                    onBlur={(event) => {
                      patchSession(
                        courtSession.id,
                        {
                          closingEntries: event.target.value,
                        },
                        { persist: true },
                      )
                    }}
                    rows={15}
                    autoExpand={{ on: true, maxHeight: 300 }}
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
                  large
                  filled
                />
                <Select
                  name="courtUsers"
                  options={[...judges, ...registrars].sort((a, b) =>
                    a.label.localeCompare(b.label),
                  )}
                  value={
                    courtSession.attestingWitness
                      ? {
                          label: courtSession.attestingWitness.name || '',
                          value: courtSession.attestingWitnessId,
                        }
                      : null
                  }
                  onChange={(evt) => {
                    const selectedUser = [...judges, ...registrars].find(
                      (u) => u.value === evt?.value,
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
                      { attestingWitnessId: evt?.value },
                      { persist: true },
                    )
                  }}
                  size="md"
                  label="Veldu vott"
                  placeholder="Veldu vott að þinghaldi"
                  isDisabled={!courtSession.isAttestingWitness}
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
                    onChange={(date: Date | undefined, valid: boolean) => {
                      if (!date || !valid) {
                        return
                      }

                      const startDate = courtSession.startDate
                        ? new Date(courtSession.startDate)
                        : new Date()

                      const merged = new Date(startDate)
                      merged.setHours(date.getHours(), date.getMinutes(), 0, 0)

                      if (merged < startDate) {
                        toast.error('Upp kom villa við að uppfæra lokatíma')
                      }

                      patchSession(
                        courtSession.id,
                        {
                          endDate: formatDateForServer(merged),
                        },
                        { persist: true },
                      )
                    }}
                    blueBox={false}
                    selectedDate={
                      courtSession.endDate
                        ? new Date(courtSession.endDate)
                        : courtSession.startDate
                        ? new Date(courtSession.startDate)
                        : new Date()
                    }
                    timeOnly
                  />
                </div>
                <Box className={styles.button}>
                  <Button
                    icon="checkmark"
                    onClick={onConfirmClick}
                    size="small"
                    disabled={!isCourtSessionValid(courtSession)}
                  >
                    Staðfesta þingbók
                  </Button>
                </Box>
              </BlueBox>
            </Box>
          </LayoutGroup>
        </Box>
      </LayoutGroup>
    </AccordionItem>
  )
}
export default CourtSessionAccordionItem
