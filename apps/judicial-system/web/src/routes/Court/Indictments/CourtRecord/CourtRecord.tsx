import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { Reorder, useDragControls } from 'motion/react'
import router from 'next/router'
import { uuid } from 'uuidv4'

import {
  Accordion,
  AccordionItem,
  Box,
  Input,
  Tag,
} from '@island.is/island-ui/core'
import { INDICTMENTS_CASE_FILE_ROUTE } from '@island.is/judicial-system/consts'
import {
  BlueBox,
  CaseFile,
  CourtCaseInfo,
  DateTime,
  FormContentContainer,
  FormContext,
  MultipleValueList,
  PageHeader,
  PageLayout,
  PageTitle,
} from '@island.is/judicial-system-web/src/components'
import { useCourtDocuments } from '@island.is/judicial-system-web/src/components/CourtDocuments/CourtDocuments'
import EditableCaseFile from '@island.is/judicial-system-web/src/components/EditableCaseFile/EditableCaseFile'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  TUploadFile,
  useCase,
} from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from './CourtRecord.css'

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
          <AccordionItem id="courtRecordAccordionItem" label="Þinghald 1">
            <BlueBox className={styles.grid}>
              <DateTime
                name="courtStartDate"
                datepickerLabel="Dagsetning þingfestingar"
                timeLabel="Þinghald hófst (kk:mm)"
                maxDate={new Date()}
                selectedDate={workingCase.courtStartDate}
                onChange={(date: Date | undefined, valid: boolean) => {
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
                value={workingCase.courtLocation || ''}
                placeholder='Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"'
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'courtLocation',
                    event.target.value,
                    ['empty'],
                    setWorkingCase,
                    courtLocationErrorMessage,
                    setCourtLocationErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'courtLocation',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setCourtLocationErrorMessage,
                  )
                }
                errorMessage={courtLocationErrorMessage}
                hasError={courtLocationErrorMessage !== ''}
                autoComplete="off"
                required
              />
            </BlueBox>
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
          </AccordionItem>
        </Accordion>
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
