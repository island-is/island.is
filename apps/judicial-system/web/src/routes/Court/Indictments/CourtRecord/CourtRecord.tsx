import { FC, useContext, useEffect, useState } from 'react'
import { Reorder, useDragControls } from 'motion/react'
import { uuid } from 'uuidv4'

import { Box, Tag } from '@island.is/island-ui/core'
import {
  CaseFile,
  FormContext,
  MultipleValueList,
} from '@island.is/judicial-system-web/src/components'
import { useCourtDocuments } from '@island.is/judicial-system-web/src/components/CourtDocuments/CourtDocuments'
import EditableCaseFile from '@island.is/judicial-system-web/src/components/EditableCaseFile/EditableCaseFile'
import { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from './CourtRecord.css'

const CourtRecord: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { handleAddDocument } = useCourtDocuments()
  const controls = useDragControls()
  const [reorderableItems, setReorderableItems] = useState<
    { id: string; name: string }[]
  >([])

  useEffect(() => {
    if (!workingCase.courtDocuments) {
      return
    }

    setReorderableItems(
      workingCase.courtDocuments.map((doc) => ({
        id: doc.id,
        name: doc.name,
      })),
    )
  }, [workingCase.courtDocuments])

  return (
    <MultipleValueList
      onAddValue={(v) =>
        setReorderableItems((prev) => [...prev, { id: uuid(), name: v }])
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
          className={styles.ul}
        >
          {reorderableItems.map((item, index) => {
            return (
              <Reorder.Item key={item.id} value={item} data-reorder-item>
                <EditableCaseFile
                  enableDrag
                  caseFile={{ id: item.id, displayText: item.name }}
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
                  onDelete={function (file: TUploadFile): void {
                    throw new Error('Function not implemented.')
                  }}
                  onStartEditing={function (): void {
                    throw new Error('Function not implemented.')
                  }}
                  onStopEditing={function (): void {
                    throw new Error('Function not implemented.')
                  }}
                />
              </Reorder.Item>
            )
          })}
        </Reorder.Group>
        <Box display="flex" flexDirection="column" rowGap={2}>
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
  )
}

export default CourtRecord
