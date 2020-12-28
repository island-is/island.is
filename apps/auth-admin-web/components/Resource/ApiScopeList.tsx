import React from 'react';
import { ApiScopesDTO } from './../../entities/dtos/api-scopes-dto';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ResourceListDisplay from './components/ListDisplay';
import { ResourcesService } from './../../services/ResourcesService';
import { ApiScope } from './../../entities/models/api-scope.model';
import ConfirmModal from './../Common/ConfirmModal';

export default function ApiScopeList() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [apiScopes, setApiScopes] = useState<ApiScope[]>([]);
  const [totalCount, setTotalCount] = useState(30);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [scopeToRemove, setScopeToRemove] = React.useState('');

  useEffect(() => {
    getResources(page, count);
  }, [page, count]);

  const edit = (apiScope: ApiScopesDTO) => {
    router.push('resource/edit/api-scope/' + apiScope.name);
  };

  const getResources = async (page: number, count: number) => {
    const response = await ResourcesService.findAndCountAllApiScopes(
      page,
      count
    );
    if (response) {
      setApiScopes(response.rows);
      setTotalCount(response.count);
      setLastPage(Math.ceil(totalCount / count));
    }
  };

  const handlePageChange = async (page: number, countPerPage: number) => {
    setPage(page);
    setCount(countPerPage);
  };

  const remove = async () => {
    const response = await ResourcesService.deleteApiScope(scopeToRemove);
    if (response) {
      getResources(page, count);
    }

    closeModal();
  };

  const confirmRemove = async (name: string) => {
    setScopeToRemove(name);
    setIsOpen(true);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to delete this Api scope: <span>{scopeToRemove}</span>
      </p>
    );
  };

  return (
    <div>
      <ResourceListDisplay
        list={apiScopes}
        header={'Api scopes'}
        linkHeader={'Create new Api scope'}
        createUri={'/resource/api-scope'}
        lastPage={lastPage}
        handlePageChange={handlePageChange}
        edit={edit}
        remove={confirmRemove}
      ></ResourceListDisplay>
      <ConfirmModal
        modalIsOpen={modalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeModal}
        confirmation={remove}
        confirmationText="Delete"
      ></ConfirmModal>
    </div>
  );
}
