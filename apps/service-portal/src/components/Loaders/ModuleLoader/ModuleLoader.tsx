import React, { FC } from 'react'
import * as styles from './ModuleLoader.treat'
import FadeIn from '../../library/Animations/FadeIn/FadeIn'

const ModuleLoader: FC<{}> = () => {
  return (
    <FadeIn>
      <div className={styles.wrapper} />
    </FadeIn>
  )
}

export default ModuleLoader
