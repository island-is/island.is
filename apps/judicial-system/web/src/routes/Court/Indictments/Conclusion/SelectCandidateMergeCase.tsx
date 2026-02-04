import { Dispatch, FC, SetStateAction } from 'react'

import {
  AlertMessage,
  Box,
  LoadingDots,
  Select,
} from '@island.is/island-ui/core'
import {
  Case,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

import { useCandidateMergeCasesQuery } from './candidateMergeCases.generated'

type CandidateMergeCaseOption = ReactSelectOption

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  mergeCaseNumber?: string | null
}

const SelectCandidateMergeCase: FC<Props> = ({
  workingCase,
  setWorkingCase,
  mergeCaseNumber,
}) => {
  const { data: candidateMergeCasesData, loading: candidateMergeCasesLoading } =
    useCandidateMergeCasesQuery({
      variables: { input: { id: workingCase.id } },
    })

  const setCandidateMergeCase = async (candidateMergeCaseId: string | null) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      mergeCase: candidateMergeCaseId ? { id: candidateMergeCaseId } : null,
    }))
  }

  const candidateMergeCases: CandidateMergeCaseOption[] =
    candidateMergeCasesData?.candidateMergeCases?.map((candidateMergeCase) => ({
      label: `${candidateMergeCase.courtCaseNumber}`,
      value: candidateMergeCase.id,
    })) ?? []

  const defaultCandidateMergeCase = candidateMergeCases?.find(
    (candidateMergeCase) =>
      workingCase.mergeCase &&
      candidateMergeCase.value === workingCase.mergeCase?.id,
  )

  if (candidateMergeCasesLoading) {
    return (
      <Box
        textAlign="center"
        paddingY={2}
        paddingX={3}
        marginBottom={2}
        key="loading-dots"
      >
        <LoadingDots />
      </Box>
    )
  } else {
    return candidateMergeCases.length === 0 ? (
      <AlertMessage type="warning" message="Engin opin mál fundust á ákærðu" />
    ) : (
      <Select
        name="connectedCase"
        label="Opin mál ákærðu í Réttarvörslugátt"
        options={candidateMergeCases}
        value={defaultCandidateMergeCase}
        placeholder="Hvaða máli sameinast þetta mál?"
        onChange={(selectedOption) => {
          setCandidateMergeCase((selectedOption?.value as string) || null)
        }}
        isDisabled={
          candidateMergeCasesLoading ||
          Boolean(mergeCaseNumber) ||
          workingCase.state === CaseState.CORRECTING
        }
        isClearable
      />
    )
  }
}

export default SelectCandidateMergeCase
