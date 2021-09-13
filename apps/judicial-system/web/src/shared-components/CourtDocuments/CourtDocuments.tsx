import {
  Box,
  Button,
  Icon,
  Input,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import React, { useState, useRef } from 'react'
import { useKey } from 'react-use'
import type { Case } from '@island.is/judicial-system/types'
import { parseArray } from '@island.is/judicial-system-web/src/utils/formatters'
import BlueBox from '../BlueBox/BlueBox'
import * as styles from './CourtDocuments.treat'
interface CourtDocumentsProps {
  title: string
  text: string
  tagText: string
  tagVariant: TagVariant
  caseId: string
  selectedCourtDocuments: Array<string>
  onUpdateCase: (
    id: string,
    updatedCase: { courtDocuments: Array<string> },
  ) => void
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  workingCase: Case
}

const CourtDocuments: React.FC<CourtDocumentsProps> = ({
  title,
  text,
  tagText,
  tagVariant,
  caseId,
  selectedCourtDocuments,
  onUpdateCase,
  setWorkingCase,
  workingCase,
}: CourtDocumentsProps) => {
  const [courtDocuments, setCourtDocuments] = useState<Array<string>>(
    selectedCourtDocuments,
  )
  const [nextDocumentToUpload, setNextDocumentToUpload] = useState<string>('')
  const additionalCourtDocumentRef = useRef<HTMLInputElement>(null)

  const handleAddDocument = () => {
    if (nextDocumentToUpload) {
      const updatedCourtDocuments = [...courtDocuments, nextDocumentToUpload]

      onUpdateCase(caseId, parseArray('courtDocuments', updatedCourtDocuments))

      setWorkingCase({ ...workingCase, courtDocuments: updatedCourtDocuments })
      setCourtDocuments(updatedCourtDocuments)
      setNextDocumentToUpload('')

      if (additionalCourtDocumentRef.current) {
        additionalCourtDocumentRef.current.focus()
      }
    }
  }

  const handleRemoveDocument = async (index: number) => {
    const updatedCourtDocuments = courtDocuments.filter(
      (_, documentIndex) => documentIndex !== index,
    )

    onUpdateCase(caseId, parseArray('courtDocuments', updatedCourtDocuments))
    setCourtDocuments(updatedCourtDocuments)
  }

  // Add document on enter press
  useKey('Enter', handleAddDocument, undefined, [nextDocumentToUpload])

  return (
    <BlueBox>
      <div className={styles.addCourtDocumentContainer}>
        <Input
          name="add-court-document"
          label="Heiti dómskjals"
          placeholder="Skrá inn heiti á skjali hér"
          size="sm"
          autoComplete="off"
          value={nextDocumentToUpload}
          onChange={(evt) => setNextDocumentToUpload(evt.target.value)}
          ref={additionalCourtDocumentRef}
        />
        <Button
          icon="add"
          size="small"
          disabled={!nextDocumentToUpload}
          onClick={() => handleAddDocument()}
          fluid
        >
          Bæta við skjali
        </Button>
      </div>
      <Box marginBottom={1}>
        <Text variant="h4">{title}</Text>
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexEnd"
        marginBottom={3}
      >
        <Text>{text}</Text>
        <Tag variant={tagVariant} outlined disabled>
          {tagText}
        </Tag>
      </Box>
      {courtDocuments.map((courtDocument, index) => {
        return (
          <div className={styles.additionalCourtDocumentContainer} key={index}>
            <Text variant="h4">{courtDocument}</Text>
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>
                <Tag variant={tagVariant} outlined disabled>{`Þingmerkt nr. ${
                  // +2 because index is zero based and "Krafa um ..." is number 1
                  index + 2
                }`}</Tag>
              </Box>
              <button onClick={() => handleRemoveDocument(index)}>
                <Icon icon="close" color="blue400" size="small" />
              </button>
            </Box>
          </div>
        )
      })}
    </BlueBox>
  )
}

export default CourtDocuments
