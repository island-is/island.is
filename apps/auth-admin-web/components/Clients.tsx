import React, { Component } from 'react';
import axios from 'axios';
import ClientDTO from '../models/dtos/client-dto';
import Paginator from './Paginator';
import Link from 'next/link';

class Clients extends Component {
  
  state = {
    clients: [],
    rowCount: 0,
    lastPage: 0,
    count: 1,
    page: 1,
  };

  getClients = async (page, count) => {
    const response = await axios.get(
      `/api/clients?page=${page}&count=${count}`
    );

    this.setState({
      clients: response.data.rows,
      rowCount: response.data.count,
      lastPage: Math.ceil(this.state.rowCount / this.state.count),
    });
  }

  componentDidMount = async () => {
    this.getClients(this.state.page, this.state.page) 
  };

  handlePageChange = async (page: number) => {
    this.getClients(page, this.state.count);
    this.setState({ page: page});
  };

  delete = async (clientId: string) => {
    if (window.confirm('Ertu viss um að þú viljir eyða þessari færslu?')) {
      const response = await axios.delete(`./clients/${clientId}`);
      console.log(response);
      await this.componentDidMount();
    }
  };

  edit = async (client: ClientDTO) => {
    console.log(client);
  };

  changeCount(count: string) {
    this.getClients(1, +count);

    this.setState({
      count: +count,
      page: 1,
    });
  }

  render() {
    return (
      <div className="clients__container">
        <h2>Clients</h2>
        <div className="clients__container__options">
          <div className="clients__container__button">
            <Link href={'/client'}>
              <a className="clients__button__new">Create new client</a>
            </Link>
          </div>
          <div className="clients__container__field">
            <label htmlFor="count" className="clients__label">
              Fjöldi á síðu
            </label>
            <select
              id="count"
              onChange={(e) => this.changeCount(e.target.value)}
              className="clients__select"
            >
              <option value="1">1</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div className="client__container__table">
          <table className="clients__table">
            <thead>
              <tr>
                <th>Auðkenni</th>
                <th>Identity token lifetime</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody>
              {this.state.clients.map((client: ClientDTO) => {
                return (
                  <tr key={client.clientId}>
                    <td>{client.clientId}</td>
                    <td>{client.identityTokenLifetime}</td>
                    <td>
                      <button
                        className="clients__button__edit"
                        onClick={() => this.edit(client)}
                      >
                        Breyta
                      </button>
                    </td>
                    <td>
                      <button
                        className="clients__button__delete"
                        onClick={() => this.delete(client.clientId)}
                      >
                        Eyða
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Paginator
          lastPage={this.state.lastPage}
          handlePageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default Clients;
