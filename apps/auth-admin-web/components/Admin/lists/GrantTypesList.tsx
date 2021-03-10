/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { GrantTypeService } from './../../../services/GrantTypeService'
import { GrantType } from './../../../entities/models/grant-type.model'

class GrantTypesList extends Component {
  state = {
    grantTypes: [],
    rowCount: 0,
    count: 1,
    page: 1,
    modalIsOpen: false,
    grantTypeToRemove: '',
    searchString: '',
  }

  getGrantTypes = async (
    searchString: string,
    page: number,
    count: number,
  ): Promise<void> => {
    const response = await GrantTypeService.findAndCountAll(
      searchString,
      page,
      count,
    )
    if (response) {
      this.setState({
        grantTypes: response.rows,
        rowCount: response.count,
      })
    }
  }

  handlePageChange = async (page: number, count: number): Promise<void> => {
    this.getGrantTypes(this.state.searchString, page, count)
    this.setState({ page: page, count: count })
  }

  deleteGrantType = async (): Promise<void> => {
    await GrantTypeService.delete(this.state.grantTypeToRemove)
    this.getGrantTypes(
      this.state.searchString,
      this.state.page,
      this.state.count,
    )
    this.closeModal()
  }

  confirmDelete = async (name: string): Promise<void> => {
    this.setState({ grantTypeToRemove: name })
    this.setState({ modalIsOpen: true })
  }

  closeModal = (): void => {
    this.setState({ modalIsOpen: false })
  }

  setHeaderElement = (): JSX.Element => {
    return (
      <p>
        Are you sure want to delete this Grant Type:{' '}
        <span>{this.state.grantTypeToRemove}</span>
      </p>
    )
  }

  search = (event) => {
    this.getGrantTypes(
      this.state.searchString,
      this.state.page,
      this.state.count,
    )
    event.preventDefault()
  }

  handleSearchChange = (event) => {
    this.setState({ searchString: event.target.value })
  }

  render(): JSX.Element {
    return (
      <div>
        <div className="grant-type-list">
          <div className="grant-type-list__wrapper">
            <div className="grant-type-list__container">
              <h1>Grant Types</h1>
              <div className="grant-type-list__container__options">
                <div className="grant-type-list__container__options__button">
                  <Link href={'/admin/grant-type'}>
                    <a className="grant-type-list__button__new">
                      <i className="icon__new"></i>Create new Grant Type
                    </a>
                  </Link>
                </div>
                <form onSubmit={this.search}>
                  <div className="grant-type-list__container__options__search">
                    <label htmlFor="search" className="grant-type-list__label">
                      Grant Type name
                    </label>
                    <input
                      id="search"
                      className="grant-type-list__input__search"
                      value={this.state.searchString}
                      onChange={this.handleSearchChange}
                    ></input>
                    <button
                      type="submit"
                      className="grant-type-list__button__search"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
              <div className="grant-type-list__container__table">
                <table className="grant-type-list__table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th colSpan={2}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.grantTypes.map((grantType: GrantType) => {
                      return (
                        <tr
                          key={grantType.name}
                          className={grantType.archived ? 'archived' : ''}
                        >
                          <td>{grantType.name}</td>
                          <td>{grantType.description}</td>
                          <td className="grant-type-list__table__button">
                            <Link
                              href={`admin/grant-type/${encodeURIComponent(
                                grantType.name,
                              )}`}
                            >
                              <button
                                type="button"
                                className={`grant-type-list__button__edit${
                                  grantType.archived ? ' hidden' : ''
                                }`}
                                title="Edit"
                              >
                                <i className="icon__edit"></i>
                                <span>Edit</span>
                              </button>
                            </Link>
                          </td>
                          <td className="grant-type-list__table__button">
                            <button
                              type="button"
                              className={`grant-type-list__button__delete${
                                grantType.archived ? ' hidden' : ''
                              }`}
                              title="Delete"
                              onClick={() => this.confirmDelete(grantType.name)}
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
          confirmation={this.deleteGrantType}
          confirmationText="Delete"
        ></ConfirmModal>
      </div>
    )
  }
}

export default GrantTypesList
