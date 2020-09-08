import React, { ComponentType } from 'react'

import { useTranslations } from '.'

const withTranslations = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => {
    const { t } = useTranslations()

    return <Component t={t} {...props} />
  }
}

export default withTranslations
