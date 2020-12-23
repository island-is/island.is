import React, { Component } from 'react';
import ClientDTO from '../../entities/dtos/client-dto';
import Paginator from '../common/Paginator';
import Link from 'next/link';
import { ClientService } from './../../services/ClientService';
import ConfirmModal from './../common/ConfirmModal';

class ClientsList extends Component {
  state = {
    clients: [],
    rowCount: 0,
    count: 1,
    page: 1,
    modalIsOpen: false,
    clientToRemove: '',
  };

  getClients = async (page: number, count: number) => {
    const response = await ClientService.findAndCountAll(page, count);
    if (response) {
      this.setState({
        clients: response.rows,
        rowCount: response.count,
      });
    }
  };

  handlePageChange = async (page: number, count: number) => {
    this.getClients(page, count);
    this.setState({ page: page, count: count });
  };

  archive = async () => {
    this.closeModal();

    alert(
      'Add archived value to client table to be able to finish this function'
    );
  };

  confirmArchive = async (clientId: string) => {
    this.setState({ clientToRemove: clientId });

    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  setHeaderElement = () => {
    return (
      <p>
        Are you sure want to archive this client:{' '}
        <span>{this.state.clientToRemove}</span>
      </p>
    );
  };

  render() {
    return (
      <div>
        <div className="clients">
          <div className="clients__wrapper">
            <div className="clients__container">
              <h1>Clients</h1>
              <div className="clients__container__options">
                <div className="clients__container__button">
                  <Link href={'/client'}>
                    <a className="clients__button__new">
                      <i className="icon__new"></i>Create new client
                    </a>
                  </Link>
                </div>
              </div>
              <div className="client__container__table">
                <table className="clients__table">
                  <thead>
                    <tr>
                      <th>Client Id</th>
                      <th>Description</th>
                      <th colSpan={2}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.clients.map((client: ClientDTO) => {
                      return (
                        <tr key={client.clientId}>
                          <td>{client.clientId}</td>
                          <td>{client.description}</td>
                          <td className="clients__table__button">
                            <Link href={`client/${client.clientId}`}>
                              <button
                                type="button"
                                className="clients__button__edit"
                                title="Edit"
                              >
                                <i className="icon__edit"></i>
                                <span>Edit</span>
                              </button>
                            </Link>
                          </td>
                          <td className="clients__table__button">
                            <button
                              type="button"
                              className="clients__button__delete"
                              title="Delete"
                              onClick={() =>
                                this.confirmArchive(client.clientId)
                              }
                            >
                              <i className="icon__delete"></i>
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      );
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
    );
  }
}

export default ClientsList;
