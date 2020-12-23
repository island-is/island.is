import React from 'react';
import { ApiResourcesDTO } from './../../entities/dtos/api-resources-dto';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ResourceListDisplay from './components/ListDisplay';
import { ResourcesService } from './../../services/ResourcesService';
import { ApiResource } from './../../entities/models/api-resource.model';
import ConfirmModal from './../common/ConfirmModal';

export default function ApiResourcesList() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [apiResources, setApiResources] = useState<ApiResource[]>([]);
  const [totalCount, setTotalCount] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [resourceToRemove, setResourceToRemove] = React.useState('');

  useEffect(() => {
    getResources(page, count);
  }, [page, count]);

  const edit = (apiResource: ApiResourcesDTO) => {
    router.push('resource/edit/api-resource/' + apiResource.name);
  };

  const handlePageChange = async (page: number, countPerPage: number) => {
    setPage(page);
    setCount(countPerPage);
  };

  const remove = async () => {
    const response = await ResourcesService.deleteApiResource(resourceToRemove);
    if (response) {
      getResources(page, count);
    }

    closeModal();
  };

  const getResources = async (page: number, count: number) => {
    const response = await ResourcesService.findAndCountAllApiResources(
      page,
      count
    );
    if (response) {
      setApiResources(response.rows);
      setTotalCount(response.count);
      setLastPage(Math.ceil(totalCount / count));
    }
  };

  const confirmRemove = async (name: string) => {
    setResourceToRemove(name);
    setIsOpen(true);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to delete this Api resource:{' '}
        <span>{resourceToRemove}</span>
      </p>
    );
  };

  return (
    <div>
      <ResourceListDisplay
        list={apiResources}
        header={'Api resource'}
        linkHeader={'Create new Api resource'}
        createUri={'/resource/api-resource'}
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
