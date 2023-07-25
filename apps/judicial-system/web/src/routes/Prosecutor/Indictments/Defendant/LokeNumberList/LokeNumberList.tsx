import React, { useState, useContext } from 'react'
import { useIntl } from 'react-intl'
import parseISO from 'date-fns/parseISO'

import {
  Box,
  Button,
  Checkbox,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'

import { useGetPoliceCaseInfoQuery } from '../../../graphql/PoliceCaseInfo.generated'
import { PoliceCaseInfo } from '@island.is/judicial-system-web/src/graphql/schema'

import { lokeNumberList as strings } from './LokeNumberList.strings'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { PoliceCase } from '../Defendant'

interface Props {
  caseId: string
  onAddPoliceCaseNumber: (policeCaseInfo: PoliceCase) => void
  onRemovePoliceCaseNumber: (index: number) => void
}
interface CheckBoxContainerProps {
  children: React.ReactNode
}

const CheckBoxContainer: React.FC<CheckBoxContainerProps> = (props) => {
  return (
    <Box
      paddingX={3}
      paddingY={2}
      borderRadius="standard"
      background="blue100"
      marginBottom={2}
    >
      {props.children}
    </Box>
  )
}

export const LokeNumberList: React.FC<Props> = (props) => {
  const { caseId, onAddPoliceCaseNumber, onRemovePoliceCaseNumber } = props
  const { formatMessage } = useIntl()

  const { workingCase } = useContext(FormContext)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  const [policeCaseInfoResponse, setPoliceCaseInfoResponse] =
    useState<PoliceCaseInfo[]>()

  useGetPoliceCaseInfoQuery({
    variables: {
      input: {
        caseId: caseId,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setIsLoading(false)
      setPoliceCaseInfoResponse(data.policeCaseInfo as PoliceCaseInfo[])
    },
    onError: () => {
      setHasError(true)
    },
  })

  function handlePoliceCaseChange(policeCaseNumber: string) {
    if (!policeCaseInfoResponse) {
      return
    }

    if (
      workingCase?.policeCaseNumbers &&
      !workingCase.policeCaseNumbers.find(
        (number) => number === policeCaseNumber,
      )
    ) {
      const caseInfo = policeCaseInfoResponse.find(
        (info) => info.policeCaseNumber === policeCaseNumber,
      )
      onAddPoliceCaseNumber({
        number: caseInfo?.policeCaseNumber || '',
        place: caseInfo?.place || undefined,
        date: caseInfo?.date ? parseISO(caseInfo?.date) : undefined,
      })
    } else {
      const policeCaseIndex = workingCase?.policeCaseNumbers?.findIndex(
        (c) => c === policeCaseNumber,
      )

      onRemovePoliceCaseNumber(policeCaseIndex + 1)
    }
  }

  if (hasError) {
    return (
      <Box
        marginBottom={6}
        borderColor="red600"
        borderWidth="standard"
        paddingX={4}
        paddingY={1}
        borderRadius="standard"
      >
        <Text fontWeight="semiBold" color="red600">
          {formatMessage(strings.errorMessage)}
        </Text>
      </Box>
    )
  }
  return (
    <>
      <Box
        marginBottom={3}
        borderColor="blue200"
        borderWidth="standard"
        paddingX={4}
        paddingY={1}
        borderRadius="standard"
      >
        {isLoading ? (
          <Box textAlign="center" paddingY={2} paddingX={3} marginBottom={2}>
            <LoadingDots />
          </Box>
        ) : (
          <>
            <Box paddingX={3} paddingY={2}>
              <Checkbox
                label={formatMessage(strings.selectAllCheckbox)}
                name="Velja öll"
              />
            </Box>
            {policeCaseInfoResponse &&
              policeCaseInfoResponse.slice(1).map((info) => (
                <CheckBoxContainer key={info.policeCaseNumber}>
                  <Checkbox
                    label={info.policeCaseNumber}
                    name={info.policeCaseNumber}
                    checked={
                      workingCase?.policeCaseNumbers?.find(
                        (n) => n === info.policeCaseNumber,
                      ) !== undefined
                    }
                    backgroundColor="blue"
                    onChange={() => {
                      handlePoliceCaseChange(info.policeCaseNumber)
                    }}
                  />
                </CheckBoxContainer>
              ))}
          </>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        marginTop={3}
        marginBottom={5}
      >
        <Button
          onClick={() => {
            // TODO
          }}
        >
          Velja númer
        </Button>
      </Box>
    </>
  )
}
