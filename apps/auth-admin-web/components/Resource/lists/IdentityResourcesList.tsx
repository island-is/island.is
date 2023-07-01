import React, { useState } from 'react'
import IdentityResourceDTO from '../../../entities/dtos/identity-resource.dto'
import { useRouter } from 'next/router'
import ResourceListDisplay from './ResourceListDisplay'
import { ResourcesService } from '../../../services/ResourcesService'
import ConfirmModal from '../../common/ConfirmModal'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

const IdentityResourcesList: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [resources, setResources] = useState<IdentityResourceDTO[]>([])
  const [lastPage, setLastPage] = useState(1)
  const router = useRouter()
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [resourceToRemove, setResourceToRemove] = React.useState('')
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('IdentityResourcesList'),
  )
  const edit = (resource: IdentityResourceDTO) => {
    router.push(
      `/resource/identity-resource/${encodeURIComponent(resource.name)}`,
    )
  }

  const getResources = async (page: number, count: number) => {
    const response = await ResourcesService.findAndCountAllIdentityResources(
      page,
      count,
    )
    if (response) {
      setResources(response.rows)
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const handlePageChange = async (page: number, countPerPage: number) => {
    getResources(page, countPerPage)
    setPage(page)
    setCount(countPerPage)
  }

  const remove = async () => {
    const response = await ResourcesService.deleteIdentityResource(
      resourceToRemove,
    )
    if (response) {
      getResources(page, count)
    }

    closeModal()
  }

  const confirmRemove = async (name: string) => {
    setResourceToRemove(name)
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const setHeaderElement = () => {
    return (
      <p>
        {localization.removeConfirmation}
        <span>{resourceToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <ResourceListDisplay
        list={resources}
        header={localization.title}
        linkHeader={localization.buttons['new'].text}
        linkHeaderHelp={localization.buttons['new'].helpText}
        createUri={'/resource/identity-resource'}
        lastPage={lastPage}
        handlePageChange={handlePageChange}
        edit={edit}
        remove={confirmRemove}
      ></ResourceListDisplay>
      <ConfirmModal
        modalIsOpen={modalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeModal}
        confirmation={remove}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}
export default IdentityResourcesList
