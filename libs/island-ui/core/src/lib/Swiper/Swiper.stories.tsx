import React from 'react'
import Swiper from './Swiper'
import Alert from '../Alert/Alert'

export default {
  title: 'Components/Swiper',
  component: Swiper,
}

export const Default = () => (
  <Swiper>
    <Alert
      type="info"
      title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
    />
    <Alert
      type="info"
      title="Vissir þú að þú getur gert eitthvað sniðugt og þetta eru lengri skilaboð?"
      message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus pellentesque amet, id tortor urna faucibus augue sit. Fames dignissim condimentum nibh ut in."
    />
  </Swiper>
)
