import React from 'react'

import { useI18n } from '../../i18n'

function Home() {
  const { t } = useI18n()
  return <h1>{t('intro.welcome')} HOME</h1>
}

export default Home
