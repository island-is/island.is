import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import IdentityResourcesDTO from '../models/dtos/identity-resources.dto';
import axios from 'axios';
import Paginator from './Paginator';
import APIResponse from '../models/utils/APIResponse';
import StatusBar from './StatusBar';

export default function IdentityResources() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<APIResponse>(null);
  const [resources, setResources] = useState<IdentityResourcesDTO[]>([]);
  const [totalCount, setTotalCount] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const edit = (resource: IdentityResourcesDTO) => {
   // TODO:
  };

  const getResources = async (page, count) => {
    console.log("getting res");
    await axios
      .get(`/api/identity-resources?page=${page}&count=${count}`)
      .then((response) => {
        console.log("getting res then");
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);

        setResources(response.data.rows);
        setTotalCount(response.data.count);
        setLastPage(Math.ceil(totalCount / count));
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        }
        else {
          const apiError = new APIResponse();
          apiError.message = [error];
          setResponse(apiError);
        }
      });
  };

  const handlePageChange = async (page: number, countPerPage: number) => {
    getResources(page, countPerPage);
    setPage(page);
    setCount(countPerPage);
  };

  const remove = async (name: string) => {
    console.log(name);
    if (window.confirm(`Are you sure you want to delete this Identity Resource: ${name}?`)) {
      await axios.delete(`/api/identity-resource/${name}`).then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
      })
      .catch(function (error) {
        if (error.response) {
          console.log('error');
          setResponse(error.response.data);
        }
      });
    }
  };

  // getResources(page, count);

  return (
    <div className="identity-resources">
      <StatusBar response={response} />
      <h2>Identity Resources</h2>
      <div className="identity-resources__container__options">
        <div className="identity-resources__container__button">
          <Link href={'/resource'}>
            <a className="identity-resources__button__new">
              <i className="icon__new"></i>
              Create new Identity Resource
            </a>
          </Link>
        </div>
      </div>
      <div className="client__container__table">
        <table className="identity-resources__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Display Name</th>
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource: IdentityResourcesDTO) => {
              return (
                <tr key={resource.name}>
                  <td>{resource.name}</td>
                  <td>{resource.displayName}</td>
                  <td className="identity-resources__table__button">
                    <button
                      className="identity-resources__button__edit"
                      onClick={() => edit(resource)}
                      title="Edit"
                    ><i className="icon__edit"></i><span>
                      Edit</span>
                    </button>
                  </td>
                  <td className="identity-resources__table__button">
                    <button
                      className="identity-resources__button__delete"
                      onClick={() => remove(resource.name)}
                      title="Delete"
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
        lastPage={lastPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}

