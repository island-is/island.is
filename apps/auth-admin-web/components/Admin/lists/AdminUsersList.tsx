/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { AdminAccess } from './../../../entities/models/admin-access.model'
import { AdminAccessService } from '../../../services/AdminAccessService'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

const AdminUsersList: React.FC = () => {
  const [adminAccess, setAdminAccess] = useState<AdminAccess[]>([])
  const [page, setPage] = useState(1)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [count, setCount] = useState(0)
  const [searchString, setSearchString] = useState<string>('')
  const [lastPage, setLastPage] = useState(1)
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('AdminUsersList'),
  )
  const [accessToRemove, setAccessToRemove] = useState('')

  const getAdmins = async (
    searchString: string,
    page: number,
    count: number,
  ): Promise<void> => {
    const response = await AdminAccessService.findAndCountAll(
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
    const response = await AdminAccessService.delete(accessToRemove)
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
      <div className="admin-users-list">
        <div className="admin-users-list__wrapper">
          <div className="admin-users-list__container">
            <h1>{localization.title}</h1>
            <div className="admin-users-list__container__options">
              <div className="admin-users-list__container__options__button">
                <Link href={'/admin/admin-user'}>
                  <a className="admin-users-list__button__new">
                    <i className="icon__new"></i>
                    {localization.createNewItem}
                  </a>
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="admin-users-list__container__options__search">
                  <label htmlFor="search" className="admin-users-list__label">
                    {localization.search.label}
                  </label>
                  <input
                    id="search"
                    className="admin-users-list__input__search"
                    value={searchString}
                    onChange={handleSearchChange}
                  ></input>
                  <button
                    type="submit"
                    className="admin-users-list__button__search"
                  >
                    {localization.searchButton}
                  </button>
                </div>
              </form>
            </div>
            <div className="admin-users-list__container__table">
              <table className="admin-users-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['nationalId'].headerText}</th>
                    <th>{localization.columns['email'].headerText}</th>
                    <th>{localization.columns['scope'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {adminAccess.map((admin: AdminAccess) => {
                    return (
                      <tr key={admin.nationalId}>
                        <td>{admin.nationalId}</td>
                        <td>{admin.email}</td>
                        <td>{admin.scope}</td>
                        <td className="admin-users-list__table__button">
                          <Link
                            href={`/admin/admin-user/${encodeURIComponent(
                              admin.nationalId,
                            )}`}
                          >
                            <button
                              type="button"
                              className={`admin-users-list__button__edit`}
                              title={localization.editButton}
                            >
                              <i className="icon__edit"></i>
                              <span>{localization.editButton}</span>
                            </button>
                          </Link>
                        </td>
                        <td className="admin-users-list__table__button">
                          <button
                            type="button"
                            className={`admin-users-list__button__delete`}
                            title={localization.removeButton}
                            onClick={() => confirmDelete(admin.nationalId)}
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
        confirmationText={localization.removeButton}
      ></ConfirmModal>
    </div>
  )
}

export default AdminUsersList
