import { useFetchEmail } from '../../utils/helpers/api/useFetchEmail'
import {
  useLogIn,
  usePostEmail,
  useUser,
  IsEmailValid,
  useFetchCaseSubscription,
  usePostCaseSubscription,
  useDeleteCaseSubscription,
} from '../../utils/helpers'
import { ReactNode, useEffect, useState } from 'react'
import { SimpleCardSkeleton } from '../Card'
import StackedTitleAndDescription from '../StackedTitleAndDescription/StackedTitleAndDescription'
import {
  Box,
  Text,
  Button,
  LoadingDots,
  toast,
} from '@island.is/island-ui/core'
import CaseEmailActionBox from './CaseEmailActionBox'
import { CaseSubscriptionType } from '../../types/enums'

interface CardSkeletonProps {
  text?: string
  children?: ReactNode
}

const CardSkeleton = ({ text, children }: CardSkeletonProps) => {
  return (
    <SimpleCardSkeleton>
      <StackedTitleAndDescription title="Skrá áskrift">
        {text && <Text>{text}</Text>}
      </StackedTitleAndDescription>
      <Box paddingTop={2}>{children}</Box>
    </SimpleCardSkeleton>
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
        toast.success('Nýtt netfang skráð')
      })
      .catch(() => toast.error('Ekki tókst að skrá inn nýtt netfang'))
  }

  const onPostCaseSubscription = async () => {
    const postCaseSubscriptionCommand = {
      subscriptionType: allChecked ? 'AllChanges' : 'StatusChanges',
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
        toast.success(`Áskrift tókst fyrir mál S-${caseNumber}.`)
      })
      .catch(() =>
        toast.error(`Ekki tókst að skrá áskrift fyrir mál S-${caseNumber}.`),
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
        toast.success(`Afskráning á áskrift fyrir mál S-${caseNumber} tókst.`)
      })
      .catch(() =>
        toast.error(`Ekki tókst á afskrá áskrift fyrir mál S-${caseNumber}`),
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
    const checkBool = caseSubscription?.type === 'AllChanges' ? true : false
    setAllChecked(checkBool)
    setUserClickedChange(true)
  }

  if (!userLoading && !isAuthenticated) {
    return (
      <CardSkeleton text="Þú verður að vera skráð(ur) inn til þess að geta skráð þig í áskrift.">
        <Button fluid iconType="outline" nowrap onClick={LogIn}>
          Skrá mig inn
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
      <CardSkeleton text="Skráðu netfang hérna. Þú færð svo tölvupóst sem þú þarf að staðfesta til að hægt sé að skrá áskrift á það.">
        <CaseEmailActionBox
          input={{
            name: 'userEmailInput',
            label: 'Netfang',
            placeholder: 'nonni@island.is',
            value: inputValue,
            onChange: onChangeEmail,
            isDisabled: postEmailLoading,
          }}
          button={[
            {
              label: 'Skrá netfang',
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
      <CardSkeleton
        text={`Beðið er eftir staðfestingu fyrir netfangið ${userEmail}`}
      >
        <CaseEmailActionBox
          button={[
            {
              label: 'Breyta netfangi',
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
            ? 'Veldu hvernig tilkynningar þú vilt af þessu máli.'
            : 'Þú ert þegar með áskrift af þessu máli. Þú getur valið um að breyta tegund áskriftar eða fjarlægja áskrift.'
        }
      >
        {userClickedChange ? (
          <Box paddingTop={1}>
            <CaseEmailActionBox
              selection={[
                {
                  label: CaseSubscriptionType['AllChanges'],
                  checked: allChecked,
                  onChange: () => setAllChecked(true),
                  isDisabled: postCaseSubscriptionLoading,
                },
                {
                  label: CaseSubscriptionType['StatusChanges'],
                  checked: !allChecked,
                  onChange: () => setAllChecked(false),
                  isDisabled: postCaseSubscriptionLoading,
                },
              ]}
              button={[
                {
                  label: 'Staðfesta breytingu',
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
                label: 'Breyta áskrift',
                onClick: () => handleUserClickedChange(),
                isDisabled: deleteCaseSubscriptionLoading,
              },
              {
                label: 'Fjarlægja áskrift',
                onClick: () => onDeleteCaseSubscription(),
                isLoading: deleteCaseSubscriptionLoading,
              },
            ]}
          />
        )}
      </CardSkeleton>
    ) : (
      <CardSkeleton text="Veldu hvernig tilkynningar þú vilt af þessu máli.">
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
                label: 'Skrá í áskrift',
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
