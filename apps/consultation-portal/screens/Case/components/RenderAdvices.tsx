import { WriteReviewCard } from '../../../components'
import Advices from '../../../components/Advices/Advices'
import { SimpleCardSkeleton } from '../../../components/Card'
import { UserContext } from '../../../context'
import { CaseStatusFilterOptions } from '../../../types/enums'
import { Case, UserAdvice } from '../../../types/interfaces'
import { SkeletonLoader, Stack, Text } from '@island.is/island-ui/core'
import { ReactNode, useContext } from 'react'

interface Props {
  advices: Array<UserAdvice>
  chosenCase: Case
  refetchAdvices: any
  advicesLoading: boolean
}

interface StackedChildrenProps {
  children: ReactNode
}

interface TitleTextProps {
  adviceCount?: number
}

const StackedChildren = ({ children }: StackedChildrenProps) => {
  return <Stack space={3}>{children}</Stack>
}

const TitleText = ({ adviceCount }: TitleTextProps) => {
  const text = adviceCount && ` (${adviceCount})`
  return (
    <Text variant="h1" color="blue400">
      Innsendar umsagnir{text}
    </Text>
  )
}

const CardSkeletonLoader = () => {
  return (
    <SimpleCardSkeleton>
      <SkeletonLoader repeat={4} space={1} />
    </SimpleCardSkeleton>
  )
}

export const RenderAdvices = ({
  advices,
  chosenCase,
  refetchAdvices,
  advicesLoading,
}: Props) => {
  const { isAuthenticated, user } = useContext(UserContext)

  if (advicesLoading) {
    return (
      <StackedChildren>
        <TitleText />
        <CardSkeletonLoader />
      </StackedChildren>
    )
  }

  if (!advicesLoading && advices?.length === 0) {
    return (
      <StackedChildren>
        <TitleText />
        <Text>Engar umsagnir fundust fyrir þetta mál.</Text>
      </StackedChildren>
    )
  }

  return (
    <StackedChildren>
      <TitleText adviceCount={chosenCase?.adviceCount} />
      <Advices
        advices={advices}
        publishType={chosenCase?.advicePublishTypeId}
        processEndDate={chosenCase?.processEnds}
      />
      {chosenCase?.statusName === CaseStatusFilterOptions.forReview && (
        <WriteReviewCard
          card={chosenCase}
          isLoggedIn={isAuthenticated}
          username={user?.name}
          caseId={chosenCase?.id}
          refetchAdvices={refetchAdvices}
        />
      )}
    </StackedChildren>
  )
}
