/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { IdpProviderService } from '../../../services/IdpProviderService'
import { IdpProvider } from '../../../entities/models/IdpProvider.model'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

const IdpProvidersList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [idpProviders, setIdpProviders] = useState<IdpProvider[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [idpProviderToRemove, setIdpProviderToRemove] = React.useState('')
  const [count, setCount] = useState(0)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [searchString, setSearchString] = useState<string>('')
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('IdpProvidersList'),
  )

  const getIdpProviders = async (
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
      setIdpProviders(response.rows)
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const handlePageChange = async (
    page: number,
    count: number,
  ): Promise<void> => {
    getIdpProviders(searchString, page, count)
    setPage(page)
    setCount(count)
  }

  const deleteIdpProvider = async (): Promise<void> => {
    const response = await IdpProviderService.delete(idpProviderToRemove)
    if (response) {
      getIdpProviders(searchString, page, count)
    }
    closeModal()
  }

  const confirmDelete = async (name: string): Promise<void> => {
    setIdpProviderToRemove(name)
    setIsOpen(true)
  }

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const setHeaderElement = (): JSX.Element => {
    return (
      <p>
        {localization.removeConfirmation}

        <span>{idpProviderToRemove}</span>
      </p>
    )
  }

  const search = (event) => {
    getIdpProviders(searchString, page, count)
    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchString(event.target.value)
  }

  return (
    <div>
      <div className="idp-providers-list">
        <div className="idp-providers-list__wrapper">
          <div className="idp-providers-list__container">
            <h1>{localization.title}</h1>
            <div className="idp-providers-list__container__options">
              <div className="idp-providers-list__container__options__button">
                <Link
                  href={'/admin/idp-provider'}
                  className="idp-providers-list__button__new"
                  title={localization.buttons['new'].helpText}
                >
                  <i className="icon__new"></i>
                  {localization.buttons['new'].text}
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="idp-providers-list__container__options__search">
                  <label htmlFor="search" className="idp-providers-list__label">
                    {localization.search.label}
                  </label>
                  <input
                    id="search"
                    className="idp-providers-list__input__search"
                    value={searchString}
                    onChange={handleSearchChange}
                  ></input>
                  <button
                    type="submit"
                    className="idp-providers-list__button__search"
                    title={localization.buttons['search'].helpText}
                  >
                    {localization.buttons['search'].text}
                  </button>
                </div>
              </form>
            </div>
            <div className="idp-providers-list__container__table">
              <table className="idp-providers-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['name'].headerText}</th>
                    <th>{localization.columns['description'].headerText}</th>
                    <th>{localization.columns['level'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {idpProviders.map((idpItem: IdpProvider) => {
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
                            legacyBehavior
                          >
                            <button
                              type="button"
                              className={`idp-providers-list__button__edit`}
                              title={localization.buttons['edit'].helpText}
                            >
                              <i className="icon__edit"></i>
                              <span>{localization.buttons['edit'].text}</span>
                            </button>
                          </Link>
                        </td>
                        <td className="idp-providers-list__table__button">
                          <button
                            type="button"
                            className={`idp-providers-list__button__delete`}
                            title={localization.buttons['remove'].helpText}
                            onClick={() => confirmDelete(idpItem.name)}
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
        confirmation={deleteIdpProvider}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}

export default IdpProvidersList
