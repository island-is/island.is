import React from 'react'

import { EditClient } from './EditClient'
import { ClientProvider } from './ClientContext'

const Client = () => (
  <ClientProvider>
    <EditClient />
  </ClientProvider>
)

export default Client
