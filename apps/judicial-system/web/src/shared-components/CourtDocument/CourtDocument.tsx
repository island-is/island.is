import { useMutation } from '@apollo/client'
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
import { UpdateCaseMutation } from '@island.is/judicial-system-web/src/graphql'
import BlueBox from '../BlueBox/BlueBox'
import * as styles from './CourtDocument.treat'
import { UpdateCase } from '@island.is/judicial-system/types'
import { parseArray } from '@island.is/judicial-system-web/src/utils/formatters'
interface CourtDocumentProps {
  title: string
  text: string
  tagText: string
  tagVariant: TagVariant
  caseId: string
  selectedCourtDocuments: Array<string>
}

const CourtDocument: React.FC<CourtDocumentProps> = ({
  title,
  text,
  tagText,
  tagVariant,
  caseId,
  selectedCourtDocuments,
}: CourtDocumentProps) => {
  const [courtDocuments, setCourtDocuments] = useState<Array<string>>(
    selectedCourtDocuments,
  )
  const [nextDocumentToUpload, setNextDocumentToUpload] = useState<string>('')
  const additionalCourtDocumentRef = useRef<HTMLInputElement>(null)

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    console.log(id)
    // Only update if id has been set
    if (!id) {
      return null
    }
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  const handleAddDocument = async () => {
    if (nextDocumentToUpload) {
      const updatedCourtDocuments = [...courtDocuments, nextDocumentToUpload]

      // Start by updating the case with the new document to avoid a race condition.
      await updateCase(
        caseId,
        parseArray('courtDocuments', updatedCourtDocuments),
      )
      setCourtDocuments(updatedCourtDocuments)
      setNextDocumentToUpload('')
      additionalCourtDocumentRef.current?.focus()
    }
  }

  const handleRemoveDocument = async (index: number) => {
    const updatedCourtDocuments = courtDocuments.filter(
      (_, documentIndex) => documentIndex !== index,
    )

    await updateCase(
      caseId,
      parseArray('courtDocuments', updatedCourtDocuments),
    )
    setCourtDocuments(updatedCourtDocuments)
  }

  // Add document on enter press
  useKey('Enter', handleAddDocument, undefined, [nextDocumentToUpload])
  console.log(selectedCourtDocuments)
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
