import React, { useState, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  Checkbox,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { PoliceCaseInfo } from '@island.is/judicial-system-web/src/graphql/schema'
import { PoliceCaseFilesMessageBox } from '@island.is/judicial-system-web/src/routes/Prosecutor/components'
import { useGetPoliceCaseInfoQuery } from '@island.is/judicial-system-web/src/routes/Prosecutor/graphql/PoliceCaseInfo.generated'

import { PoliceCase } from '../Defendant'
import { lokeNumberList as strings } from './LokeNumberList.strings'

interface Props {
  caseId: string
  addPoliceCaseNumbers: (policeCases: PoliceCase[]) => void
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
  const { caseId, addPoliceCaseNumbers } = props
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  const [policeCaseInfoResponse, setPoliceCaseInfoResponse] = useState<
    PoliceCaseInfo[]
  >([])

  const [availablePoliceCases, setAvailablePoliceCases] = useState<
    PoliceCaseInfo[]
  >([])
  const [selectedPoliceCases, setSelectedPoliceCases] = useState<
    PoliceCaseInfo[]
  >([])

  useEffect(() => {
    const available = policeCaseInfoResponse.filter(
      (caseInfo) =>
        !workingCase.policeCaseNumbers.includes(caseInfo.policeCaseNumber),
    )
    setAvailablePoliceCases(available)
  }, [workingCase, policeCaseInfoResponse])

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

  function handleSelectedPoliceCases(
    selected: boolean,
    policeCase: PoliceCaseInfo,
  ) {
    if (selected) {
      setSelectedPoliceCases([...selectedPoliceCases, policeCase])
    } else {
      setSelectedPoliceCases(
        selectedPoliceCases.filter((item) => item !== policeCase),
      )
    }
  }

  const handleCreatePoliceCases = () => {
    const policeCases = selectedPoliceCases.map((policeCase) => ({
      number: policeCase.policeCaseNumber,
      place: policeCase.place || undefined,
      date: policeCase.date ? new Date(policeCase.date) : undefined,
    }))

    addPoliceCaseNumbers(policeCases)
    setSelectedPoliceCases([])
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
                checked={
                  selectedPoliceCases.length > 0 &&
                  selectedPoliceCases.length === availablePoliceCases.length
                }
                disabled={availablePoliceCases.length === 0}
                onChange={(event) => {
                  setSelectedPoliceCases(
                    event.target.checked ? availablePoliceCases : [],
                  )
                }}
              />
            </Box>
            {availablePoliceCases && availablePoliceCases.length > 0 ? (
              availablePoliceCases.map((info) => (
                <CheckBoxContainer key={info.policeCaseNumber}>
                  <Checkbox
                    label={info.policeCaseNumber}
                    name={info.policeCaseNumber}
                    checked={
                      selectedPoliceCases.find(
                        (c) => c.policeCaseNumber === info.policeCaseNumber,
                      )
                        ? true
                        : false
                    }
                    backgroundColor="blue"
                    onChange={(e) => {
                      handleSelectedPoliceCases(
                        e.target.checked,
                        info as PoliceCaseInfo,
                      )
                    }}
                  />
                </CheckBoxContainer>
              ))
            ) : (
              <PoliceCaseFilesMessageBox
                icon="checkmark"
                iconColor="blue400"
                message={formatMessage(strings.allNumbersSelected)}
              />
            )}
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
          onClick={handleCreatePoliceCases}
          disabled={selectedPoliceCases.length === 0}
        >
          {formatMessage(strings.selectNumbersButton)}
        </Button>
      </Box>
    </>
  )
}
