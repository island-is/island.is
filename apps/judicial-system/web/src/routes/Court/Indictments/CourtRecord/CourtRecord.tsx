import { FC, useCallback, useContext, useState } from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  Reorder,
  useDragControls,
} from 'motion/react'
import router from 'next/router'
import { uuid } from 'uuidv4'

import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Checkbox,
  Input,
  RadioButton,
  Select,
  Tag,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { INDICTMENTS_CASE_FILE_ROUTE } from '@island.is/judicial-system/consts'
import { CourtSessionClosedLegalBasis } from '@island.is/judicial-system/types'
import {
  BlueBox,
  CourtCaseInfo,
  DateTime,
  FormContentContainer,
  FormContext,
  MultipleValueList,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { useCourtDocuments } from '@island.is/judicial-system-web/src/components/CourtDocuments/CourtDocuments'
import EditableCaseFile from '@island.is/judicial-system-web/src/components/EditableCaseFile/EditableCaseFile'
import {
  CourtSession,
  CourtSessionRulingType,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  TUploadFile,
  useCase,
  useCourtSessions,
} from '@island.is/judicial-system-web/src/utils/hooks'

import SelectCourtOfficials from '../../components/ReceptionAndAssignment/SelectCourtOfficials/SelectCourtOfficials'
import { useSelectCourtOfficialsUsersQuery } from '../../components/ReceptionAndAssignment/SelectCourtOfficials/selectCourtOfficialsUsers.generated'
import * as styles from './CourtRecord.css'

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

const CourtRecord: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { updateCase } = useCase()
  const { handleAddDocument } = useCourtDocuments()
  const controls = useDragControls()
  const [reorderableItems, setReorderableItems] = useState<
    { id: string; name: string }[]
  >([])
  const [locationErrorMessage, setLocationErrorMessage] = useState<string>('')
  const [entriesErrorMessage, setEntriesErrorMessage] = useState<string>('')
  const [rulingErrorMessage, setRulingErrorMessage] = useState<string>('')
  const { createCourtSession, updateCourtSession } = useCourtSessions()

  const { data: usersData, loading: usersLoading } =
    useSelectCourtOfficialsUsersQuery({
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

  const judges = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        (user.role === UserRole.DISTRICT_COURT_JUDGE ||
          user.role === UserRole.DISTRICT_COURT_ASSISTANT) &&
        user.institution?.id === workingCase.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name ?? '', value: judge.id, judge }
    })

  const registrars = (usersData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.DISTRICT_COURT_REGISTRAR &&
        user.institution?.id === workingCase.court?.id,
    )
    .map((registrar: User) => {
      return { label: registrar.name ?? '', value: registrar.id, registrar }
    })

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

  // useEffect(() => {
  //   if (!workingCase.courtDocuments) {
  //     return
  //   }

  //   setReorderableItems(
  //     workingCase.courtDocuments.map((doc) => ({
  //       id: doc.id,
  //       name: doc.name,
  //     })),
  //   )
  // }, [workingCase.courtDocuments])

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const updateItem = (id: string, newData: any) => {
    setWorkingCase((prev) => {
      if (!prev.courtSessions) return prev

      return {
        ...prev,
        courtSessions: prev.courtSessions?.map((item) =>
          item.id === id ? { ...item, ...newData } : item,
        ),
      }
    })
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={false}
      onNavigationTo={() => handleNavigationTo(INDICTMENTS_CASE_FILE_ROUTE)}
    >
      <PageHeader title="Þingbók - Réttarvörslugátt" />
      <FormContentContainer>
        <PageTitle>Þingbók</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Accordion dividerOnTop={false} singleExpand>
          {workingCase.courtSessions?.map((courtSession, index) => (
            <AccordionItem
              id="courtRecordAccordionItem"
              label={`Þinghald ${index + 1}`}
              labelVariant="h3"
              key={courtSession.id}
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
                          onChange={(
                            date: Date | undefined,
                            valid: boolean,
                          ) => {
                            if (date && valid) {
                              updateCourtSession({
                                caseId: workingCase.id,
                                courtSessionId: courtSession.id,
                                startDate: date,
                              })
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
                            updateItem(courtSession.id, {
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

                            updateCourtSession({
                              caseId: workingCase.id,
                              courtSessionId: courtSession.id,
                              location,
                            })
                          }}
                          errorMessage={locationErrorMessage}
                          hasError={locationErrorMessage !== ''}
                          autoComplete="off"
                          required
                        />
                        <Checkbox
                          name="isClosedProceeding"
                          label="Þinghaldið er lokað"
                          onChange={(evt) => {
                            const update = {
                              isClosed: evt.target.checked,
                              closedLegalProvisions: [],
                            }

                            updateItem(courtSession.id, update)

                            updateCourtSession({
                              caseId: workingCase.id,
                              courtSessionId: courtSession.id,
                              ...update,
                            })
                          }}
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
                                      name={label}
                                      tooltip={tooltip}
                                      checked={courtSession.closedLegalProvisions?.includes(
                                        legalProvision,
                                      )}
                                      onChange={(evt) => {
                                        const initialValue =
                                          courtSession.closedLegalProvisions ||
                                          []

                                        const closedLegalProvisions = evt.target
                                          .checked
                                          ? [...initialValue, legalProvision]
                                          : initialValue.filter(
                                              (v) => v !== legalProvision,
                                            )

                                        updateItem(courtSession.id, {
                                          closedLegalProvisions,
                                        })

                                        updateCourtSession({
                                          caseId: workingCase.id,
                                          courtSessionId: courtSession.id,
                                          closedLegalProvisions,
                                        })
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
                        updateItem(courtSession.id, {
                          attendees: event.target.value,
                        })

                        updateCourtSession({
                          caseId: workingCase.id,
                          courtSessionId: courtSession.id,
                          attendees: event.target.value,
                        })
                      }}
                      onBlur={(event) => {
                        updateCourtSession({
                          caseId: workingCase.id,
                          courtSessionId: courtSession.id,
                          attendees: event.target.value,
                        })
                      }}
                      textarea
                      rows={7}
                      autoExpand={{ on: true, maxHeight: 300 }}
                    />
                    <MultipleValueList
                      onAddValue={(v) =>
                        setReorderableItems((prev) => [
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
                          values={reorderableItems}
                          onReorder={setReorderableItems}
                          className={styles.grid}
                        >
                          {reorderableItems.map((item) => {
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
                                  onOpen={function (id: string): void {
                                    throw new Error('Function not implemented.')
                                  }}
                                  onRename={function (
                                    id: string,
                                    name: string,
                                    displayDate: string,
                                  ): void {
                                    throw new Error('Function not implemented.')
                                  }}
                                  onDelete={(file: TUploadFile) => {
                                    setReorderableItems((prev) =>
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
                          {reorderableItems.map((item, index) => (
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

                          updateItem(courtSession.id, {
                            entries: event.target.value,
                          })

                          updateCourtSession({
                            caseId: workingCase.id,
                            courtSessionId: courtSession.id,
                            entries: event.target.value,
                          })
                        }}
                        onBlur={(event) => {
                          validateAndSetErrorMessage(
                            ['empty'],
                            event.target.value,
                            setEntriesErrorMessage,
                          )

                          updateCourtSession({
                            caseId: workingCase.id,
                            courtSessionId: courtSession.id,
                            entries: event.target.value,
                          })
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
                          name="result_no"
                          label="Nei"
                          backgroundColor="white"
                          checked={
                            courtSession.rulingType ===
                            CourtSessionRulingType.NONE
                          }
                          onChange={() => {
                            updateItem(courtSession.id, {
                              rulingType: CourtSessionRulingType.NONE,
                              ruling: '',
                            })

                            updateCourtSession({
                              caseId: workingCase.id,
                              courtSessionId: courtSession.id,
                              rulingType: CourtSessionRulingType.NONE,
                              ruling: '',
                            })
                          }}
                          large
                        />
                        <RadioButton
                          name="result_verdict"
                          label="Dómur kveðinn upp"
                          backgroundColor="white"
                          checked={
                            courtSession.rulingType ===
                            CourtSessionRulingType.JUDGEMENT
                          }
                          onChange={() => {
                            updateItem(courtSession.id, {
                              rulingType: CourtSessionRulingType.JUDGEMENT,
                            })

                            updateCourtSession({
                              caseId: workingCase.id,
                              courtSessionId: courtSession.id,
                              rulingType: CourtSessionRulingType.JUDGEMENT,
                            })
                          }}
                          large
                        />
                        <RadioButton
                          name="result_ruling"
                          label="Úrskurður kveðinn upp"
                          backgroundColor="white"
                          checked={
                            courtSession.rulingType ===
                            CourtSessionRulingType.ORDER
                          }
                          onChange={() => {
                            updateItem(courtSession.id, {
                              rulingType: CourtSessionRulingType.ORDER,
                            })

                            updateCourtSession({
                              caseId: workingCase.id,
                              courtSessionId: courtSession.id,
                              rulingType: CourtSessionRulingType.ORDER,
                            })
                          }}
                          large
                        />
                      </BlueBox>
                    </Box>
                    {(courtSession.rulingType ===
                      CourtSessionRulingType.JUDGEMENT ||
                      courtSession.rulingType ===
                        CourtSessionRulingType.ORDER) && (
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

                              updateItem(courtSession.id, {
                                ruling: event.target.value,
                              })
                            }}
                            onBlur={(event) => {
                              validateAndSetErrorMessage(
                                ['empty'],
                                event.target.value,
                                setRulingErrorMessage,
                              )

                              updateCourtSession({
                                caseId: workingCase.id,
                                courtSessionId: courtSession.id,
                                ruling: event.target.value,
                              })
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
                            value={courtSession.ruling || ''}
                            placeholder="T.d. Dómfelldi er ekki viðstaddur dómsuppsögu og verður lögreglu falið að birta dóminn fyrir honum..."
                            onChange={(event) => {
                              updateItem(courtSession.id, {
                                closingEntries: event.target.value,
                              })
                            }}
                            onBlur={(event) => {
                              updateCourtSession({
                                caseId: workingCase.id,
                                courtSessionId: courtSession.id,
                                closingEntries: event.target.value,
                              })
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
                          name="isAttestingWitness"
                          checked={courtSession.isAttestingWitness || false}
                          onChange={(evt) => {
                            updateItem(courtSession.id, {
                              isAttestingWitness: evt.target.checked,
                              attenstingWitnessId: null,
                            })

                            updateCourtSession({
                              caseId: workingCase.id,
                              courtSessionId: courtSession.id,
                              isAttestingWitness: evt.target.checked,
                              attestingWitnessId: null,
                            })
                          }}
                          large
                          filled
                        />
                        <Select
                          name="courtUsers"
                          options={[...judges, ...registrars].sort((a, b) =>
                            a.label.localeCompare(b.label),
                          )}
                          size="md"
                          label="Veldu vott"
                          placeholder="Veldu vott að þinghaldi"
                          isDisabled={!courtSession.isAttestingWitness}
                          required
                        />
                      </BlueBox>
                    </Box>
                    <Box>
                      <SectionHeading title="Þinghaldi slitið" />
                      <BlueBox>
                        <DateTime
                          name="courtEndTime"
                          timeLabel="Þinghald hófst (kk:mm)"
                          maxDate={new Date()}
                          selectedDate={courtSession.startDate}
                          onChange={(
                            date: Date | undefined,
                            valid: boolean,
                          ) => {
                            if (date && valid) {
                              updateCourtSession({
                                caseId: workingCase.id,
                                courtSessionId: courtSession.id,
                                startDate: date,
                              })
                            }
                          }}
                          blueBox={false}
                          required
                        />
                      </BlueBox>
                    </Box>
                  </LayoutGroup>
                </Box>
              </LayoutGroup>
            </AccordionItem>
          ))}
        </Accordion>
        <Box display="flex" justifyContent="flexEnd" marginTop={5}>
          <Button
            variant="ghost"
            onClick={async () => {
              const courtSession = await createCourtSession({
                caseId: workingCase.id,
              })

              if (!courtSession?.id) {
                return
              }

              setWorkingCase((prev) => ({
                ...prev,
                courtSessions: [
                  ...(prev.courtSessions ?? []),
                  {
                    id: courtSession.id,
                    created: courtSession.created,
                  } as CourtSession,
                ],
              }))
            }}
            icon="add"
          >
            Bæta við þinghaldi
          </Button>
        </Box>
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
