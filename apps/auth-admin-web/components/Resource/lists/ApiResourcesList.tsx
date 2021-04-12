import React from 'react'
import { ApiResourcesDTO } from '../../../entities/dtos/api-resources-dto'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ResourcesService } from '../../../services/ResourcesService'
import { ApiResource } from '../../../entities/models/api-resource.model'
import ConfirmModal from '../../common/ConfirmModal'
import Link from 'next/link'
import Paginator from '../../common/Paginator'
import { downloadCSV } from '../../../utils/csv.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

const ApiResourcesList: React.FC = () => {
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [apiResources, setApiResources] = useState<ApiResource[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [lastPage, setLastPage] = useState(1)
  const router = useRouter()
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [resourceToRemove, setResourceToRemove] = React.useState('')
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('ApiResourcesList'),
  )

  const edit = (apiResource: ApiResourcesDTO) => {
    router.push(
      `/resource/api-resource/${encodeURIComponent(apiResource.name)}`,
    )
  }

  const handlePageChange = async (
    searchString: string,
    page: number,
    countPerPage: number,
  ) => {
    getResources(searchString, page, countPerPage)
    setPage(page)
    setCount(countPerPage)
  }

  const handlePager = async (page: number, count: number) => {
    handlePageChange(searchString, page, count)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value)
  }

  const remove = async () => {
    const response = await ResourcesService.deleteApiResource(resourceToRemove)
    if (response) {
      getResources(searchString, page, count)
    }

    closeModal()
  }

  const getResources = async (
    searchString: string,
    page: number,
    count: number,
  ) => {
    const response = await ResourcesService.findAndCountAllApiResources(
      searchString,
      page,
      count,
    )
    if (response) {
      const resourceArr = response.rows.sort((c1, c2) => {
        if (!c1.archived && !c2.archived) return 0
        if (!c1.archived && c2.archived) return 1
        if (c1.archived && !c2.archived) return -1
        return 0
      })
      setApiResources(resourceArr.reverse())
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const confirmRemove = async (name: string) => {
    setResourceToRemove(name)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const search = (event) => {
    handlePageChange(searchString, page, count)
    event.preventDefault()
  }

  const setHeaderElement = () => {
    return (
      <p>
        {localization.removeConfirmation}:<span>{resourceToRemove}</span>
      </p>
    )
  }

  const exportCsv = async () => {
    const filename = `API Resources, ${
      new Date().toISOString().split('T')[0]
    }.csv`

    await downloadCSV(
      filename,
      ResourcesService.getApiResourcesCsvHeaders(),
      ResourcesService.getApiResourcesCsv,
    )
  }

  return (
    <div>
      <div className="api-resources-list">
        <div className="api-resources-list__wrapper">
          <div className="api-resources-list__container">
            <h1>{localization.title}</h1>
            <div className="api-resources-list__container__options">
              <div className="api-resources-list__container__options__button">
                <Link href={'/resource/api-resource'}>
                  <a className="api-resources-list__button__new">
                    <i className="icon__new"></i>
                    {localization.createNewItem}
                  </a>
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="api-resources-list__container__options__search">
                  <label htmlFor="search" className="api-resources-list__label">
                    {localization.search.label}
                  </label>
                  <input
                    id="search"
                    className="api-resources-list__input__search"
                    value={searchString}
                    onChange={handleSearchChange}
                  ></input>
                  <button
                    type="submit"
                    className="api-resources-list__button__search"
                  >
                    {localization.searchButton}
                  </button>
                </div>
              </form>
            </div>
            <div className="client__container__table">
              <table className="api-resources-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['name'].headerText}</th>
                    <th>{localization.columns['nationalId'].headerText}</th>
                    <th>{localization.columns['contactEmail'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {apiResources.map((resource: ApiResource) => {
                    return (
                      <tr
                        key={resource.name}
                        className={resource.archived ? 'archived' : ''}
                      >
                        <td>{resource.name}</td>
                        <td>{resource.nationalId}</td>
                        <td>{resource.contactEmail}</td>
                        <td className="api-resources-list__table__button">
                          <button
                            type="button"
                            className={`api-resources-list__button__edit${
                              resource.archived ? ' hidden' : ''
                            }`}
                            onClick={() => edit(resource)}
                            title={localization.editButton}
                          >
                            <i className="icon__edit"></i>
                            <span>{localization.editButton}</span>
                          </button>
                        </td>
                        <td className="api-resources-list__table__button">
                          <button
                            type="button"
                            className={`api-resources-list__button__delete${
                              resource.archived ? ' hidden' : ''
                            }`}
                            onClick={() => confirmRemove(resource.name)}
                            title={localization.removeButton}
                          >
                            <i className="icon__delete"></i>
                            <span>{localization.removeButton}</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <div className="api-resources-list__container__export">
                <div className="api-resources-list__container__export__container__button">
                  <button type="button" onClick={() => exportCsv()}>
                    <i className="icon__export__csv" aria-hidden="true"></i>
                    <span>{localization.exportButton}</span>
                  </button>
                </div>
              </div>
              <Paginator lastPage={lastPage} handlePageChange={handlePager} />
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        modalIsOpen={modalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeModal}
        confirmation={remove}
        confirmationText={localization.removeButton}
      ></ConfirmModal>
    </div>
  )
}
export default ApiResourcesList
