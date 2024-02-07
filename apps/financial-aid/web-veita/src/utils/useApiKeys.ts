import { useMutation } from '@apollo/client'
import {
  ApiKeyForMunicipalityMutation,
  UpdateApiKeyForMunicipalityMutation,
} from '@island.is/financial-aid-web/veita/graphql/sharedGql'
import { ApiKeysForMunicipality } from '@island.is/financial-aid/shared/lib'
import { toast } from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { AdminContext } from '../components/AdminProvider/AdminProvider'

const useApiKeys = (
  setCurrentState: (ApiKeyInfo: ApiKeysForMunicipality) => void,
) => {
  const [isModalVisable, setIsModalVisable] = useState(false)

  const [createApiKey] = useMutation(ApiKeyForMunicipalityMutation)
  const [updateApiKeyMutation] = useMutation(
    UpdateApiKeyForMunicipalityMutation,
  )

  const { municipality, setMunicipality } = useContext(AdminContext)

  const addNewApiKeyToMunicipality = (
    newApiKeyInfo: ApiKeysForMunicipality,
    toastMessage: string,
  ) => {
    if (newApiKeyInfo && setMunicipality) {
      const updatedMunicipality = municipality.map((muni) => ({
        ...muni,
        apiKeyInfo:
          muni.municipalityId === newApiKeyInfo.municipalityCode
            ? newApiKeyInfo
            : muni.apiKeyInfo,
      }))
      setMunicipality(updatedMunicipality)
      setCurrentState(newApiKeyInfo)
      setIsModalVisable(false)
      toast.success(toastMessage)
    }
  }

  const createApiKeyForMunicipality = async (
    name: string,
    key: string,
    municipalityCode: string,
  ) => {
    await createApiKey({
      variables: {
        input: {
          name: name,
          municipalityCode: municipalityCode,
          apiKey: key,
        },
      },
    })
      .then((res) => {
        if (res.data?.createApiKey) {
          addNewApiKeyToMunicipality(
            res.data?.createApiKey,
            'Api lykill hefur búinn til',
          )
        }
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að búa til api lykil, vinsamlega reynið aftur síðar',
        )
      })
  }

  const updateApiKeyForMunicipality = async (id: string, name: string) => {
    await updateApiKeyMutation({
      variables: {
        input: {
          id: id,
          name: name,
        },
      },
    })
      .then((res) => {
        if (res.data?.updateApiKey) {
          addNewApiKeyToMunicipality(
            res.data?.updateApiKey,
            'Api lykill hefur verið uppfærður',
          )
        }
      })
      .catch(() => {
        toast.error(
          'Ekki tókst að uppfæra nafn á lyklinum, vinsamlega reynið aftur síðar',
        )
      })
  }

  return {
    isModalVisable,
    setIsModalVisable,
    createApiKeyForMunicipality,
    updateApiKeyForMunicipality,
  }
}

export default useApiKeys
