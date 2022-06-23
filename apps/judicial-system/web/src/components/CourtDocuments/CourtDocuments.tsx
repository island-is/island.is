import React, { useState, useRef } from 'react'
import { useKey } from 'react-use'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import Select, {
  components,
  ControlProps,
  IndicatorProps,
  MenuProps,
  OptionProps,
  PlaceholderProps,
  ValueContainerProps,
} from 'react-select'

import {
  Box,
  Button,
  Icon,
  Input,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { courtDocuments as m } from '@island.is/judicial-system-web/messages'
import { Case, CourtDocument, UserRole } from '@island.is/judicial-system/types'
import { theme } from '@island.is/island-ui/theme'

import BlueBox from '../BlueBox/BlueBox'
import { ReactSelectOption } from '../../types'
import * as styles from './CourtDocuments.css'

interface CourtDocumentsProps {
  title: string
  text: string
  tagText: string
  tagVariant: TagVariant
  caseId: string
  selectedCourtDocuments: Array<CourtDocument>
  onUpdateCase: (
    id: string,
    updatedCase: { courtDocuments: Array<CourtDocument> },
  ) => void
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
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
  const { formatMessage } = useIntl()
  const [courtDocuments, setCourtDocuments] = useState<Array<CourtDocument>>(
    selectedCourtDocuments,
  )
  const [nextDocumentToUpload, setNextDocumentToUpload] = useState<string>('')
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false)
  const additionalCourtDocumentRef = useRef<HTMLInputElement>(null)

  const handleAddDocument = () => {
    if (nextDocumentToUpload) {
      const updatedCourtDocuments = [
        ...courtDocuments,
        { name: nextDocumentToUpload } as CourtDocument,
      ]

      onUpdateCase(caseId, { courtDocuments: updatedCourtDocuments })

      setWorkingCase({ ...workingCase, courtDocuments: updatedCourtDocuments })
      setCourtDocuments(updatedCourtDocuments)
      setNextDocumentToUpload('')

      if (additionalCourtDocumentRef.current) {
        additionalCourtDocumentRef.current.focus()
      }
    }
  }

  const handleSubmittedBy = (index: number, submittedBy: UserRole) => {
    const updatedCourtDocuments = courtDocuments.map((doc, idx) =>
      idx === index ? ({ name: doc.name, submittedBy } as CourtDocument) : doc,
    )

    onUpdateCase(caseId, { courtDocuments: updatedCourtDocuments })

    setWorkingCase({ ...workingCase, courtDocuments: updatedCourtDocuments })
    setCourtDocuments(updatedCourtDocuments)
  }

  const handleRemoveDocument = async (index: number) => {
    const updatedCourtDocuments = courtDocuments.filter(
      (_, documentIndex) => documentIndex !== index,
    )

    onUpdateCase(caseId, { courtDocuments: updatedCourtDocuments })
    setCourtDocuments(updatedCourtDocuments)
  }

  const whoFiledOptions = [
    { value: UserRole.PROSECUTOR, label: formatMessage(m.whoFiled.prosecutor) },
    { value: UserRole.DEFENDER, label: formatMessage(m.whoFiled.defendant) },
    { value: UserRole.JUDGE, label: formatMessage(m.whoFiled.court) },
  ]

  const DropdownIndicator = (props: IndicatorProps<ReactSelectOption>) => {
    return (
      <components.DropdownIndicator {...props}>
        <Icon icon="chevronDown" size="small" color="blue400" />
      </components.DropdownIndicator>
    )
  }

  const Control = (props: ControlProps<ReactSelectOption>) => {
    return (
      <components.Control
        className={cn(styles.control, {
          [styles.menuIsOpen]: menuIsOpen,
        })}
        {...props}
      >
        {props.children}
      </components.Control>
    )
  }

  const Placeholder = (props: PlaceholderProps<ReactSelectOption>) => {
    return (
      <components.Placeholder {...props}>
        <Text color="dark300">{props.children}</Text>
      </components.Placeholder>
    )
  }

  const ValueContainer = (props: ValueContainerProps<ReactSelectOption>) => (
    <components.ValueContainer {...props}>
      <Text fontWeight="light">{props.children}</Text>
    </components.ValueContainer>
  )

  const Menu = (props: MenuProps<ReactSelectOption>) => (
    <components.Menu className={styles.menu} {...props} />
  )

  const Option = (props: OptionProps<ReactSelectOption>) => {
    return (
      <components.Option className={cn(styles.option)} {...props}>
        <Text>{props.children}</Text>
      </components.Option>
    )
  }

  const ClearIndicator = (props: IndicatorProps<ReactSelectOption>) => {
    return (
      <components.ClearIndicator {...props}>
        <Icon icon="close" size="small" color="blue400" />
      </components.ClearIndicator>
    )
  }

  // Add document on enter press
  useKey('Enter', handleAddDocument, undefined, [nextDocumentToUpload])

  return (
    <BlueBox>
      <div className={styles.addCourtDocumentContainer}>
        <Input
          name="add-court-document"
          label={formatMessage(m.add.label)}
          placeholder={formatMessage(m.add.placeholder)}
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
          {formatMessage(m.add.buttonText)}
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
            <Text variant="h4">{courtDocument.name}</Text>
            <Box display="flex" flexGrow={1} justifyContent="flexEnd">
              <div
                className={styles.dropdownContainer}
                style={{
                  width: courtDocument.submittedBy
                    ? `${theme.spacing[31]}px`
                    : `${theme.spacing[25]}px`,
                }}
              >
                <Select
                  classNamePrefix="court-documents-select"
                  options={whoFiledOptions}
                  placeholder={formatMessage(m.whoFiled.placeholder)}
                  components={{
                    DropdownIndicator,
                    IndicatorSeparator: null,
                    Control,
                    Placeholder,
                    ValueContainer,
                    Menu,
                    Option,
                    ClearIndicator,
                  }}
                  value={whoFiledOptions.find(
                    (option) => option.value === courtDocument.submittedBy,
                  )}
                  onChange={(option) => {
                    handleSubmittedBy(
                      index,
                      (option as ReactSelectOption)?.value as UserRole,
                    )
                  }}
                  onMenuOpen={() => {
                    setMenuIsOpen(true)
                  }}
                  onMenuClose={() => {
                    setMenuIsOpen(false)
                  }}
                  isSearchable={false}
                  isClearable
                />
              </div>
              <Box display="flex" alignItems="center">
                <Box marginRight={2}>
                  <Tag variant={tagVariant} outlined disabled>
                    {
                      // +2 because index is zero based and "Krafa um ..." is number 1
                      formatMessage(m.tag, { index: index + 2 })
                    }
                  </Tag>
                </Box>
                <button onClick={() => handleRemoveDocument(index)}>
                  <Icon icon="close" color="blue400" size="small" />
                </button>
              </Box>
            </Box>
          </div>
        )
      })}
    </BlueBox>
  )
}

export default CourtDocuments
