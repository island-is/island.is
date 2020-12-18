import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import IdentityResourcesDTO from '../../entities/dtos/identity-resources.dto';
import axios from 'axios';
import Paginator from '../Common/Paginator';
// import StatusBar from '../StatusBar';
import { useRouter } from 'next/router';
import APIResponse from './../../entities/common/APIResponse'
import ResourceListDisplay from './components/ListDisplay';

export default function IdentityResourcesList() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const [resources, setResources] = useState<IdentityResourcesDTO[]>([]);
  const [totalCount, setTotalCount] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    getResources(page, count);
  }, [page, count]);

  const edit = (resource: IdentityResourcesDTO) => {
    router.push('/resource/edit/identity-resource/' + resource.name)
  };

  const getResources = async (page: number, count: number) => {
    await axios
      .get(`/api/identity-resources?page=${page}&count=${count}`)
      .then((response) => {
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
        } else {
          const apiError = new APIResponse();
          apiError.message = [error];
          setResponse(apiError);
        }
      });
  };

  const handlePageChange = async (page: number, countPerPage: number) => {
    setPage(page);
    setCount(countPerPage);
  };

  const remove = async (name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete this Identity Resource: ${name}?`
      )
    ) {
      await axios
        .delete(`/api/identity-resource/${name}`)
        .then((response) => {
          const res = new APIResponse();
          res.statusCode = response.request.status;
          res.message = response.request.statusText;
          setResponse(res);
          getResources(page, count);
        })
        .catch(function (error) {
          if (error.response) {
            setResponse(error.response.data);
          }
        });
    }
  };

  return (
    <ResourceListDisplay
      list={resources}
      header={'Identity resources'}
      linkHeader={'Create new Identity Resource'}
      createUri={'/resource/identity-resource'}
      lastPage={lastPage}
      handlePageChange={handlePageChange}
      edit={edit}
      remove={remove}
    ></ResourceListDisplay>
  );
}
