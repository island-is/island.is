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
import UseKey from 'react-use/lib/comps/UseKey'
import BlueBox from '../BlueBox/BlueBox'
import * as styles from './CourtDocument.treat'
interface CourtDocumentProps {
  title: string
  text: string
  tagText: string
  tagVariant: TagVariant
}

const CourtDocument: React.FC<CourtDocumentProps> = ({
  title,
  text,
  tagText,
  tagVariant,
}: CourtDocumentProps) => {
  const [courtDocuments, setCourtDocuments] = useState<Array<string>>([])
  const [nextDocumentToUpload, setNextDocumentToUpload] = useState<string>('')
  const additionalCourtDocumentRef = useRef<HTMLInputElement>(null)

  const handleAddDocument = () => {
    if (nextDocumentToUpload) {
      setCourtDocuments([...courtDocuments, nextDocumentToUpload])
      setNextDocumentToUpload('')
      additionalCourtDocumentRef.current?.focus()
    }
  }

  const handleRemoveDocument = (index: number) => {
    setCourtDocuments(
      courtDocuments.filter((_, documentIndex) => documentIndex !== index),
    )
  }

  // Add document on enter press
  useKey('Enter', handleAddDocument, undefined, [nextDocumentToUpload])

  return (
    <BlueBox>
      <Box marginBottom={1}>
        <Text variant="h4">{title}</Text>
      </Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="flexEnd"
        marginBottom={5}
      >
        <Text>{text}</Text>
        <Tag variant={tagVariant} outlined disabled>
          {tagText}
        </Tag>
      </Box>
      <div className={styles.addCourtDocumentContainer}>
        <Input
          name="add-court-document"
          label="Heiti dómsskjals"
          placeholder="Skrá inn heiti á skjali hér"
          size="sm"
          value={nextDocumentToUpload}
          onChange={(evt) => setNextDocumentToUpload(evt.target.value)}
          ref={additionalCourtDocumentRef}
        />
        <Button
          icon="add"
          size="small"
          disabled={!nextDocumentToUpload}
          onClick={() => handleAddDocument()}
        >
          Bæta við skjali
        </Button>
      </div>
      {courtDocuments.map((courtDocument, index) => {
        return (
          <div className={styles.additionalCordDocumentContainer} key={index}>
            <Text variant="h4">{courtDocument}</Text>
            <Box display="flex" alignItems="center">
              <Box marginRight={2}>
                <Tag variant={tagVariant} outlined disabled>{`Þingmerkt nr. ${
                  // +2 because index is zero based and "Police demands" is number 1
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

export default CourtDocument
