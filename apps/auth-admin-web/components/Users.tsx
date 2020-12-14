import React, { useState } from 'react';
import axios from 'axios';
import { UserIdentityDTO } from '../models/dtos/user-identity.dto';
import APIResponse from '../models/utils/APIResponse';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from './HelpBox';
import { ClaimDTO } from '../models/dtos/claim.dto';
import NotFound from './form/NotFound';

interface ClaimShow {
  subjectId: string;
  show: boolean;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserIdentityDTO[]>([]);
  const [id, setId] = useState<string>("");
  const [claimShow, setClaimShow] = useState<ClaimShow[]>([]);
  const [type, setType] = useState<string>("");
  const [showNotFound, setShowNotFound] = useState<boolean>(false);
  const { handleSubmit, register, errors, formState } = useForm();
  const { isSubmitting } = formState;

  const getIndex = (subjectId: string) : number => {
    for(let i = 0; i < claimShow.length; i++){
      if ( claimShow[i].subjectId === subjectId)
      {
        return i;
      }
    }
    return -1;
  }

  const getUser = async (data) => {
    setShowNotFound(false);
    await axios
      .get(`api/user-identities/${data.id}`)
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
        setUsers(response.data);
      })
      .catch(function (error) {
        if (error.response) {
                  
          // setResponse(error.response.data);
          // console.log(error.response.data);
        } else {
          
          // TODO: Handle and show error
        }
        console.log("Setting not found");
        setShowNotFound(true);
        setUsers([]);
      });

      setId(data.id);
      setType(data.type);
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

    getUser({ id: id, type: type });
  };

  const handleShowClaimsClicked = (user: UserIdentityDTO, show = true) : ClaimShow => {
    const index = getIndex(user.subjectId);
    let ret = { subjectId: user.subjectId, show: show};
    if ( index === -1)
    {
      claimShow.push(ret);
    }
    else {
      claimShow[index].show = !claimShow[index].show;
      ret = claimShow[index];
    }

    setClaimShow([...claimShow]);    
    return ret;
  };

  const showClaims = (user: UserIdentityDTO) : boolean => {
    const index = getIndex(user.subjectId);
    if ( index === -1 ){
      return false;
    }
    else {
      return claimShow[index].show;
    }
  }

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
                    Search by National Id or Subject Id
                  </label>
                  <input
                    id="search"
                    type="text"
                    name="id"
                    defaultValue={''}
                    className="users__search__input"
                    ref={register({ required: true })}
                    placeholder="0123456789"
                  />
                  <HelpBox helpText="You can search for user identities by national Id or User Identity subject Id. National ID must be typed in as a number with 10 number characters otherwise you will be looking up by Subject Id" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="id"
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
                <th colSpan={2}></th>
              </tr>
              <tbody>
                {users.map((user: UserIdentityDTO) => {
                  return (
                    <tr key={user.subjectId}>
                      <td>{user.subjectId}</td>
                      <td>{user.name}</td>
                      <td>{user.providerName}</td>
                      <td>{user.providerSubjectId}</td>
                      <td className="overlay-container">
                        <button
                          className="clients__button__view"
                          onClick={() => handleShowClaimsClicked(user)}
                        >
                          View claims
                        </button>
                        
                        <div className={`users__claim__overlay users__container__list ${showClaims(user)  ? 'show' : 'hidden'}`}>
                        <a className="users__container__button__close" onClick={() => handleShowClaimsClicked(user)}>&times;</a>
                        {user.claims.map((claim: ClaimDTO) => {
                          return (
                            <div className="users__container__list__item" key={claim.type}>
                              
                              <div className="list-name">
                                {claim.type}:
                              </div>
                              <div className="list-value">
                                {claim.value}
                              </div>
                              </div>
                          )
                        })}

                        </div>
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
          { showNotFound && (<NotFound title="User Identity not found">Nothing found for: {id}</NotFound>)}
        </div>
      </div>
    </div>
  );
};

export default Users;

