import {
  useLogIn,
  usePostEmail,
  useUser,
  useFetchEmail,
  useFetchCaseSubscription,
  usePostCaseSubscription,
  useDeleteCaseSubscription,
} from '../../../../hooks'
import { IsEmailValid } from '../../../../utils/helpers'
import { ReactNode, useEffect, useState } from 'react'
import { CardSkeleton as CardSkeletonComponent } from '../../../../components'
import {
  Box,
  Text,
  Button,
  LoadingDots,
  toast,
} from '@island.is/island-ui/core'
import { Stacked, CaseEmailActionBox } from '../../components'
import {
  CaseSubscriptionType,
  SubscriptionType,
  SubscriptionTypes,
} from '../../../../types/enums'
import localization from '../../Case.json'

interface CardSkeletonProps {
  text?: string
  children?: ReactNode
}

const CardSkeleton = ({ text, children }: CardSkeletonProps) => {
  return (
    <CardSkeletonComponent>
      <Stacked title="Skrá áskrift">{text && <Text>{text}</Text>}</Stacked>
      <Box paddingTop={2}>{children}</Box>
    </CardSkeletonComponent>
  )
}

interface Props {
  caseId: number
  caseNumber: string
}

export const CaseEmailBox = ({ caseId, caseNumber }: Props) => {
  const loc = localization['caseEmailBox']
  const { isAuthenticated, userLoading } = useUser()
  const [isVerified, setIsVerified] = useState(false)
  const LogIn = useLogIn()
  const [userEmail, setUserEmail] = useState<string>('')
  const [inputValue, setInputValue] = useState('')
  const [allChecked, setAllChecked] = useState(true)
  const [userClickedChange, setUserClickedChange] = useState(false)

  const { postEmailMutation, postEmailLoading } = usePostEmail()
  const {
    postCaseSubscriptionMutation,
    postCaseSubscriptionLoading,
  } = usePostCaseSubscription()
  const { email, emailVerified, getUserEmailLoading } = useFetchEmail({
    isAuthenticated: isAuthenticated,
  })
  const {
    deleteCaseSubscriptionMutation,
    deleteCaseSubscriptionLoading,
  } = useDeleteCaseSubscription()

  const {
    caseSubscription,
    caseSubscriptionLoading,
    refetchCaseSubscription,
  } = useFetchCaseSubscription({
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
      subscriptionType: allChecked
        ? SubscriptionType.AllChanges
        : SubscriptionType.StatusChanges,
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
        setUserClickedChange(false)
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

  const onChangeEmail = (e) => {
    const nextInputVal = e.target.value
    setInputValue(nextInputVal)
  }

  const resetEmail = () => {
    const emptyString = ''
    setInputValue(emptyString)
    setUserEmail(emptyString)
    setIsVerified(false)
  }

  const handleUserClickedChange = () => {
    const checkBool =
      caseSubscription?.type === SubscriptionType.AllChanges ? true : false
    setAllChecked(checkBool)
    setUserClickedChange(true)
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
          button={[
            {
              label: loc.setEmailCardSkeleton.button,
              onClick: onSetEmail,
              isDisabled: !IsEmailValid(inputValue),
              isLoading: postEmailLoading,
            },
          ]}
        />
      </CardSkeleton>
    )
  }

  if (!isVerified) {
    return (
      <CardSkeleton text={`${loc.notVerifiedCardSkeleton.text} ${userEmail}`}>
        <CaseEmailActionBox
          button={[
            {
              label: loc.notVerifiedCardSkeleton.button,
              onClick: resetEmail,
            },
          ]}
        />
      </CardSkeleton>
    )
  }

  {
    return caseSubscription?.type ? (
      <CardSkeleton
        text={
          userClickedChange
            ? loc.subbedCardSkeleton.clickedChange.text
            : loc.subbedCardSkeleton.initial.text
        }
      >
        {userClickedChange ? (
          <Box paddingTop={1}>
            <CaseEmailActionBox
              selection={[
                {
                  label: CaseSubscriptionType[SubscriptionTypes.AllChanges],
                  checked: allChecked,
                  onChange: () => setAllChecked(true),
                  isDisabled: postCaseSubscriptionLoading,
                },
                {
                  label: CaseSubscriptionType[SubscriptionTypes.StatusChanges],
                  checked: !allChecked,
                  onChange: () => setAllChecked(false),
                  isDisabled: postCaseSubscriptionLoading,
                },
              ]}
              button={[
                {
                  label: loc.subbedCardSkeleton.clickedChange.button,
                  onClick: () => onPostCaseSubscription(),
                  isLoading: postCaseSubscriptionLoading,
                },
              ]}
            />
          </Box>
        ) : (
          <CaseEmailActionBox
            button={[
              {
                label: loc.subbedCardSkeleton.initial.buttonChange,
                onClick: () => handleUserClickedChange(),
                isDisabled: deleteCaseSubscriptionLoading,
              },
              {
                label: loc.subbedCardSkeleton.initial.buttonRemove,
                onClick: () => onDeleteCaseSubscription(),
                isLoading: deleteCaseSubscriptionLoading,
              },
            ]}
          />
        )}
      </CardSkeleton>
    ) : (
      <CardSkeleton text={loc.notSubbedCardSkeleton.text}>
        <Box paddingTop={1}>
          <CaseEmailActionBox
            selection={[
              {
                label: CaseSubscriptionType['AllChanges'],
                checked: allChecked,
                onChange: () => setAllChecked(true),
                isDisabled: caseSubscriptionLoading,
              },
              {
                label: CaseSubscriptionType['StatusChanges'],
                checked: !allChecked,
                onChange: () => setAllChecked(false),
                isDisabled: caseSubscriptionLoading,
              },
            ]}
            button={[
              {
                label: loc.notSubbedCardSkeleton.button,
                onClick: () => onPostCaseSubscription(),
                isLoading: caseSubscriptionLoading,
              },
            ]}
          />
        </Box>
      </CardSkeleton>
    )
  }
}

export default CaseEmailBox
