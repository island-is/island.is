/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import ConfirmModal from '../../common/ConfirmModal'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'
import { ResourcesService } from './../../../services/ResourcesService'
import { Domain } from './../../../entities/models/domain.model'
import { PagedRowsDTO } from './../../../entities/models/paged-rows.dto'

const DomainList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [page, setPage] = useState(1)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [count, setCount] = useState(0)
  const [searchString, setSearchString] = useState<string>('')
  const [lastPage, setLastPage] = useState(1)
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('DomainList'),
  )
  const [domainToRemove, setDomainToRemove] = useState('')
  const [domains, setDomains] = useState<Domain[]>([])

  const getDomains = async (
    searchString: string,
    page: number,
    count: number,
  ): Promise<void> => {
    const response = await ResourcesService.findAllDomains(
      searchString,
      page,
      count,
    )
    if (response) {
      setDomains((response as PagedRowsDTO<Domain>).rows)
      setLastPage(Math.ceil((response as PagedRowsDTO<Domain>).count / count))
    }
  }

  const handlePageChange = async (
    page: number,
    count: number,
  ): Promise<void> => {
    getDomains(searchString, page, count)
    setPage(page)
    setCount(count)
  }

  const deleteUser = async (): Promise<void> => {
    const response = await ResourcesService.deleteDomain(domainToRemove)
    if (response) {
      getDomains(searchString, page, count)
    }
    closeModal()
  }

  const confirmDelete = async (nationalId: string): Promise<void> => {
    setDomainToRemove(nationalId)
    setIsOpen(true)
  }

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const setHeaderElement = (): JSX.Element => {
    return (
      <p>
        {localization.removeConfirmation}
        <span>{domainToRemove}</span>
      </p>
    )
  }

  const search = (event) => {
    getDomains(searchString, page, count)
    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchString(event.target.value)
  }

  return (
    <div>
      <div className="domain-list">
        <div className="domain-list__wrapper">
          <div className="domain-list__container">
            <h1>{localization.title}</h1>
            <div className="domain-list__container__options">
              <div className="domain-list__container__options__button">
                <Link
                  href={'/admin/domain'}
                  className="domain-list__button__new"
                  title={localization.buttons['new'].helpText}
                >
                  <i className="icon__new"></i>
                  {localization.buttons['new'].text}
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="domain-list__container__options__search">
                  <label htmlFor="search" className="domain-list__label">
                    {localization.search.label}
                  </label>
                  <input
                    id="search"
                    className="domain-list__input__search"
                    value={searchString}
                    onChange={handleSearchChange}
                  ></input>
                  <button
                    type="submit"
                    className="domain-list__button__search"
                    title={localization.buttons['search'].helpText}
                  >
                    {localization.buttons['search'].text}
                  </button>
                </div>
              </form>
            </div>
            <div className="domain-list__container__table">
              <table className="domain-list__table">
                <thead>
                  <tr>
                    <th>{localization.columns['nationalId'].headerText}</th>
                    <th>{localization.columns['name'].headerText}</th>
                    <th>{localization.columns['description'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {domains &&
                    domains.map((domain: Domain) => {
                      return (
                        <tr key={domain.name}>
                          <td>{domain.nationalId}</td>
                          <td>{domain.name}</td>
                          <td>{domain.description}</td>
                          <td className="domain-list__table__button">
                            <Link
                              href={`/admin/domain/${encodeURIComponent(
                                domain.name,
                              )}`}
                              legacyBehavior
                            >
                              <button
                                type="button"
                                className={`domain-list__button__edit`}
                                title={localization.buttons['edit'].helpText}
                              >
                                <i className="icon__edit"></i>
                                <span>{localization.buttons['edit'].text}</span>
                              </button>
                            </Link>
                          </td>
                          <td className="domain-list__table__button">
                            <button
                              type="button"
                              className={`domain-list__button__delete`}
                              title={localization.buttons['remove'].helpText}
                              onClick={() => confirmDelete(domain.name)}
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

export default DomainList
