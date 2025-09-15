import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'
import Select from 'react-select'

import { Box, Tag, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { formatRequestCaseType } from '@island.is/judicial-system/formatters'
import { CourtDocument } from '@island.is/judicial-system/types'
import { core, courtDocuments } from '@island.is/judicial-system-web/messages'
import { IconButton } from '@island.is/judicial-system-web/src/components'
import {
  Case,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import MultipleValueList from '../MultipleValueList/MultipleValueList'
import {
  ClearIndicator,
  DropdownIndicator,
  Option,
  Placeholder,
  SingleValue,
} from '../SelectComponents/SelectComponents'
import * as styles from './CourtDocuments.css'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

const CourtDocuments: FC<Props> = ({ workingCase, setWorkingCase }) => {
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer, isUpdatingCase } = useCase()
  const [submittedByMenuIsOpen, setSubmittedByMenuIsOpen] = useState<number>(-1)
  const [updateIndex, setUpdateIndex] = useState<number | undefined>(undefined)

  const whoFiledOptions = [
    {
      value: UserRole.PROSECUTOR,
      label: formatMessage(courtDocuments.whoFiled.prosecutor),
    },
    {
      value: UserRole.DEFENDER,
      label: formatMessage(courtDocuments.whoFiled.defendant),
    },
    {
      value: UserRole.DISTRICT_COURT_JUDGE,
      label: formatMessage(courtDocuments.whoFiled.court),
    },
  ]

  const handleRemoveDocument = (index: number) => {
    const updatedCourtDocuments = workingCase.courtDocuments?.filter(
      (_doc, i) => {
        return index !== i
      },
    )

    setUpdateIndex(index)

    setAndSendCaseToServer(
      [{ courtDocuments: updatedCourtDocuments, force: true }],
      workingCase,
      setWorkingCase,
    )
  }

  const handleAddDocument = (document: string) => {
    const updatedCourtDocuments = [
      ...(workingCase.courtDocuments || []),
      { name: document, submittedBy: undefined },
    ]

    setUpdateIndex(undefined)

    setAndSendCaseToServer(
      [{ courtDocuments: updatedCourtDocuments, force: true }],
      workingCase,
      setWorkingCase,
    )
  }

  const handleSubmittedBy = (index: number, submittedBy: UserRole) => {
    const updatedCourtDocuments = workingCase.courtDocuments?.map((doc, idx) =>
      idx === index ? ({ name: doc.name, submittedBy } as CourtDocument) : doc,
    )

    setUpdateIndex(index)

    setAndSendCaseToServer(
      [{ courtDocuments: updatedCourtDocuments, force: true }],
      workingCase,
      setWorkingCase,
    )
  }

  return (
    <>
      <Box marginBottom={2}>
        <Text as="h3" variant="h3">
          {formatMessage(courtDocuments.header)}
        </Text>
      </Box>
      <MultipleValueList
        name="court-documents"
        onAddValue={handleAddDocument}
        inputLabel={formatMessage(courtDocuments.add.label)}
        inputPlaceholder={formatMessage(courtDocuments.add.placeholder)}
        buttonText={formatMessage(courtDocuments.add.buttonText)}
        isDisabled={(value) => !value}
      >
        <>
          <Box marginBottom={1}>
            <Text variant="h4">
              {formatMessage(core.requestCaseType, {
                caseType: formatRequestCaseType(workingCase.type),
              })}
            </Text>
          </Box>
          <div className={styles.firstCourtDocument}>
            <Text marginBottom={[1, 1, 1, 0]}>
              {formatMessage(courtDocuments.text)}
            </Text>
            <Box component="span">
              <Tag variant="darkerBlue" outlined disabled>
                {formatMessage(courtDocuments.tag, { index: 1 })}
              </Tag>
            </Box>
          </div>
          {workingCase.courtDocuments?.map((courtDocument, index) => (
            <div
              key={`${courtDocument.name}-${index}`}
              className={styles.valueWrapper}
            >
              <div className={styles.courtDocumentInfo}>
                <div className={styles.nameContainer}>
                  <Text variant="h4">{courtDocument.name}</Text>
                </div>
                <div className={styles.dropdownContainer}>
                  <Select
                    classNamePrefix="court-documents-select"
                    options={whoFiledOptions}
                    placeholder={formatMessage(
                      courtDocuments.whoFiled.placeholder,
                    )}
                    isLoading={isUpdatingCase && updateIndex === index}
                    components={{
                      DropdownIndicator,
                      IndicatorSeparator: null,
                      Placeholder,
                      Option,
                      ClearIndicator,
                      SingleValue,
                    }}
                    styles={{
                      control: (baseStyles) => ({
                        ...baseStyles,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow:
                          submittedByMenuIsOpen === index
                            ? `inset 0 0 0 3px ${theme.color.mint400}`
                            : 'none',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        borderBottomLeftRadius:
                          submittedByMenuIsOpen === index ? 0 : 8,
                        borderBottomRightRadius:
                          submittedByMenuIsOpen === index ? 0 : 8,
                        transition: 'none',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        marginTop: -3,
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        boxShadow: 'none',
                        borderTop: `none`,
                        borderRight: `3px solid ${theme.color.mint400}`,
                        borderLeft: `3px solid ${theme.color.mint400}`,
                        borderBottom: `3px solid ${theme.color.mint400}`,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8,
                        boxSizing: 'border-box',
                      }),
                      option: (baseStyles, { isSelected }) => ({
                        ...baseStyles,
                        cursor: 'pointer',
                        position: 'relative',
                        padding: `${theme.spacing[1]}px`,
                        background: isSelected ? theme.color.blue200 : 'white',
                        '&:hover': {
                          background: isSelected
                            ? theme.color.blue200
                            : theme.color.blue100,
                        },
                      }),
                      container: (baseStyles) => ({
                        ...baseStyles,
                        width: '100%',
                      }),
                    }}
                    value={
                      courtDocument.submittedBy
                        ? whoFiledOptions.find(
                            (option) =>
                              option.value === courtDocument.submittedBy,
                          )
                        : null
                    }
                    onChange={(option) => {
                      handleSubmittedBy(
                        index,
                        (option as ReactSelectOption)?.value as UserRole,
                      )
                    }}
                    onMenuOpen={() => {
                      setSubmittedByMenuIsOpen(index)
                    }}
                    onMenuClose={() => {
                      setSubmittedByMenuIsOpen(-1)
                    }}
                    isSearchable={false}
                    isClearable
                  />
                </div>
                <Box display="flex" alignItems="center">
                  <Box marginRight={2}>
                    <Tag variant="darkerBlue" outlined disabled>
                      {
                        // +2 because index is zero based and "Krafa um ..." is number 1
                        formatMessage(courtDocuments.tag, {
                          index: index + 2,
                        })
                      }
                    </Tag>
                  </Box>
                </Box>
              </div>
              <IconButton
                onClick={() => handleRemoveDocument(index)}
                icon="trash"
                colorScheme="blue"
              />
            </div>
          ))}
        </>
      </MultipleValueList>
    </>
  )
}

export default CourtDocuments
