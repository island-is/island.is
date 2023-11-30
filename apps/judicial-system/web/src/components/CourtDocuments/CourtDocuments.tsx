import React, { Dispatch, FC, useState } from 'react'
import { useIntl } from 'react-intl'
import Select, {
  ClearIndicatorProps,
  components,
  DropdownIndicatorProps,
  OptionProps,
  PlaceholderProps,
  SingleValueProps,
} from 'react-select'

import { Box, IconDeprecated, Tag, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { formatRequestCaseType } from '@island.is/judicial-system/formatters'
import { core, courtDocuments } from '@island.is/judicial-system-web/messages'
import Trash from '@island.is/judicial-system-web/src/components/Icon/Trash'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CourtDocument,
  ReactSelectOption,
  TempCase as Case,
} from '@island.is/judicial-system-web/src/types'

import { useCase } from '../../utils/hooks'
import MultipleValueList from '../MultipleValueList/MultipleValueList'
import * as styles from './CourtDocuments.css'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<React.SetStateAction<Case>>
}

const CourtDocuments: FC<React.PropsWithChildren<Props>> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer, isUpdatingCase } = useCase()
  const [submittedByMenuIsOpen, setSubmittedByMenuIsOpen] =
    useState<boolean>(false)

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

  const DropdownIndicator = (
    props: DropdownIndicatorProps<ReactSelectOption>,
  ) => {
    return (
      <components.DropdownIndicator {...props}>
        <IconDeprecated
          type="cheveron"
          width={12}
          height={12}
          color="blue400"
        />
      </components.DropdownIndicator>
    )
  }

  const Placeholder = (props: PlaceholderProps<ReactSelectOption>) => {
    return (
      <components.Placeholder {...props}>
        <Text color="dark300" variant="small">
          {props.children}
        </Text>
      </components.Placeholder>
    )
  }

  const SingleValue = (props: SingleValueProps<ReactSelectOption>) => {
    return (
      <components.SingleValue {...props}>
        <Text variant="small">{props.children}</Text>
      </components.SingleValue>
    )
  }

  const Option = (props: OptionProps<ReactSelectOption>) => {
    return (
      <components.Option {...props}>
        <Text variant="small">{props.children}</Text>
      </components.Option>
    )
  }

  const ClearIndicator = (props: ClearIndicatorProps<ReactSelectOption>) => {
    return (
      <components.ClearIndicator {...props}>
        <IconDeprecated type="close" width={12} height={12} color="blue400" />
      </components.ClearIndicator>
    )
  }

  const handleRemoveDocument = (name: string) => {
    const updatedCourtDocuments = workingCase.courtDocuments?.filter((doc) => {
      return doc.name !== name
    })

    setAndSendCaseToServer(
      [{ courtDocuments: updatedCourtDocuments, force: true }],
      workingCase,
      setWorkingCase,
    )
  }

  const handleAddDocument = (document: string) => {
    const updatedCourtDocuments = [
      ...(workingCase.courtDocuments || []),
      { name: document } as CourtDocument,
    ]

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

    setAndSendCaseToServer(
      [
        {
          courtDocuments: updatedCourtDocuments,
          force: true,
        },
      ],
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
          {workingCase.courtDocuments?.map((courtDocument, index) => {
            return (
              <div
                key={`${courtDocument.name}-${courtDocument.submittedBy}`}
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
                      isLoading={isUpdatingCase}
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
                          boxShadow: submittedByMenuIsOpen
                            ? `inset 0 0 0 3px ${theme.color.mint400}`
                            : 'none',
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                          borderBottomLeftRadius: submittedByMenuIsOpen ? 0 : 8,
                          borderBottomRightRadius: submittedByMenuIsOpen
                            ? 0
                            : 8,
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
                          background: isSelected
                            ? theme.color.blue200
                            : 'white',
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
                        setSubmittedByMenuIsOpen(true)
                      }}
                      onMenuClose={() => {
                        setSubmittedByMenuIsOpen(false)
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
                <button
                  onClick={() => handleRemoveDocument(courtDocument.name)}
                  className={styles.removeButton}
                >
                  <Trash width={14} height={14} color={theme.color.blue400} />
                </button>
              </div>
            )
          })}
        </>
      </MultipleValueList>
    </>
  )
}

export default CourtDocuments
