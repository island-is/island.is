import {gql} from '@apollo/client';

export const NotificationFragment = gql`
  fragment NotificationFragment on Notification {
    id
    serviceProvider
    date
    title
    message
    actions {
      id
      text
      link
    }
    link
  }
`;

export interface INotification {
  id: string;
  serviceProvider: string;
  date: string;
  title: string;
  message: string;
  actions: Array<{
    id: string;
    text: string;
    link: string;
  }>;
  link?: string;
}
