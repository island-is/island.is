import { FC, useContext, useEffect, useState } from 'react'
import { Reorder, useDragControls } from 'motion/react'

import { Box, Tag } from '@island.is/island-ui/core'
import {
  CaseFile,
  FormContext,
  MultipleValueList,
} from '@island.is/judicial-system-web/src/components'
import { useCourtDocuments } from '@island.is/judicial-system-web/src/components/CourtDocuments/CourtDocuments'

import * as styles from './CourtRecord.css'

const CourtRecord: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { handleAddDocument } = useCourtDocuments()
  const controls = useDragControls()
  const [reorderableItems, setReorderableItems] = useState<{ name: string }[]>(
    [],
  )

  useEffect(() => {
    if (!workingCase.courtDocuments) {
      return
    }

    setReorderableItems(
      workingCase.courtDocuments.map((doc) => ({
        name: doc.name,
      })),
    )
  }, [workingCase.courtDocuments])

  return (
    <MultipleValueList
      onAddValue={handleAddDocument}
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
        >
          {reorderableItems.map((item, index) => {
            return (
              <Reorder.Item key={item.name} value={item} data-reorder-item>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="spaceBetween"
                  key={item.name}
                >
                  <p>{item.name}</p>
                </Box>
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
