import SubscriptionActionCard from '../Card/SubscriptionActionCard'
import { useQuery } from '@apollo/client'
import initApollo from '@island.is/consultation-portal/graphql/client'
import { GET_EMAIL } from '@island.is/consultation-portal/screens/Subscriptions/queries.graphql'
import { useLogIn, useUser } from '@island.is/consultation-portal/utils/helpers'
import { useState } from 'react'

export const EmailBox = () => {
  const { isAuthenticated, user } = useUser()
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const LogIn = useLogIn()

  const client = initApollo()

  const { data: datame } = useQuery(GET_EMAIL, {
    client: client,
    ssr: true,
    fetchPolicy: 'cache-first',
    variables: {},
  })

  const email = 'email@email.is'

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

  return isVerified ? (
    <SubscriptionActionCard
      heading="Skrá netfang"
      text="Skráðu netfang hérna. Þú færð svo tölvupóst sem þú þarft að staðfesta til að hægt sé að skrá áskrift á það."
      button={[
        {
          label: 'Skrá netfang',
          onClick: () => console.log('Skrá'),
        },
      ]}
      input={{
        name: 'subscriptionEmail',
        label: 'Netfang',
        placeholder: 'Hér skal skrifa netfang',
      }}
    />
  ) : (
    <SubscriptionActionCard
      text={`Skráð netfang: ${email}`}
      button={[
        {
          label: 'Breyta netfangi',
          onClick: () => console.log('Breyta'),
        },
        {
          label: 'Sjá áskriftir',
          onClick: () => console.log('Breyta'),
        },
      ]}
    />
  )
}
export default EmailBox
