import SubscriptionActionCard from '../Card/SubscriptionActionCard'
import { useQuery } from '@apollo/client'
import initApollo from '../../graphql/client'
import { SUB_GET_EMAIL } from '../../graphql/queries.graphql'
import { useLogIn, useUser } from '../../utils/helpers'
import { useState } from 'react'
import { useRouter } from 'next/router'

const emailIsValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const EmailBox = () => {
  const { isAuthenticated, user } = useUser()
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const LogIn = useLogIn()
  const [email, setEmail] = useState('')
  const [inputVal, setInputVal] = useState('')

  const client = initApollo()

  const { data: datame } = useQuery(SUB_GET_EMAIL, {
    client: client,
    ssr: true,
    fetchPolicy: 'cache-first',
    variables: {},
  })
  const router = useRouter()
  const onChangeEmail = (e) => {
    const nextInputVal = e.target.value
    setInputVal(nextInputVal)
  }

  const onSetEmail = () => {
    const nextEmail = inputVal
    setEmail(nextEmail)
  }

  const resetEmail = () => {
    const nextInputVal = ''
    setInputVal(nextInputVal)
    setEmail(nextInputVal)
  }

  const verifyEmail = () => {
    setIsVerified(true)
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

  if (!email) {
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
      text={`Núverandi skráð netfang: ${email}`}
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
      text={`Beðið er eftir staðfestingu fyrir netfangið ${email}`}
      button={[
        {
          label: 'Breyta netfangi',
          onClick: resetEmail,
        },
        {
          label: 'Staðfesta',
          onClick: verifyEmail,
        },
      ]}
    />
  )
}
export default EmailBox
