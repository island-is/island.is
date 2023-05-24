import React from 'react'

import { EditClient } from '../../components/Client/EditClient'
import { ClientProvider } from '../../components/Client/ClientContext'

const Client = () => (
  <ClientProvider>
    <EditClient />
  </ClientProvider>
)

export default Client
