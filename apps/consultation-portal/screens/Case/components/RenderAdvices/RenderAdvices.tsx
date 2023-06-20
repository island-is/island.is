import { Stack, Text } from '@island.is/island-ui/core'
import { ReactNode } from 'react'
import { AdviceForm, AdviceList, AdviceSkeletonLoader } from '..'
import { AdviceResult, Case } from '../../../../types/interfaces'
import localization from '../../Case.json'

interface Props {
  advicesLoading?: boolean
  isStatusNameForReview?: boolean
  advices?: Array<AdviceResult>
  chosenCase?: Case
  refetchAdvices?: any
}

interface StackedProps {
  children: ReactNode
  adviceCount: number
}

const Stacked = ({ children, adviceCount }: StackedProps) => {
  const loc = localization['renderAdvices']
  return (
    <Stack space={3}>
      <Text variant="h1" color="blue400">
        {`${loc.advices.title} (${adviceCount ? adviceCount : 0})`}
      </Text>
      {children}
    </Stack>
  )
}

const RenderAdvices = ({
  advicesLoading = false,
  isStatusNameForReview = false,
  advices,
  chosenCase,
  refetchAdvices,
}: Props) => {
  if (advicesLoading) {
    return (
      <Stacked adviceCount={chosenCase?.adviceCount}>
        <AdviceSkeletonLoader />
      </Stacked>
    )
  }

  return (
    <Stacked adviceCount={chosenCase?.adviceCount}>
      <AdviceList advices={advices} chosenCase={chosenCase} />
      {isStatusNameForReview && (
        <AdviceForm case={chosenCase} refetchAdvices={refetchAdvices} />
      )}
    </Stacked>
  )
}

export default RenderAdvices
