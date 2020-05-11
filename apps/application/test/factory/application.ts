import application from '@island.is/application/api/domains/applications/model';

const data = async (props = {}) => {
  const defaultProps = {}
  return Object.assign({}, defaultProps, props);
};

export default async (props = {}) =>
  application.create(await data(props));
