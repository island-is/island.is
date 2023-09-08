import React, { Dispatch, FC, useState } from 'react'
import { useIntl } from 'react-intl'
import Select, {
  ClearIndicatorProps,
  components,
  ControlProps,
  DropdownIndicatorProps,
  MenuProps,
  OptionProps,
  PlaceholderProps,
  ValueContainerProps,
} from 'react-select'
import cn from 'classnames'

import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { formatRequestCaseType } from '@island.is/judicial-system/formatters'
import { core, courtDocuments } from '@island.is/judicial-system-web/messages'
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
  const { setAndSendCaseToServer } = useCase()
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
      value: UserRole.JUDGE,
      label: formatMessage(courtDocuments.whoFiled.court),
    },
  ]

  const DropdownIndicator = (
    props: DropdownIndicatorProps<ReactSelectOption>,
  ) => {
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
          [styles.submittedByMenuIsOpen]: submittedByMenuIsOpen,
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
      <Text as="span" fontWeight="light">
        {props.children}
      </Text>
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

  const ClearIndicator = (props: ClearIndicatorProps<ReactSelectOption>) => {
    return (
      <components.ClearIndicator {...props}>
        <Icon icon="close" size="small" color="blue400" />
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
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            marginBottom={3}
          >
            <Text>{formatMessage(courtDocuments.text)}</Text>
            <Tag variant="darkerBlue" outlined disabled>
              {formatMessage(courtDocuments.tag, { index: 1 })}
            </Tag>
          </Box>
          {workingCase.courtDocuments?.map((courtDocument, index) => {
            return (
              <div key={index} className={styles.valueWrapper}>
                <Box display="flex" flexGrow={1}>
                  <Text variant="h4">{courtDocument.name}</Text>
                </Box>
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
                    placeholder={formatMessage(
                      courtDocuments.whoFiled.placeholder,
                    )}
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
                  <button
                    onClick={() => handleRemoveDocument(courtDocument.name)}
                  >
                    <Icon icon="close" color="blue400" size="small" />
                  </button>
                </Box>
              </div>
            )
          })}
        </>
      </MultipleValueList>
    </>
  )
}

export default CourtDocuments
