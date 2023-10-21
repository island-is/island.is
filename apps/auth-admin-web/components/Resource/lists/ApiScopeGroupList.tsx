/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'
import { ResourcesService } from './../../../services/ResourcesService'
import { ApiScopeGroup } from './../../../entities/models/api-scope-group.model'

const ApiScopeGroupList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [apiScopeGroups, setApiScopeGroups] = useState<ApiScopeGroup[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [groupToRemove, setGroupToRemove] = React.useState('')
  const [count, setCount] = useState(0)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [searchString, setSearchString] = useState<string>('')
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('ApiScopeGroupList'),
  )

  const getApiScopeGroups = async (
    searchString: string,
    page: number,
    count: number,
  ): Promise<void> => {
    const response = await ResourcesService.findAllApiScopeGroups(
      searchString,
      page,
      count,
    )
    if (response) {
      const objResponse = response as {
        rows: ApiScopeGroup[]
        count: number
      }

      setApiScopeGroups(objResponse.rows)
      setLastPage(Math.ceil(objResponse.count / count))
    }
  }

  const handlePageChange = async (
    page: number,
    count: number,
  ): Promise<void> => {
    getApiScopeGroups(searchString, page, count)
    setPage(page)
    setCount(count)
  }

  const remove = async (): Promise<void> => {
    const response = await ResourcesService.deleteApiScopeGroup(groupToRemove)
    if (response) {
      getApiScopeGroups(searchString, page, count)
    }
    closeModal()
  }

  const confirmDelete = async (groupId: string): Promise<void> => {
    setGroupToRemove(groupId)
    setIsOpen(true)
  }

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const setHeaderElement = (): JSX.Element => {
    return (
      <p>
        {localization.removeConfirmation}:<span>{groupToRemove}</span>
      </p>
    )
  }

  const search = (event) => {
    getApiScopeGroups(searchString, page, count)
    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchString(event.target.value)
  }

  return (
    <div>
      <div className="api-scope-group-list">
        <div className="api-scope-group-list__wrapper">
          <div className="api-scope-group-list__container">
            <h1>{localization.title}</h1>
            <div className="api-scope-group-list__container__options">
              <div className="api-scope-group-list__container__options__button">
                <Link
                  href={'/admin/api-scope-group'}
                  className="api-scope-group-list__button__new"
                  title={localization.buttons['new'].helpText}
                >
                  <i className="icon__new"></i>
                  {localization.buttons['new'].text}
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="api-scope-group-list__container__options__search">
                  <label
                    htmlFor="search"
                    className="api-scope-group-list__label"
                  >
                    {localization.search?.label}
                  </label>
                  <input
                    id="search"
                    className="api-scope-group-list__input__search"
                    value={searchString}
                    onChange={handleSearchChange}
                  ></input>
                  <button
                    type="submit"
                    className="api-scope-group-list__button__search"
                    title={localization.buttons['search'].helpText}
                  >
                    {localization.buttons['search'].text}
                  </button>
                </div>
              </form>
            </div>
            <div className="api-scope-group-list__container__table">
              <table className="api-scope-group-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['groupId'].headerText}</th>
                    <th>{localization.columns['name'].headerText}</th>
                    <th>{localization.columns['displayName'].headerText}</th>
                    <th>{localization.columns['description'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {apiScopeGroups.map((group: ApiScopeGroup) => {
                    return (
                      <tr key={group.id}>
                        <td>{group.id}</td>
                        <td>{group.name}</td>
                        <td>{group.displayName}</td>
                        <td>{group.description}</td>
                        <td className="api-scope-group-list__table__button">
                          <Link
                            href={`/admin/api-scope-group/${encodeURIComponent(
                              group.id,
                            )}`}
                            legacyBehavior
                          >
                            <button
                              type="button"
                              className="api-scope-group-list__button__edit"
                              title={localization.buttons['edit'].helpText}
                            >
                              <i className="icon__edit"></i>
                              <span>{localization.buttons['edit'].text}</span>
                            </button>
                          </Link>
                        </td>
                        <td className="api-scope-group-list__table__button">
                          <button
                            type="button"
                            className="api-scope-group-list__button__delete"
                            title={localization.buttons['remove'].helpText}
                            onClick={() => confirmDelete(group.id)}
                          >
                            <i className="icon__delete"></i>
                            <span>{localization.buttons['remove'].text}</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div>
              <Paginator
                lastPage={lastPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
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

export default ApiScopeGroupList
