import { createContext, Dispatch, SetStateAction } from 'react'
import { AuthAdminClient } from '../../components/Client/Client.loader'
import { AuthAdminEnvironment } from '@island.is/api/schema'
import { ClientFormTypes } from '../../components/forms/EditApplication/EditApplication.action'
import { PublishData } from '../../components/Client/Client'

export type ClientContextType = {
  client: AuthAdminClient
  selectedEnvironment: AuthAdminClient['environments'][0]
  setSelectedEnvironment: Dispatch<
    SetStateAction<AuthAdminClient['environments'][0]>
  >
  availableEnvironments: AuthAdminEnvironment[] | null
  checkIfInSync: (variables: string[]) => boolean
  variablesToCheckSync?: { [key in ClientFormTypes]: string[] }
  publishData: {
    toEnvironment?: AuthAdminEnvironment | null
    fromEnvironment?: AuthAdminEnvironment | null
  }
  setPublishData: Dispatch<SetStateAction<PublishData>>
}
export const ClientContext = createContext<ClientContextType>({
  client: {} as AuthAdminClient,
  selectedEnvironment: {} as AuthAdminClient['environments'][0],
  setSelectedEnvironment: () => {
    return
  },
  availableEnvironments: null,
  checkIfInSync: (variables) => {
    return false
  },
  variablesToCheckSync: {
    [ClientFormTypes.applicationUrls]: [],
    [ClientFormTypes.lifeTime]: [],
    [ClientFormTypes.translations]: [],
    [ClientFormTypes.delegations]: [],
    [ClientFormTypes.advancedSettings]: [],
    [ClientFormTypes.none]: [],
  },
  publishData: {
    toEnvironment: null,
    fromEnvironment: null,
  },
  setPublishData: () => {
    return
  },
})
