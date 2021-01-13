import React, { useState } from 'react';
import IdentityResourcesDTO from '../../../entities/dtos/identity-resources.dto';
import { useRouter } from 'next/router';
import ResourceListDisplay from './ListDisplay';
import { ResourcesService } from '../../../services/ResourcesService';
import ConfirmModal from '../../Common/ConfirmModal';

const IdentityResourcesList: React.FC = () => {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [resources, setResources] = useState<IdentityResourcesDTO[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [resourceToRemove, setResourceToRemove] = React.useState('');

  const edit = (resource: IdentityResourcesDTO) => {
    router.push(
      `/resource/identity-resource/${encodeURIComponent(resource.name)}`
    );
  };

  const getResources = async (page: number, count: number) => {
    const response = await ResourcesService.findAndCountAllIdentityResources(
      page,
      count
    );
    if (response) {
      const resourceArr = response.rows.sort((c1, c2) => {
        if (!c1.archived && !c2.archived) return 0;
        if (!c1.archived && c2.archived) return 1;
        if (c1.archived && !c2.archived) return -1;
        return 0;
      });
      setResources(resourceArr.reverse());
      setLastPage(Math.ceil(response.count / count));
    }
  };

  const handlePageChange = async (page: number, countPerPage: number) => {
    getResources(page, countPerPage);
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
        Are you sure want to archive this Identity resource:{' '}
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
        confirmationText="Archive"
      ></ConfirmModal>
    </div>
  );
};
export default IdentityResourcesList;
