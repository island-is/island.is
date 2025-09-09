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
  Checkbox,
  Input,
  RadioButton,
  Tag,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { INDICTMENTS_CASE_FILE_ROUTE } from '@island.is/judicial-system/consts'
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
  removeTabsValidateAndSet,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  TUploadFile,
  useCase,
  useCourtSessions,
} from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from './CourtRecord.css'

const CLOSURE_GROUNDS = [
  [
    'a-lið 10. gr. sml nr. 88/2008',
    'til hlífðar sakborningi, brotaþola, vandamanni þeirra, vitni eða öðrum sem málið varðar',
  ],
  [
    'b-lið 10. gr. sml nr. 88/2008',
    'vegna nauðsynjar sakbornings, brotaþola, vitnis eða annars sem málið varðar á því að halda leyndum atriðum varðandi hagsmuni í viðskiptum eða samsvarandi aðstöðu',
  ],
  [
    'c-lið 10. gr. sml nr. 88/2008',
    'vegna hagsmuna almennings eða öryggis ríkisins',
  ],
  ['d-lið 10. gr. sml nr. 88/2008', 'af velsæmisástæðum'],
  ['e-lið 10. gr. sml nr. 88/2008', 'til að halda uppi þingfriði'],
  [
    'f-lið 10. gr. sml nr. 88/2008',
    'meðan á rannsókn máls stendur og hætta þykir á sakarspjöllum ef þing væri háð fyrir opnum dyrum',
  ],
  [
    'g-lið 10. gr. sml nr. 88/2008',
    'meðan vitni gefur skýrslu án þess að það þurfi að skýra frá nafni sínu í heyranda hljóði, sbr. 8. mgr. 122. gr.',
  ],
]

const CourtRecord: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { setAndSendCaseToServer, updateCase } = useCase()
  const { handleAddDocument } = useCourtDocuments()
  const controls = useDragControls()
  const [reorderableItems, setReorderableItems] = useState<
    { id: string; name: string }[]
  >([])
  const [courtLocationErrorMessage, setCourtLocationErrorMessage] =
    useState<string>('')
  const [isClosedProceeding, setIsClosedProceeding] = useState<boolean>(false)
  const { updateCourtSession } = useCourtSessions()

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

  const [locationErrorMessage, setLocationErrorMessage] = useState<string>('')

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
        <Accordion dividerOnTop={false}>
          {workingCase.courtSessions?.map((courtSession, index) => (
            <AccordionItem
              id="courtRecordAccordionItem"
              label={`Þinghald ${index + 1}`}
              startExpanded={workingCase.courtSessions?.length === index + 1}
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
                          selectedDate={workingCase.courtStartDate}
                          onChange={(
                            date: Date | undefined,
                            valid: boolean,
                          ) => {
                            if (date && valid) {
                              setAndSendCaseToServer(
                                [
                                  {
                                    courtStartDate: formatDateForServer(date),
                                    force: true,
                                  },
                                ],
                                workingCase,
                                setWorkingCase,
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
                          onChange={() =>
                            setIsClosedProceeding(!isClosedProceeding)
                          }
                          checked={isClosedProceeding}
                          filled
                          large
                        />
                      </div>
                      <AnimatePresence>
                        {isClosedProceeding && (
                          <>
                            <motion.div
                              variants={titleVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <SectionHeading
                                title="Lagaákvæði sem lokun þinghalds byggir á"
                                required
                                marginBottom={0}
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
                              {CLOSURE_GROUNDS.map(([label, tooltip]) => (
                                <motion.div
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  key={label}
                                >
                                  <Checkbox
                                    label={label}
                                    tooltip={tooltip}
                                    large
                                    filled
                                  />
                                </motion.div>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </BlueBox>
                    <Input
                      data-testid="courtAttendees"
                      name="courtAttendees"
                      label="Mættir eru"
                      value={workingCase.courtAttendees || ''}
                      placeholder="Skrifa hér..."
                      onChange={(event) =>
                        removeTabsValidateAndSet(
                          'courtAttendees',
                          event.target.value,
                          [],
                          setWorkingCase,
                        )
                      }
                      onBlur={(event) =>
                        updateCase(workingCase.id, {
                          courtAttendees: event.target.value,
                        })
                      }
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
                        data-testid="courtAttendees"
                        name="courtAttendees"
                        label="Afstaða varnaraðila, málflutningur og aðrar bókanir"
                        value={workingCase.courtAttendees || ''}
                        placeholder="Nánari útlistun á afstöðu varnaraðila, málflutningsræður og annað sem fram kom í þinghaldi er skráð hér."
                        onChange={(event) =>
                          removeTabsValidateAndSet(
                            'courtAttendees',
                            event.target.value,
                            [],
                            setWorkingCase,
                          )
                        }
                        onBlur={(event) =>
                          updateCase(workingCase.id, {
                            courtAttendees: event.target.value,
                          })
                        }
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
                          name="result"
                          label="Nei"
                          backgroundColor="white"
                          large
                        />
                        <RadioButton
                          name="result"
                          label="Dómur kveðinn upp"
                          backgroundColor="white"
                          large
                        />
                        <RadioButton
                          name="result"
                          label="Úrskurður kveðinn upp"
                          backgroundColor="white"
                          large
                        />
                      </BlueBox>
                    </Box>
                    <Box>
                      <SectionHeading title="Dómsorð" />
                      <Input
                        data-testid="courtAttendees"
                        name="courtAttendees"
                        label="Dómsorð"
                        value={workingCase.courtAttendees || ''}
                        placeholder="Hvert er dómsorðið?"
                        onChange={(event) =>
                          removeTabsValidateAndSet(
                            'courtAttendees',
                            event.target.value,
                            [],
                            setWorkingCase,
                          )
                        }
                        onBlur={(event) =>
                          updateCase(workingCase.id, {
                            courtAttendees: event.target.value,
                          })
                        }
                        rows={15}
                        autoExpand={{ on: true, maxHeight: 300 }}
                        textarea
                        required
                      />
                    </Box>
                    <Box>
                      <SectionHeading title="Dómsorð" />
                      <Input
                        data-testid="courtAttendees"
                        name="courtAttendees"
                        label="Dómsorð"
                        value={workingCase.courtAttendees || ''}
                        placeholder="Hvert er dómsorðið?"
                        onChange={(event) =>
                          removeTabsValidateAndSet(
                            'courtAttendees',
                            event.target.value,
                            [],
                            setWorkingCase,
                          )
                        }
                        onBlur={(event) =>
                          updateCase(workingCase.id, {
                            courtAttendees: event.target.value,
                          })
                        }
                        rows={15}
                        autoExpand={{ on: true, maxHeight: 300 }}
                        textarea
                        required
                      />
                    </Box>
                  </LayoutGroup>
                </Box>
              </LayoutGroup>
            </AccordionItem>
          ))}
        </Accordion>
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
