/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { AccessService } from '../../../services/AccessService'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'
import { ApiScopeUser } from '../../../entities/models/api-scope-user.model'

const ApiScopeUsersList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [adminAccess, setAdminAccess] = useState<ApiScopeUser[]>([])
  const [page, setPage] = useState(1)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [count, setCount] = useState(0)
  const [searchString, setSearchString] = useState<string>('')
  const [lastPage, setLastPage] = useState(1)
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('ApiScopeUsersList'),
  )
  const [accessToRemove, setAccessToRemove] = useState('')

  const getAdmins = async (
    searchString: string,
    page: number,
    count: number,
  ): Promise<void> => {
    const response = await AccessService.findAndCountAll(
      searchString,
      page,
      count,
    )
    if (response) {
      setAdminAccess(response.rows)
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const handlePageChange = async (
    page: number,
    count: number,
  ): Promise<void> => {
    getAdmins(searchString, page, count)
    setPage(page)
    setCount(count)
  }

  const deleteUser = async (): Promise<void> => {
    const response = await AccessService.delete(accessToRemove)
    if (response) {
      getAdmins(searchString, page, count)
    }
    closeModal()
  }

  const confirmDelete = async (nationalId: string): Promise<void> => {
    setAccessToRemove(nationalId)
    setIsOpen(true)
  }

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const setHeaderElement = (): JSX.Element => {
    return (
      <p>
        {localization.removeConfirmation}
        <span>{accessToRemove}</span>
      </p>
    )
  }

  const search = (event) => {
    getAdmins(searchString, page, count)
    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchString(event.target.value)
  }

  return (
    <div>
      <div className="api-scope-users-list">
        <div className="api-scope-users-list__wrapper">
          <div className="api-scope-users-list__container">
            <h1>{localization.title}</h1>
            <div className="api-scope-users-list__container__options">
              <div className="api-scope-users-list__container__options__button">
                <Link
                  href={'/admin/api-scope-user'}
                  className="api-scope-users-list__button__new"
                  title={localization.buttons['new'].helpText}
                >
                  <i className="icon__new"></i>
                  {localization.buttons['new'].text}
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="api-scope-users-list__container__options__search">
                  <input
                    id="search"
                    className="api-scope-users-list__input__search"
                    placeholder={localization.buttons['search'].helpText}
                    value={searchString}
                    onChange={handleSearchChange}
                  />
                  <button
                    type="submit"
                    className="api-scope-users-list__button__search"
                    title={localization.buttons['search'].helpText}
                  >
                    {localization.buttons['search'].text}
                  </button>
                </div>
              </form>
            </div>
            <div className="api-scope-users-list__container__table">
              <table className="api-scope-users-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['name'].headerText}</th>
                    <th>{localization.columns['nationalId'].headerText}</th>
                    <th>{localization.columns['email'].headerText}</th>
                    <th colSpan={2} />
                  </tr>
                </thead>
                <tbody>
                  {adminAccess.map((apiScopeUser: ApiScopeUser) => {
                    return (
                      <tr key={apiScopeUser.nationalId}>
                        <td>{apiScopeUser.name}</td>
                        <td>{apiScopeUser.nationalId}</td>
                        <td>{apiScopeUser.email}</td>
                        <td className="api-scope-users-list__table__button">
                          <Link
                            href={`/admin/api-scope-user/${encodeURIComponent(
                              apiScopeUser.nationalId,
                            )}`}
                            legacyBehavior
                          >
                            <button
                              type="button"
                              className={`api-scope-users-list__button__edit`}
                              title={localization.buttons['edit'].helpText}
                            >
                              <i className="icon__edit"></i>
                              <span>{localization.buttons['edit'].text}</span>
                            </button>
                          </Link>
                        </td>
                        <td className="api-scope-users-list__table__button">
                          <button
                            type="button"
                            className={`api-scope-users-list__button__delete`}
                            title={localization.buttons['remove'].helpText}
                            onClick={() =>
                              confirmDelete(apiScopeUser.nationalId)
                            }
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
            <Paginator
              lastPage={lastPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      <ConfirmModal
        modalIsOpen={modalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeModal}
        confirmation={deleteUser}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}

export default ApiScopeUsersList
