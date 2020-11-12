import React, { Component } from "react";
import axios from "axios";
import { UserIdentityDTO } from "../models/dtos/user-identity.dto";

class UsersCard extends Component {
  state = {
    subjectId: "",
    users: [],
  };

  getUser = async () => {
    const response = await axios.get(
      `/user-identities/${this.state.subjectId}`
    );
    console.log(response);
  };

  edit = async (user: UserIdentityDTO) => {
    // TODO: Is this neccesary
    return false;
  };

  toggleActive = async (user: UserIdentityDTO) => {
    // TODO: Set user active or deactive
    if (user.active) {
      // Deactivate
    } else {
      // Activate
    }

    return false;
  };

  viewClaims = async (user: UserIdentityDTO) => {
    // TODO: View Claims if neccesary
  };

  render() {
    return (
      <div className="users">
        <form onSubmit={this.getUser}>
          <label className="users__label" htmlFor="search">
            Leit eftir subject Id
          </label>
          <input
            id="search"
            type="text"
            className="users__search__input"
            onChange={(e) => this.setState({ subjectId: e.target.value })}
          />
          <input
            type="submit"
            value="Search"
            className="users__button__searh"
          />
        </form>

        <div className="users__container__table">
          <table className="users__table">
            <tr>
              <th>Subject Id</th>
              <th>Name</th>
              <th>Provider Name</th>
              <th>Provider Subject Id</th>
              <th>Active</th>
              <th colSpan={3}></th>
            </tr>
            <tbody>
              {this.state.users.map((user: UserIdentityDTO) => {
                return (
                  <tr key={user.subjectId}>
                    <td>{user.name}</td>
                    <td>{user.providerName}</td>
                    <td>{user.providerSubjectId}</td>
                    <td>{user.active}</td>
                    <td>
                      <button
                        className="clients__button__view"
                        onClick={() => this.viewClaims(user)}
                      >
                        View claims
                      </button>
                    </td>
                    <td>
                      <button
                        className="clients__button__edit"
                        onClick={() => this.edit(user)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="clients__button__delete"
                        onClick={() => this.toggleActive(user)}
                      >
                        {user.active ? "Deactivate" : "Active"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default UsersCard;
