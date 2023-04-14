import {gql} from '@apollo/client';
import {INotification} from '../fragments/notification.fragment';

export const GET_NOTIFICATION_QUERY = gql`
  query getNotification($id: ID!) {
    Notification(id: $id) @client {
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
  }
`;

export interface GetNotificationResponse {
  Notification?: INotification;
}
