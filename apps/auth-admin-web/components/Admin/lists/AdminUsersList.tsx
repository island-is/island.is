/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { AdminAccess } from './../../../entities/models/admin-access.model'
import { AdminAccessService } from '../../../services/AdminAccessService'

class AdminUsersList extends Component {
  state = {
    adminAccess: [],
    rowCount: 0,
    count: 1,
    page: 1,
    modalIsOpen: false,
    accessToRemove: '',
    searchString: '',
  }

  getAdmins = async (
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
      this.setState({
        adminAccess: response.rows,
        rowCount: response.count,
      })
    }
  }

  handlePageChange = async (page: number, count: number): Promise<void> => {
    this.getAdmins(this.state.searchString, page, count)
    this.setState({ page: page, count: count })
  }

  archive = async (): Promise<void> => {
    await AdminAccessService.delete(this.state.accessToRemove)
    this.getAdmins(this.state.searchString, this.state.page, this.state.count)

    this.closeModal()
  }

  confirmArchive = async (nationalId: string): Promise<void> => {
    this.setState({ accessToRemove: nationalId })

    this.setState({ modalIsOpen: true })
  }

  closeModal = (): void => {
    this.setState({ modalIsOpen: false })
  }

  setHeaderElement = (): JSX.Element => {
    return (
      <p>
        Are you sure want to delete this admin user:{' '}
        <span>{this.state.accessToRemove}</span>
      </p>
    )
  }

  search = (event) => {
    this.getAdmins(this.state.searchString, this.state.page, this.state.count)
    event.preventDefault()
  }

  handleSearchChange = (event) => {
    this.setState({ searchString: event.target.value })
  }

  render(): JSX.Element {
    return (
      <div>
        <div className="admin-users-list">
          <div className="admin-users-list__wrapper">
            <div className="admin-users-list__container">
              <h1>Admin UI users</h1>
              <div className="admin-users-list__container__options">
                <div className="admin-users-list__container__options__button">
                  <Link href={'/admin-user'}>
                    <a className="admin-users-list__button__new">
                      <i className="icon__new"></i>Create new Admin UI User
                    </a>
                  </Link>
                </div>
                <form onSubmit={this.search}>
                  <div className="admin-users-list__container__options__search">
                    <label htmlFor="search" className="admin-users-list__label">
                      National Id
                    </label>
                    <input
                      id="search"
                      className="admin-users-list__input__search"
                      value={this.state.searchString}
                      onChange={this.handleSearchChange}
                    ></input>
                    <button
                      type="submit"
                      className="admin-users-list__button__search"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
              <div className="admin-users-list__container__table">
                <table className="admin-users-list__table">
                  <thead>
                    <tr>
                      <th>National Id</th>
                      <th>Email</th>
                      <th>Scope</th>
                      <th colSpan={2}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.adminAccess.map((admin: AdminAccess) => {
                      return (
                        <tr key={admin.nationalId}>
                          <td>{admin.nationalId}</td>
                          <td>{admin.email}</td>
                          <td>{admin.scope}</td>
                          <td className="admin-users-list__table__button">
                            <Link
                              href={`admin-user/${encodeURIComponent(
                                admin.nationalId,
                              )}`}
                            >
                              <button
                                type="button"
                                className={`admin-users-list__button__edit`}
                                title="Edit"
                              >
                                <i className="icon__edit"></i>
                                <span>Edit</span>
                              </button>
                            </Link>
                          </td>
                          <td className="admin-users-list__table__button">
                            <button
                              type="button"
                              className={`admin-users-list__button__delete`}
                              title="Delete"
                              onClick={() =>
                                this.confirmArchive(admin.nationalId)
                              }
                            >
                              <i className="icon__delete"></i>
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <Paginator
                lastPage={Math.ceil(this.state.rowCount / this.state.count)}
                handlePageChange={this.handlePageChange}
              />
            </div>
          </div>
        </div>
        <ConfirmModal
          modalIsOpen={this.state.modalIsOpen}
          headerElement={this.setHeaderElement()}
          closeModal={this.closeModal}
          confirmation={this.archive}
          confirmationText="Archive"
        ></ConfirmModal>
      </div>
    )
  }
}

export default AdminUsersList
