import { useFetchEmail } from '../../utils/helpers/api/useFetchEmail'
import {
  useLogIn,
  usePostEmail,
  useUser,
  IsEmailValid,
} from '../../utils/helpers'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { SimpleCardSkeleton, SubscriptionActionCard } from '../Card'
import StackedTitleAndDescription from '../StackedTitleAndDescription/StackedTitleAndDescription'
import {
  Box,
  Text,
  Button,
  LoadingDots,
  Stack,
  Input,
  toast,
} from '@island.is/island-ui/core'
import CaseEmailActionBox from './CaseEmailActionBox'

interface CardSkeletonProps {
  text?: string
  children?: ReactNode
}

export const CaseEmailBox = () => {
  console.log('re-rendering')
  const { isAuthenticated, userLoading } = useUser()
  const [isVerified, setIsVerified] = useState(false)
  const LogIn = useLogIn()
  const [userEmail, setUserEmail] = useState<string>('')
  const inputEmailRef = useRef<HTMLInputElement>()

  const { postEmailMutation, postEmailLoading } = usePostEmail()
  const { email, emailVerified, getUserEmailLoading } = useFetchEmail({
    isAuthenticated: isAuthenticated,
  })

  const onSetEmail = async () => {
    
    console.log('nextEmail', inputEmailRef)
    //   await postEmailMutation({
    //     variables: {
    //       input: nextEmail,
    //     },
    //   })
    //     .then(() => {
    //       setInputVal('')
    //       setUserEmail(nextEmail)
    //       toast.success('Nýtt netfang skráð')
    //     })
    //     .catch(() => toast.error('Ekki tókst að skrá inn nýtt netfang'))
  }

  // useEffect(() => {
  //   if (!getUserEmailLoading) {
  //     setUserEmail(email)
  //     setIsVerified(emailVerified)
  //   }
  // }, [getUserEmailLoading])

  // const onChangeEmail = (e) => {
  //   const nextInputVal = e.target.value
  //   setInputVal(nextInputVal)
  // }

  const CardSkeleton = ({ text, children }: CardSkeletonProps) => {
    return (
      <SimpleCardSkeleton>
        <StackedTitleAndDescription headingColor="dark400" title="Skrá áskrift">
          {text && <Text>{text}</Text>}
        </StackedTitleAndDescription>
        <Box paddingTop={2}>{children}</Box>
      </SimpleCardSkeleton>
    )
  }

  if (!isAuthenticated) {
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
          ref={inputEmailRef}
          button={[
            {
              label: 'Skrá netfang',
              onClick: onSetEmail,
              // disabled: !IsEmailValid(inputEmailRef.current.value.toString()),
            },
          ]}
        />
      </CardSkeleton>
    )
  }

  return isVerified ? (
    <CardSkeleton text={`Núverandi skráð netfang: ${userEmail}`}>
      <></>
    </CardSkeleton>
  ) : (
    <></>
  )
}

export default CaseEmailBox
