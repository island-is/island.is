import React, { useState } from 'react';
import axios from 'axios';
import { UserIdentityDTO } from '../models/dtos/user-identity.dto';
import APIResponse from '../models/APIResponse';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from './HelpBox';

const Users: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string>('');
  const [users, setUsers] = useState<UserIdentityDTO[]>([]);
  const { handleSubmit, register, errors, formState } = useForm();
  const { isSubmitting } = formState;

  const getUser = async (data) => {
    console.log(data);
    console.log('FORM SUMB');
    await axios
      .get(`api/user-identities/${data.subjectId}`)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        console.log(response.data);
        // setResponse(res);
        // if (res.statusCode === 201) {
        //   console.log('handle change');
        //   console.log(clientObject);
        //   props.onNextButtonClick(clientObject);
        // }
        setUsers([response.data]);
      })
      .catch(function (error) {
        if (error.response) {
          
          // setResponse(error.response.data);
          // console.log(error.response.data);
        } else {
          
          // TODO: Handle and show error
        }
        setUsers([]);
      });
  };

  const edit = () => {
    console.log('Not Implemented - is it needed?');
  };

  const toggleActive = async (user: UserIdentityDTO) => {
    await axios
      .patch(`api/user-identities/${user.subjectId}`, { active: !user.active })
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        console.log(response.data);
      })
      .catch(function (error) {
        if (error.response) {
          // setResponse(error.response.data);
          // console.log(error.response.data);
        } else {
          // TODO: Handle and show error
        }
      });

    getUser({ subjectId: user.subjectId });
  };

  const viewClaims = async (user: UserIdentityDTO) => {
    // TODO: View Claims if neccesary
  };

  return (
    <div className="users">
      <div className="users__wrapper">
        <div className="users__container">
          <h1>User management</h1>
          <div className="users__container__form">
            <form onSubmit={handleSubmit(getUser)}>
              <div className="users__container__fields">
                <div className="users__container__field">
                  <label className="users__label" htmlFor="search">
                    Leit eftir subject Id
                  </label>
                  <input
                    id="search"
                    type="text"
                    name="subjectId"
                    defaultValue={''}
                    className="users__search__input"
                    ref={register({ required: true })}
                    placeholder="0123456789"
                  />
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="subjectId"
                    message="SubjectId is required"
                  />
                  <input
                    type="submit"
                    value="Search"
                    disabled={isSubmitting}
                    className="users__button__search"
                  />
                </div>
              </div>
            </form>
          </div>

          <div
            className={`users__container__table ${
              users && users.length > 0 ? 'show' : 'hidden'
            }`}
          >
            <h3>Users found:</h3>
            <table className="users__table">
              <tr>
                <th>Subject Id</th>
                <th>Name</th>
                <th>Provider Name</th>
                <th>Provider Subject Id</th>
                <th colSpan={3}></th>
              </tr>
              <tbody>
                {users.map((user: UserIdentityDTO) => {
                  return (
                    <tr key={user.subjectId}>
                      <td>{user.name}</td>
                      <td>{user.providerName}</td>
                      <td>{user.providerSubjectId}</td>
                      <td>{user.active}</td>
                      <td>
                        <button
                          className="clients__button__view"
                          onClick={() => viewClaims(user)}
                        >
                          View claims
                        </button>
                      </td>
                      <td>
                        <button
                          className="clients__button__edit"
                          onClick={() => edit(user)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className={`clients__button__delete ${
                            user.active === true
                              ? 'button__warning'
                              : 'button__ok'
                          }`}
                          onClick={() => toggleActive(user)}
                          title={
                            user.active
                              ? 'User is active. Click to deactivate'
                              : 'User is deactivated. Click to activate'
                          }
                        >
                          {user.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
