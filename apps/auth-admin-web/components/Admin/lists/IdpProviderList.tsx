/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { IdpProviderService } from './../../../services/IdpProviderService'
import { IdpProvider } from './../../../entities/models/IdpProvider.model'

class IdpProvidersList extends Component {
  state = {
    idpProviders: [],
    rowCount: 0,
    count: 1,
    page: 1,
    modalIsOpen: false,
    idpProviderToRemove: '',
    searchString: '',
  }

  getIdpProviders = async (
    searchString: string,
    page: number,
    count: number,
  ): Promise<void> => {
    const response = await IdpProviderService.findAndCountAll(
      searchString,
      page,
      count,
    )
    if (response) {
      this.setState({
        idpProviders: response.rows,
        rowCount: response.count,
      })
    }
  }

  handlePageChange = async (page: number, count: number): Promise<void> => {
    this.getIdpProviders(this.state.searchString, page, count)
    this.setState({ page: page, count: count })
  }

  deleteIdpProvider = async (): Promise<void> => {
    await IdpProviderService.delete(this.state.idpProviderToRemove)
    this.getIdpProviders(
      this.state.searchString,
      this.state.page,
      this.state.count,
    )
    this.closeModal()
  }

  confirmDelete = async (name: string): Promise<void> => {
    console.log(name)
    this.setState({ idpProviderToRemove: name })
    this.setState({ modalIsOpen: true })
  }

  closeModal = (): void => {
    this.setState({ modalIsOpen: false })
  }

  setHeaderElement = (): JSX.Element => {
    return (
      <p>
        Are you sure want to delete this IDP Provider:{' '}
        <span>{this.state.idpProviderToRemove}</span>
      </p>
    )
  }

  search = (event) => {
    this.getIdpProviders(
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
        <div className="idp-providers-list">
          <div className="idp-providers-list__wrapper">
            <div className="idp-providers-list__container">
              <h1>Identity Providers</h1>
              <div className="idp-providers-list__container__options">
                <div className="idp-providers-list__container__options__button">
                  <Link href={'/admin/idp-provider'}>
                    <a className="idp-providers-list__button__new">
                      <i className="icon__new"></i>Create new Identity Provider
                    </a>
                  </Link>
                </div>
                <form onSubmit={this.search}>
                  <div className="idp-providers-list__container__options__search">
                    <label
                      htmlFor="search"
                      className="idp-providers-list__label"
                    >
                      IDP name
                    </label>
                    <input
                      id="search"
                      className="idp-providers-list__input__search"
                      value={this.state.searchString}
                      onChange={this.handleSearchChange}
                    ></input>
                    <button
                      type="submit"
                      className="idp-providers-list__button__search"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
              <div className="idp-providers-list__container__table">
                <table className="idp-providers-list__table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Level</th>
                      <th colSpan={2}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.idpProviders.map((idpItem: IdpProvider) => {
                      return (
                        <tr key={idpItem.name}>
                          <td>{idpItem.name}</td>
                          <td>{idpItem.description}</td>
                          <td>{idpItem.level}</td>
                          <td className="idp-providers-list__table__button">
                            <Link
                              href={`admin/idp-provider/${encodeURIComponent(
                                idpItem.name,
                              )}`}
                            >
                              <button
                                type="button"
                                className={`idp-providers-list__button__edit`}
                                title="Edit"
                              >
                                <i className="icon__edit"></i>
                                <span>Edit</span>
                              </button>
                            </Link>
                          </td>
                          <td className="idp-providers-list__table__button">
                            <button
                              type="button"
                              className={`idp-providers-list__button__delete`}
                              title="Delete"
                              onClick={() => this.confirmDelete(idpItem.name)}
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
          confirmation={this.deleteIdpProvider}
          confirmationText="Delete"
        ></ConfirmModal>
      </div>
    )
  }
}

export default IdpProvidersList
