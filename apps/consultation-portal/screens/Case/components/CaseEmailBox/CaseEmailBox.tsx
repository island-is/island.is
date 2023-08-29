import {
  useLogIn,
  usePostEmail,
  useUser,
  useFetchEmail,
  useFetchCaseSubscription,
  usePostCaseSubscription,
  useDeleteCaseSubscription,
} from '../../../../hooks'
import { isEmailValid } from '../../utils'
import { BaseSyntheticEvent, ReactNode, useEffect, useState } from 'react'
import { CardSkeleton as CardSkeletonComponent } from '../../../../components'
import {
  Text,
  Button,
  LoadingDots,
  toast,
  Stack,
} from '@island.is/island-ui/core'
import { Stacked, CaseEmailActionBox } from '../../components'
import { SubscriptionTypes } from '../../../../types/enums'
import localization from '../../Case.json'

const loc = localization['caseEmailBox']

interface CardSkeletonProps {
  text?: string
  children?: ReactNode
}

const CardSkeleton = ({ text, children }: CardSkeletonProps) => {
  return (
    <CardSkeletonComponent>
      <Stack space={2}>
        <Stacked title={loc.buttonLabel}>{text && <Text>{text}</Text>}</Stacked>
        {children}
      </Stack>
    </CardSkeletonComponent>
  )
}

interface Props {
  caseId: number
  caseNumber: string
}

export const CaseEmailBox = ({ caseId, caseNumber }: Props) => {
  const { isAuthenticated, userLoading } = useUser()
  const [isVerified, setIsVerified] = useState(false)
  const LogIn = useLogIn()
  const [userEmail, setUserEmail] = useState('')
  const [inputValue, setInputValue] = useState('')

  const { postEmailMutation, postEmailLoading } = usePostEmail()
  const { postCaseSubscriptionMutation, postCaseSubscriptionLoading } =
    usePostCaseSubscription()
  const { email, emailVerified, getUserEmailLoading } = useFetchEmail({
    isAuthenticated: isAuthenticated,
  })
  const { deleteCaseSubscriptionMutation, deleteCaseSubscriptionLoading } =
    useDeleteCaseSubscription()

  const { caseSubscription, caseSubscriptionLoading, refetchCaseSubscription } =
    useFetchCaseSubscription({
      isAuthenticated: isAuthenticated,
      caseId: caseId,
    })

  useEffect(() => {
    if (!getUserEmailLoading) {
      setUserEmail(email)
      setIsVerified(emailVerified)
    }
  }, [getUserEmailLoading])

  const onSetEmail = async () => {
    const nextEmail = inputValue
    await postEmailMutation({
      variables: {
        input: { email: nextEmail },
      },
    })
      .then(() => {
        setInputValue('')
        setUserEmail(nextEmail)
        toast.success(loc.postEmailMutationToasts.success)
      })
      .catch(() => toast.error(loc.postEmailMutationToasts.failure))
  }

  const onPostCaseSubscription = async () => {
    const postCaseSubscriptionCommand = {
      subscriptionType: SubscriptionTypes.AllChanges,
    }

    await postCaseSubscriptionMutation({
      variables: {
        input: {
          caseId: caseId,
          postCaseSubscriptionCommand: postCaseSubscriptionCommand,
        },
      },
    })
      .then(() => {
        refetchCaseSubscription()
        toast.success(
          `${loc.postSubscriptionMutationToasts.success} S-${caseNumber}.`,
        )
      })
      .catch(() =>
        toast.error(
          `${loc.postSubscriptionMutationToasts.failure} S-${caseNumber}.`,
        ),
      )
  }

  const onDeleteCaseSubscription = async () => {
    await deleteCaseSubscriptionMutation({
      variables: {
        input: {
          caseId: caseId,
        },
      },
    })
      .then(() => {
        refetchCaseSubscription()
        toast.success(
          `${loc.deleteCaseSubscriptionMutation.successBegin} S-${caseNumber} ${loc.deleteCaseSubscriptionMutation.successEnd}`,
        )
      })
      .catch(() =>
        toast.error(
          `${loc.deleteCaseSubscriptionMutation.failure} S-${caseNumber}`,
        ),
      )
  }

  const onChangeEmail = (e: BaseSyntheticEvent) => {
    const nextInputVal = e.target.value
    setInputValue(nextInputVal)
  }

  const resetEmail = () => {
    const emptyString = ''
    setInputValue(emptyString)
    setUserEmail(emptyString)
    setIsVerified(false)
  }

  if (!userLoading && !isAuthenticated) {
    return (
      <CardSkeleton text={loc.loginCardSkeleton.text}>
        <Button fluid iconType="outline" nowrap onClick={LogIn}>
          {loc.loginCardSkeleton.button}
        </Button>
      </CardSkeleton>
    )
  }

  if (getUserEmailLoading || userLoading) {
    return (
      <CardSkeleton>
        <LoadingDots />
      </CardSkeleton>
    )
  }

  if (!userEmail) {
    return (
      <CardSkeleton text={loc.setEmailCardSkeleton.text}>
        <CaseEmailActionBox
          input={{
            name: 'userEmailInput',
            label: loc.setEmailCardSkeleton.input.label,
            placeholder: loc.setEmailCardSkeleton.input.placeholder,
            value: inputValue,
            onChange: onChangeEmail,
            isDisabled: postEmailLoading,
          }}
          button={{
            label: loc.setEmailCardSkeleton.button,
            onClick: onSetEmail,
            isDisabled: !isEmailValid(inputValue),
            isLoading: postEmailLoading,
          }}
        />
      </CardSkeleton>
    )
  }

  if (!isVerified) {
    return (
      <CardSkeleton text={`${loc.notVerifiedCardSkeleton.text} ${userEmail}`}>
        <CaseEmailActionBox
          button={{
            label: loc.notVerifiedCardSkeleton.button,
            onClick: resetEmail,
          }}
        />
      </CardSkeleton>
    )
  }

  return caseSubscription?.type ? (
    <CardSkeleton text={loc.subbedCardSkeleton.initial.text}>
      <CaseEmailActionBox
        button={{
          label: loc.subbedCardSkeleton.initial.buttonRemove,
          onClick: () => onDeleteCaseSubscription(),
          isLoading: deleteCaseSubscriptionLoading || caseSubscriptionLoading,
        }}
      />
    </CardSkeleton>
  ) : (
    <CardSkeleton text={loc.notSubbedCardSkeleton.text}>
      <CaseEmailActionBox
        button={{
          label: loc.notSubbedCardSkeleton.button,
          onClick: () => onPostCaseSubscription(),
          isLoading: postCaseSubscriptionLoading || caseSubscriptionLoading,
        }}
      />
    </CardSkeleton>
  )
}

export default CaseEmailBox
