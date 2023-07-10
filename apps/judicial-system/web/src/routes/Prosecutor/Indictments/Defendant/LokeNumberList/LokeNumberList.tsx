import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Button, Checkbox } from '@island.is/island-ui/core'

import { useGetPoliceCaseInfoQuery } from '../../../graphql/PoliceCaseInfo.generated'
import { PoliceCaseInfo } from '@island.is/judicial-system-web/src/graphql/schema'

import { lokeNumberList as strings } from './LokeNumberList.strings'

interface Props {
  caseId: string
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
  const { caseId } = props
  const { formatMessage } = useIntl()

  const [policeCaseInfoResponse, setPoliceCaseInfoResponse] = useState<
    PoliceCaseInfo[]
  >()

  useGetPoliceCaseInfoQuery({
    variables: {
      input: {
        caseId: caseId,
      },
    },
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setPoliceCaseInfoResponse(data.policeCaseInfo as PoliceCaseInfo[])
    },
    onError: (error) => {
      // TODO
    },
  })

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
        <Box paddingX={3} paddingY={2}>
          <Checkbox
            label={formatMessage(strings.selectAllCheckbox)}
            name="Velja öll"
          />
        </Box>
        {policeCaseInfoResponse &&
          policeCaseInfoResponse.map((info) => (
            <CheckBoxContainer key={info.policeCaseNumber}>
              <Checkbox
                label={info.policeCaseNumber}
                name={info.policeCaseNumber}
                backgroundColor="blue"
              />
            </CheckBoxContainer>
          ))}
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
