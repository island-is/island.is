import SubscriptionActionCard from '../Card/SubscriptionActionCard'
import { useMutation } from '@apollo/client'
import initApollo from '../../graphql/client'
import { SUB_POST_EMAIL } from '../../graphql/queries.graphql'
import { useLogIn, useUser } from '../../utils/helpers'
import { useEffect, useState } from 'react'
import { useFetchEmail } from '../../utils/helpers/api/useFetchEmail'
import { LoadingDots } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

const emailIsValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const EmailBox = () => {
  const { isAuthenticated } = useUser()
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const LogIn = useLogIn()
  const [userEmail, setUserEmail] = useState('')
  const [inputVal, setInputVal] = useState('')

  const client = initApollo()
  const [postEmailMutation, { loading: postEmailLoading }] = useMutation(
    SUB_POST_EMAIL,
    {
      client: client,
    },
  )
  const router = useRouter()
  const { email, emailVerified, getUserEmailLoading } = useFetchEmail()
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

  const onSetEmail = async () => {
    const nextEmail = inputVal
    const post = await postEmailMutation({
      variables: {
        input: { email: nextEmail },
      },
    })
    setUserEmail(nextEmail)
  }

  const resetEmail = () => {
    const nextInputVal = ''
    setInputVal(nextInputVal)
    setUserEmail(nextInputVal)
    setIsVerified(false)
  }

  if (getUserEmailLoading) {
    return <LoadingDots></LoadingDots>
  }
  if (!isAuthenticated) {
    return (
      <SubscriptionActionCard
        heading="Skrá áskrift"
        text="Þú verður að vera skráð(ur) inn til þess að geta skráð þig í áskrift."
        button={[
          {
            label: 'Skrá mig inn',
            onClick: LogIn,
          },
        ]}
      />
    )
  }

  if (!userEmail) {
    return (
      <SubscriptionActionCard
        heading="Skrá netfang"
        text="Skráðu netfang hérna. Þú færð svo tölvupóst sem þú þarf að staðfesta til að hægt sé að skrá áskrift á það."
        input={{
          name: 'subscriptionEmail',
          label: 'Netfang',
          placeholder: 'nonni@island.is',
          value: inputVal,
          onChange: onChangeEmail,
        }}
        button={[
          {
            label: 'Skrá netfang',
            onClick: onSetEmail,
            disabled: !emailIsValid(inputVal),
          },
        ]}
      />
    )
  }

  return isVerified ? (
    <SubscriptionActionCard
      text={`Núverandi skráð netfang: ${userEmail}`}
      button={[
        {
          label: 'Breyta netfangi',
          onClick: resetEmail,
        },
        {
          label: 'Sjá áskriftir',
          onClick: () => router.push('/minaraskriftir'),
        },
      ]}
    />
  ) : (
    <SubscriptionActionCard
      text={`Beðið er eftir staðfestingu fyrir netfangið ${userEmail}`}
      button={[
        {
          label: 'Breyta netfangi',
          onClick: resetEmail,
        },
      ]}
    />
  )
}
export default EmailBox
