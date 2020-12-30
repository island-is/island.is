import React, { useState, useEffect } from 'react';
import IdentityResourcesDTO from '../../../entities/dtos/identity-resources.dto';
import { useRouter } from 'next/router';
import ResourceListDisplay from './ListDisplay';
import { ResourcesService } from '../../../services/ResourcesService';
import ConfirmModal from '../../Common/ConfirmModal';

export default function IdentityResourcesList() {
  const [count, setCount] = useState(1);
  const [page, setPage] = useState(1);
  const [resources, setResources] = useState<IdentityResourcesDTO[]>([]);
  const [totalCount, setTotalCount] = useState(30);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [resourceToRemove, setResourceToRemove] = React.useState('');

  useEffect(() => {
    getResources(page, count);
  }, [page, count]);

  const edit = (resource: IdentityResourcesDTO) => {
    router.push('/resource/edit/identity-resource/' + resource.name);
  };

  const getResources = async (page: number, count: number) => {
    const response = await ResourcesService.findAndCountAllIdentityResources(
      page,
      count
    );
    if (response) {
      setResources(response.rows);
      setTotalCount(response.count);
      setLastPage(Math.ceil(totalCount / count));
    }
  };

  const handlePageChange = async (page: number, countPerPage: number) => {
    setPage(page);
    setCount(countPerPage);
  };

  const remove = async () => {
    const response = await ResourcesService.deleteIdentityResource(
      resourceToRemove
    );
    if (response) {
      getResources(page, count);
    }

    closeModal();
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
        Are you sure want to delete this Identity resource:{' '}
        <span>{resourceToRemove}</span>
      </p>
    );
  };

  return (
    <div>
      <ResourceListDisplay
        list={resources}
        header={'Identity resources'}
        linkHeader={'Create new Identity Resource'}
        createUri={'/resource/identity-resource'}
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
