import React from 'react'

import { Swiper } from './Swiper'
import { AlertMessage } from '../AlertMessage/AlertMessage'

export default {
  title: 'Components/Swiper',
  component: Swiper,
}

export const Default = () => (
  <Swiper>
    <AlertMessage
      type="info"
      title="This a mobile swiper"
      message="It uses the scroll-snap spec to smoothly transition from one item to the next based on the users' swipe"
    />
    <AlertMessage
      type="info"
      title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
    />
  </Swiper>
)
