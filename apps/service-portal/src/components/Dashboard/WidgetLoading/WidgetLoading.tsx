import React, { FC } from 'react'
import * as styles from './WidgetLoading.treat'
import FadeIn from '../../library/Animations/FadeIn/FadeIn'

const WidgetLoading: FC<{}> = () => {
  return (
    <FadeIn>
      <div className={styles.wrapper} />
    </FadeIn>
  )
}

export default WidgetLoading
