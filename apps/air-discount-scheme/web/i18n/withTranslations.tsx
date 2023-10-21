import React, { ComponentType } from 'react'

import useTranslations from './useTranslations'

const withTranslations = <P extends object>(
  Component: ComponentType<React.PropsWithChildren<P>>,
) => {
  return (props: P) => {
    const { t } = useTranslations()

    return <Component t={t} {...props} />
  }
}

export default withTranslations
