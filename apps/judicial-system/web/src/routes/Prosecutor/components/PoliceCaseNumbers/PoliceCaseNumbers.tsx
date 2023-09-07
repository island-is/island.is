import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Icon, Tag, Text } from '@island.is/island-ui/core'
import {
  MultipleValueList,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseOrigin } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'

import { policeCaseNumber as m } from './PoliceCaseNumbers.strings'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  clientPoliceNumbers: string[]
  setClientPoliceNumbers: React.Dispatch<React.SetStateAction<string[]>>
}

// Needed so that users can remove all loke numbers in client without syncing to server
export const usePoliceCaseNumbers = (workingCase: Case) => {
  const [clientPoliceNumbers, setClientPoliceNumbers] = useState<string[]>(
    workingCase.policeCaseNumbers,
  )
  useEffect(() => {
    if (workingCase.id) {
      setClientPoliceNumbers(workingCase.policeCaseNumbers)
    }
  }, [workingCase.id, workingCase.policeCaseNumbers])

  return { clientPoliceNumbers, setClientPoliceNumbers }
}

export const PoliceCaseNumbers: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const {
    workingCase,
    setWorkingCase,
    clientPoliceNumbers,
    setClientPoliceNumbers,
  } = props
  const { user } = useContext(UserContext)
  const { setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  const isLOKECase = workingCase.origin === CaseOrigin.LOKE

  const [hasError, setHasError] = useState(false)
  const updatePoliceNumbers = useCallback(
    (newPoliceCaseNumbers: string[]) => {
      setClientPoliceNumbers(newPoliceCaseNumbers)
      setAndSendCaseToServer(
        [
          {
            policeCaseNumbers: newPoliceCaseNumbers,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    },
    [
      workingCase,
      setWorkingCase,
      setAndSendCaseToServer,
      setClientPoliceNumbers,
    ],
  )

  const onAdd = useCallback(
    (value: string) => {
      if (validate([[value, ['empty', 'police-casenumber-format']]]).isValid) {
        updatePoliceNumbers([...clientPoliceNumbers, value])
        setHasError(false)
      }
    },
    [clientPoliceNumbers, updatePoliceNumbers, setHasError],
  )

  const onRemove = useCallback(
    (value: string) => () => {
      const newPoliceCaseNumbers = clientPoliceNumbers.filter(
        (number) => number !== value,
      )
      if (newPoliceCaseNumbers.length > 0) {
        updatePoliceNumbers(newPoliceCaseNumbers)
      } else {
        setHasError(true)
      }
      setClientPoliceNumbers(newPoliceCaseNumbers)
    },
    [clientPoliceNumbers, updatePoliceNumbers, setClientPoliceNumbers],
  )

  return (
    <>
      <SectionHeading title={formatMessage(m.heading)} required />
      <MultipleValueList
        name="policeCaseNumbers"
        inputMask="999-9999-9999999"
        inputLabel={formatMessage(m.label)}
        inputPlaceholder={formatMessage(m.placeholder, {
          prefix: user?.institution?.policeCaseNumberPrefix ?? '',
          year: new Date().getFullYear(),
        })}
        onAddValue={onAdd}
        buttonText={formatMessage(m.buttonText)}
        isDisabled={(value) =>
          !validate([[value, ['empty', 'police-casenumber-format']]]).isValid
        }
        onBlur={(event) => {
          setHasError(clientPoliceNumbers.length === 0 && !event.target.value)
        }}
        hasError={hasError}
        errorMessage={validate([[undefined, ['empty']]]).errorMessage}
      >
        {clientPoliceNumbers.length === 0 ? (
          <Text color="dark400" dataTestId="noPoliceCaseNumbersAssignedMessage">
            {formatMessage(m.noPoliceCaseNumbersAssignedMessage)}
          </Text>
        ) : (
          <Box
            display="flex"
            flexWrap="wrap"
            data-testid="policeCaseNumbers-list"
          >
            {clientPoliceNumbers.map((policeCaseNumber, index) => (
              <Box
                key={`${policeCaseNumber}-${index}`}
                paddingRight={1}
                paddingBottom={1}
              >
                <Tag
                  variant="darkerBlue"
                  onClick={onRemove(policeCaseNumber)}
                  aria-label={`Eyða númeri ${policeCaseNumber}`}
                  disabled={isLOKECase && index === 0}
                >
                  <Box display="flex" alignItems="center">
                    <Box paddingRight={'smallGutter'}>{policeCaseNumber}</Box>
                    {isLOKECase && index > 0 ? null : (
                      <Icon icon="close" size="small" />
                    )}
                  </Box>
                </Tag>
              </Box>
            ))}
          </Box>
        )}
      </MultipleValueList>
    </>
  )
}
