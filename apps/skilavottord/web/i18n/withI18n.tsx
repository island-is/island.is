import React, { ComponentType } from 'react'

import { useI18n } from '.'

const withI18n = <P extends object>(Component: ComponentType<P>) => {
  return (props: P) => {
    const { t } = useI18n()

    return <Component t={t} {...props} />
  }
}

export default withI18n
