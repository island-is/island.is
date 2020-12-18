import APIResponse from './../../entities/common/APIResponse'
import { ApiScopesDTO } from './../../entities/dtos/api-scopes-dto';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ResourceListDisplay from './components/ListDisplay';

export default function ApiScopeList() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const [apiScopes, setApiScopes] = useState<ApiScopesDTO[]>([]);
  const [totalCount, setTotalCount] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    getResources(page, count);
  }, [page, count]);

  const edit = (apiScope: ApiScopesDTO) => {
    router.push('resource/edit/api-scope/' + apiScope.name)
  };

  const getResources = async (page: number, count: number) => {
    await axios
      .get(`/api/api-scopes?page=${page}&count=${count}`)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);

        setApiScopes(response.data.rows);
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
      window.confirm(`Are you sure you want to delete this Api scope: ${name}?`)
    ) {
        await axios
          .delete(`/api/api-scope/${name}`)
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
      list={apiScopes}
      header={'Api scopes'}
      linkHeader={'Create new Api scope'}
      createUri={'/resource/api-scope'}
      lastPage={lastPage}
      handlePageChange={handlePageChange}
      edit={edit}
      remove={remove}
    ></ResourceListDisplay>
  );
}


