import React from 'react'
import PersonalInformation from '../components/forms/personal-information'
import Test from '../components/test'

import styles from './index.module.scss'

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
    <div className={styles.page}>
      {/* <PersonalInformation></PersonalInformation> */}
      <Test></Test>
      </div>
  )
}

export default Index
