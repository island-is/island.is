import APIResponse from 'apps/auth-admin-web/models/common/APIResponse';
import { ApiResourcesDTO } from 'apps/auth-admin-web/models/dtos/api-resources-dto';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceListDisplay from './components/ListDisplay';

export default function ApiResourcesList() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const [apiResources, setApiResources] = useState<ApiResourcesDTO[]>([]);
  const [totalCount, setTotalCount] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    getResources(page, count);
  }, [page, count]);

  const edit = (apiResource: ApiResourcesDTO) => {
    router.push('resource/edit/api-resource/' + apiResource.name)
  };

  const handlePageChange = async (page: number, countPerPage: number) => {
    setPage(page);
    setCount(countPerPage);
  };

  const remove = async (name: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete this Api resource: ${name}?`
      )
    ) {
      await axios
        .delete(`/api/api-resource/${name}`)
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

  const getResources = async (page: number, count: number) => {
    await axios
      .get(`/api/api-resources?page=${page}&count=${count}`)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);

        setApiResources(response.data.rows);
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

  return (
    <ResourceListDisplay
      list={apiResources}
      header={'Api resource'}
      linkHeader={'Create new Api resource'}
      createUri={'/resource/api-resource'}
      lastPage={lastPage}
      handlePageChange={handlePageChange}
      edit={edit}
      remove={remove}
    ></ResourceListDisplay>
  );
}
