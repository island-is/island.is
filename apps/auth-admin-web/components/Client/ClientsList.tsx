import React, { Component } from 'react';
import ClientDTO from '../../entities/dtos/client-dto';
import Paginator from '../Common/Paginator';
import Link from 'next/link';
import api from '../../services/api'

class ClientsList extends Component {
  state = {
    clients: [],
    rowCount: 0,
    count: 1,
    page: 1,
  };

  getClients = async (page: number, count: number) => {
    const response = await api.get(
      `clients/?page=${page}&count=${count}`
    );

    this.setState({
      clients: response.data.rows,
      rowCount: response.data.count,
    });
  };

  handlePageChange = async (page: number, count: number) => {
    this.getClients(page, count);
    this.setState({ page: page, count: count });
  };

  delete = async (clientId: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete this client: "${clientId}"?`
      )
    ) {
      const response = await api.delete(`clients/${clientId}`);
      this.getClients(this.state.page, this.state.count);
    }
  };

  render() {
    return (
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
                          onClick={() => this.delete(client.clientId)}
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
    );
  }
}

export default ClientsList;
