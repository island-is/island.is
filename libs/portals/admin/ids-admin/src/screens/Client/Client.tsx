import React from 'react'

import { EditClient } from './EditClient'
import { ClientProvider } from './ClientContext'
import { PublishClient } from './PublishClient/PublishClient'

const Client = () => (
  <ClientProvider>
    <EditClient />
    <PublishClient />
  </ClientProvider>
)

export default Client
