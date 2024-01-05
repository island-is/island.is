/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Paginator from '../../common/Paginator'
import Link from 'next/link'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'
import { Client } from './../../../entities/models/client.model'
import { downloadCSV } from '../../../utils/csv.utils'
import LocalizationUtils from '../../../utils/localization.utils'
import { ListControl } from '../../../entities/common/Localization'

const ClientsList: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [clientToRemove, setclientToRemove] = React.useState('')
  const [count, setCount] = useState(0)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [searchString, setSearchString] = useState<string>('')
  const [localization] = useState<ListControl>(
    LocalizationUtils.getListControl('ClientsList'),
  )

  const getClients = async (
    searchString: string,
    page: number,
    count: number,
  ): Promise<void> => {
    const response = await ClientService.findAndCountAll(
      searchString,
      page,
      count,
    )
    if (response) {
      setClients(response.rows)
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const handlePageChange = async (
    page: number,
    count: number,
  ): Promise<void> => {
    getClients(searchString, page, count)
    setPage(page)
    setCount(count)
  }

  const archive = async (): Promise<void> => {
    const response = await ClientService.delete(clientToRemove)
    if (response) {
      getClients(searchString, page, count)
    }
    closeModal()
  }

  const confirmArchive = async (clientId: string): Promise<void> => {
    setclientToRemove(clientId)
    setIsOpen(true)
  }

  const closeModal = (): void => {
    setIsOpen(false)
  }

  const setHeaderElement = (): JSX.Element => {
    return (
      <p>
        {localization.removeConfirmation}:<span>{clientToRemove}</span>
      </p>
    )
  }

  const search = (event) => {
    getClients(searchString, page, count)
    event.preventDefault()
  }

  const handleSearchChange = (event) => {
    setSearchString(event.target.value)
  }

  const exportCsv = async () => {
    const filename = `Clients, ${new Date().toISOString().split('T')[0]}.csv`

    await downloadCSV(
      filename,
      ClientService.getClientsCsvHeaders(),
      ClientService.getClientsCsv,
    )
  }

  return (
    <div>
      <div className="clients">
        <div className="clients__wrapper">
          <div className="clients__container">
            <h1>{localization.title}</h1>
            <div className="clients__container__options">
              <div className="clients__container__options__button">
                <Link
                  href={'/client'}
                  className="clients__button__new"
                  title={localization.buttons['new'].helpText}
                >
                  <i className="icon__new"></i>
                  {localization.buttons['new'].text}
                </Link>
              </div>
              <form onSubmit={search}>
                <div className="clients__container__options__search">
                  <label htmlFor="search" className="clients__label">
                    {localization.search?.label}
                  </label>
                  <input
                    id="search"
                    className="clients__input__search"
                    value={searchString}
                    onChange={handleSearchChange}
                  ></input>
                  <button
                    type="submit"
                    className="clients__button__search"
                    title={localization.buttons['search'].helpText}
                  >
                    {localization.buttons['search'].text}
                  </button>
                </div>
              </form>
            </div>
            <div className="client__container__table">
              <table className="clients__table">
                <thead>
                  <tr>
                    <th>{localization.columns['clientId'].headerText}</th>
                    <th>{localization.columns['nationalId'].headerText}</th>
                    <th>{localization.columns['contactEmail'].headerText}</th>
                    <th>{localization.columns['clientType'].headerText}</th>
                    <th colSpan={2}></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client: Client) => {
                    return (
                      <tr
                        key={client.clientId}
                        className={client.archived ? 'archived' : ''}
                      >
                        <td>{client.clientId}</td>
                        <td>{client.nationalId}</td>
                        <td>{client.contactEmail}</td>
                        <td>{client.clientType}</td>
                        <td className="clients__table__button">
                          <Link
                            href={`client/${encodeURIComponent(
                              client.clientId,
                            )}`}
                            legacyBehavior
                          >
                            <button
                              type="button"
                              className={`clients__button__edit${
                                client.archived ? ' hidden' : ''
                              }`}
                              title={localization.buttons['edit'].helpText}
                            >
                              <i className="icon__edit"></i>
                              <span>{localization.buttons['edit'].text}</span>
                            </button>
                          </Link>
                        </td>
                        <td className="clients__table__button">
                          <button
                            type="button"
                            className={`clients__button__delete${
                              client.archived ? ' hidden' : ''
                            }`}
                            title={localization.buttons['remove'].helpText}
                            onClick={() => confirmArchive(client.clientId)}
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
              <div className="clients__container__export">
                <div className="clients__container__export__container__button">
                  <button
                    type="button"
                    onClick={() => exportCsv()}
                    title={localization.buttons['export'].helpText}
                  >
                    <i className="icon__export__csv" aria-hidden="true"></i>
                    <span>{localization.buttons['export'].text}</span>
                  </button>
                </div>
              </div>
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
        confirmation={archive}
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}

export default ClientsList
