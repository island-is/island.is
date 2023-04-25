import { useFetchEmail } from '../../utils/helpers/api/useFetchEmail'
import {
  useLogIn,
  usePostEmail,
  useUser,
  IsEmailValid,
} from '../../utils/helpers'
import { ReactNode, useEffect, useState } from 'react'
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

interface CardSkeletonProps {
  text?: string
  children?: ReactNode
}

export const CaseEmailBox = () => {
  const { isAuthenticated, userLoading } = useUser()
  const [isVerified, setIsVerified] = useState(false)
  const LogIn = useLogIn()
  const [userEmail, setUserEmail] = useState<string>('')
  const [inputVal, setInputVal] = useState<string>('')

  const { postEmailMutation, postEmailLoading } = usePostEmail()
  const { email, emailVerified, getUserEmailLoading } = useFetchEmail({
    isAuthenticated: isAuthenticated,
  })

  const onSetEmail = async () => {
    const nextEmail = inputVal
    await postEmailMutation({
      variables: {
        input: nextEmail,
      },
    })
      .then(() => {
        setInputVal('')
        setUserEmail(nextEmail)
        toast.success('Nýtt netfang skráð')
      })
      .catch(() => toast.error('Ekki tókst að skrá inn nýtt netfang'))
  }

  useEffect(() => {
    if (!getUserEmailLoading) {
      setUserEmail(email)
      setIsVerified(emailVerified)
    }
  }, [getUserEmailLoading])

  const onChangeEmail = (e) => {
    const nextInputVal = e.target.value
    setInputVal(nextInputVal)
  }

  const CardSkeleton = ({ text, children }: CardSkeletonProps) => {
    return (
      <SimpleCardSkeleton>
        <StackedTitleAndDescription headingColor="dark400" title="Skrá áskrift">
          {text && <Text>{text}</Text>}
        </StackedTitleAndDescription>
        {children}
      </SimpleCardSkeleton>
    )
  }

  if (!isAuthenticated) {
    return (
      <CardSkeleton text="Þú verður að vera skráð(ur) inn til þess að geta skráð þig í áskrift.">
        <Box paddingTop={2}>
          <Button fluid iconType="outline" nowrap onClick={LogIn}>
            Skrá mig inn
          </Button>
        </Box>
      </CardSkeleton>
    )
  }

  if (getUserEmailLoading || userLoading) {
    return (
      <CardSkeleton>
        <Box paddingTop={2}>
          <LoadingDots />
        </Box>
      </CardSkeleton>
    )
  }

  if (userEmail) {
    return (
      <CardSkeleton text="Skráðu netfang hérna. Þú færð svo tölvupóst sem þú þarf að staðfesta til að hægt sé að skrá áskrift á það.">
        <Box paddingTop={2}>
          <Stack space={2}>
            <Input
              name="userEmailInput"
              size="sm"
              label="Netfang"
              placeholder="nonni@island.is"
              value={inputVal}
              onChange={(e) => onChangeEmail(e)}
            />
            <Button
              fluid
              iconType="outline"
              nowrap
              onClick={onSetEmail}
              disabled={!IsEmailValid(inputVal)}
            >Skrá netfang</Button>
          </Stack>
        </Box>
      </CardSkeleton>
    )
  }

  return isVerified ? (
    <CardSkeleton text={`Núverandi skráð netfang: ${userEmail}`}>
      <Box paddingTop={2}></Box>
    </CardSkeleton>
  ) : (
    <></>
  )
}

export default CaseEmailBox
