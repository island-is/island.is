import React, { useContext, useEffect } from 'react'

import { Login } from '@island.is/financial-aid-web/osk/src/components'

const Index = () => {
  useEffect(() => {
    document.title = 'Umsókn um fjárhagsaðstoð'
  }, [])

  return (
    <div className="">
      <Login headline="Skráðu þig inn" />
    </div>
  )
}

export default Index
