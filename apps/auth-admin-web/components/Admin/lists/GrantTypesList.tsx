/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import { GrantTypeService } from './../../../services/GrantTypeService'
import { GrantType } from './../../../entities/models/grant-type.model'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

const GrantTypesList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [grantTypes, setGrantTypes] = useState<GrantType[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [grantTypeToRemove, setGrantTypeToRemove] = useState('')
  const [count, setCount] = useState(0)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [searchString, setSearchString] = useState<string>('')
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('GrantTypesList'),
  )

  const getGrantTypes = async (
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
      setGrantTypes(response.rows)
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const handlePageChange = async (
    page: number,
    count: number,
  ): Promise<void> => {
    getGrantTypes(searchString, page, count)
    setPage(page)
    setCount(count)
  }

  const deleteGrantType = async (): Promise<void> => {
    const response = await GrantTypeService.delete(grantTypeToRemove)
    if (response) {
      getGrantTypes(searchString, page, count)
    }

    closeModal()
  }

  const confirmDelete = async (name: string): Promise<void> => {
    setGrantTypeToRemove(name)
    setIsOpen(true)
  }

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const setHeaderElement = (): JSX.Element => {
    return (
      <p>
        {localization.removeConfirmation}
        <span>{grantTypeToRemove}</span>
      </p>
    )
  }

  const search = (event) => {
    getGrantTypes(searchString, page, count)
    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchString(event.target.value)
  }

  return (
    <div>
      <div className="grant-type-list">
        <div className="grant-type-list__wrapper">
          <div className="grant-type-list__container">
            <h1>{localization.title}</h1>
            <div className="grant-type-list__container__options">
              <div className="grant-type-list__container__options__button">
                <Link
                  href={'/admin/grant-type'}
                  className="grant-type-list__button__new"
                  title={localization.buttons['new'].helpText}
                >
                  <i className="icon__new"></i>
                  {localization.buttons['new'].text}
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="grant-type-list__container__options__search">
                  <label htmlFor="search" className="grant-type-list__label">
                    {localization.search.label}
                  </label>
                  <input
                    id="search"
                    className="grant-type-list__input__search"
                    value={searchString}
                    onChange={handleSearchChange}
                  ></input>
                  <button
                    type="submit"
                    className="grant-type-list__button__search"
                    title={localization.buttons['search'].helpText}
                  >
                    {localization.buttons['search'].text}
                  </button>
                </div>
              </form>
            </div>
            <div className="grant-type-list__container__table">
              <table className="grant-type-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['name'].headerText}</th>
                    <th>{localization.columns['description'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {grantTypes.map((grantType: GrantType) => {
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
                            legacyBehavior
                          >
                            <button
                              type="button"
                              className={`grant-type-list__button__edit${
                                grantType.archived ? ' hidden' : ''
                              }`}
                              title={localization.buttons['edit'].helpText}
                            >
                              <i className="icon__edit"></i>
                              <span>{localization.buttons['edit'].text}</span>
                            </button>
                          </Link>
                        </td>
                        <td className="grant-type-list__table__button">
                          <button
                            type="button"
                            className={`grant-type-list__button__delete${
                              grantType.archived ? ' hidden' : ''
                            }`}
                            title={localization.buttons['remove'].helpText}
                            onClick={() => confirmDelete(grantType.name)}
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
        confirmation={deleteGrantType}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}

export default GrantTypesList
