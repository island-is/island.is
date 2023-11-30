import {useFragment_experimental} from '@apollo/client';
import {blue400, dynamicColor, Header, Loader, Typography} from '@ui';
import React, {useEffect, useRef, useState} from 'react';
import {FormattedDate, useIntl} from 'react-intl';
import {Animated, Platform, StyleSheet, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {
  useNavigationButtonPress,
  useNavigationComponentDidAppear,
  useNavigationComponentDidDisappear,
} from 'react-native-navigation-hooks/dist';
import Pdf, {Source} from 'react-native-pdf';
import Share from 'react-native-share';
import WebView from 'react-native-webview';
import styled from 'styled-components/native';
import {client} from '../../graphql/client';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {authStore} from '../../stores/auth-store';
import {useOrganizationsStore} from '../../stores/organizations-store';
import {
  ButtonRegistry,
  ComponentRegistry,
} from '../../utils/component-registry';
import {
  Document,
  ListDocumentFragmentDoc,
  ListDocumentsDocument,
  useGetDocumentQuery,
} from '../../graphql/types/schema';
import {toggleAction} from '../../lib/post-mail-action';

const Host = styled.SafeAreaView`
  margin-left: 24px;
  margin-right: 24px;
`;

const Border = styled.View`
  height: 1px;
  background-color: ${dynamicColor(props => ({
    dark: props.theme.shades.dark.shade200,
    light: props.theme.color.blue100,
  }))};
`;

const PdfWrapper = styled.View`
  flex: 1;
  background-color: ${dynamicColor('background')};
`;

function getRightButtons({
  archived,
  bookmarked,
}: {
  archived?: boolean;
  bookmarked?: boolean;
} = {}) {
  return [
    {
      id: ButtonRegistry.ShareButton,
      icon: require('../../assets/icons/navbar-share.png'),
      color: blue400,
      accessibilityLabel: 'Share',
      iconBackground: {
        color: 'transparent',
        cornerRadius: 8,
        width: 32,
        height: 32,
      },
    },
    {
      id: ButtonRegistry.DocumentArchiveButton,
      icon: archived
        ? require('../../assets/icons/tray-filled.png')
        : require('../../assets/icons/tray.png'),
      color: blue400,
      accessibilityLabel: 'Archive',
      iconBackground: {
        color: 'transparent',
        cornerRadius: 8,
        width: 32,
        height: 32,
      },
    },
    {
      id: ButtonRegistry.DocumentStarButton,
      icon: bookmarked
        ? require('../../assets/icons/star-filled.png')
        : require('../../assets/icons/star.png'),
      color: blue400,
      accessibilityLabel: 'Star',
      iconBackground: {
        color: 'transparent',
        cornerRadius: 8,
        width: 32,
        height: 32,
      },
    },
  ];
}

const {useNavigationOptions, getNavigationOptions} =
  createNavigationOptionHooks(
    (theme, intl) => ({
      topBar: {
        title: {
          text: intl.formatMessage({id: 'documentDetail.screenTitle'}),
        },
        noBorder: true,
      },
    }),
    {
      bottomTabs: {
        visible: false,
      },
      topBar: {
        noBorder: true,
        rightButtons: getRightButtons(),
      },
    },
  );

interface PdfViewerProps {
  url: string;
  body: string;
  onLoaded: (path: string) => void;
  onError: (err: Error) => void;
}

const PdfViewer = React.memo(
  ({url, body, onLoaded, onError}: PdfViewerProps) => {
    const extraProps = {
      activityIndicatorProps: {
        color: '#0061ff',
        progressTintColor: '#ccdfff',
      },
    };

    return (
      <Pdf
        source={
          {
            uri: url,
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
            body,
            method: 'POST',
          } as Source
        }
        onLoadComplete={(_, filePath) => {
          onLoaded?.(filePath);
        }}
        onError={err => {
          onError?.(err as Error);
        }}
        trustAllCerts={Platform.select({android: false, ios: undefined})}
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
        {...extraProps}
      />
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.url === nextProps.url && prevProps.body === nextProps.body) {
      return true;
    }
    return false;
  },
);

export const DocumentDetailScreen: NavigationFunctionComponent<{
  docId: string;
}> = ({componentId, docId}) => {
  useNavigationOptions(componentId);
  const intl = useIntl();
  const {getOrganizationLogoUrl} = useOrganizationsStore();
  const [accessToken, setAccessToken] = useState<string>();
  const [error, setError] = useState(false);

  const doc = useFragment_experimental<Document>({
    fragment: ListDocumentFragmentDoc,
    from: {
      __typename: 'Document',
      id: docId,
    },
    returnPartialData: true,
  });

  const docRes = useGetDocumentQuery({
    client,
    variables: {
      input: {
        id: docId,
      },
    },
  });

  const Document = {
    ...(docRes.data?.getDocument || {}),
    ...doc.data,
  };

  useEffect(() => {
    if (doc.missing) {
      client.query({
        query: ListDocumentsDocument,
        variables: {
          input: {
            page: 1,
            pageSize: 50,
          },
        },
      });
    }
  }, [doc]);

  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [touched, setTouched] = useState(false);
  const hasPdf = Document.fileType?.toLocaleLowerCase() === 'pdf';
  const isHtml = typeof Document.html === 'string' && Document.html !== '';

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: getRightButtons({
          archived: doc.data?.archived ?? false,
          bookmarked: doc.data?.bookmarked ?? false,
        }),
      },
    });
  }, [componentId, doc.data]);

  useNavigationButtonPress(({buttonId}) => {
    if (buttonId === ButtonRegistry.DocumentArchiveButton) {
      toggleAction(
        Document.archived ? 'unarchive' : 'archive',
        Document.id!,
        // true,
      );
      setTouched(true);
    }
    if (buttonId === ButtonRegistry.DocumentStarButton) {
      toggleAction(
        Document.bookmarked ? 'unbookmark' : 'bookmark',
        Document.id!,
        // true,
      );
      setTouched(true);
    }
    if (buttonId === ButtonRegistry.ShareButton) {
      if (Platform.OS === 'android') {
        authStore.setState({noLockScreenUntilNextAppStateActive: true});
      }
      Share.open({
        title: Document.subject!,
        subject: Document.subject!,
        message: `${Document.senderName!} \n ${Document.subject!}`,
        type: hasPdf ? 'application/pdf' : undefined,
        url: hasPdf ? `file://${pdfUrl}` : Document.url!,
      });
    }
  }, componentId);

  useNavigationComponentDidAppear(() => {
    setVisible(true);
  });

  useNavigationComponentDidDisappear(() => {
    setVisible(false);
    if (hasPdf) {
      setLoaded(false);
    }
    if (touched) {
      Navigation.updateProps(ComponentRegistry.InboxScreen, {
        refresh: Math.random(),
      });
    }
  });

  useEffect(() => {
    // Lets mark the document as read
    client.cache.modify({
      id: client.cache.identify({
        __typename: 'Document',
        id: Document.id,
      }),
      fields: {
        opened: () => true,
      },
    });
  }, [Document.id]);

  useEffect(() => {
    const {authorizeResult, refresh} = authStore.getState();
    const isExpired =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      new Date(authorizeResult!.accessTokenExpirationDate!).getTime() <
      Date.now();
    if (isExpired) {
      refresh().then(() => {
        setAccessToken(authStore.getState().authorizeResult?.accessToken);
      });
    } else {
      setAccessToken(authorizeResult?.accessToken);
    }
  }, []);

  const loading = docRes.loading || !accessToken;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (loaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loaded]);

  return (
    <>
      <Host>
        <Header
          title={Document.senderName}
          date={<FormattedDate value={Document.date} />}
          message={Document.subject}
          isLoading={loading}
          hasBorder={false}
          logo={getOrganizationLogoUrl(Document.senderName!, 75)}
        />
      </Host>
      <Border />
      <View
        style={{
          flex: 1,
        }}>
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
          }}>
          {isHtml ? (
            <WebView
              source={{html: Document.html ?? ''}}
              scalesPageToFit
              onLoadEnd={() => {
                setLoaded(true);
              }}
            />
          ) : hasPdf ? (
            <PdfWrapper>
              {visible && accessToken && (
                <PdfViewer
                  url={Document.url ?? ''}
                  body={`documentId=${Document.id}&__accessToken=${accessToken}`}
                  onLoaded={(filePath: any) => {
                    setPdfUrl(filePath);
                    setLoaded(true);
                  }}
                  onError={() => {
                    setLoaded(true);
                    setError(true);
                  }}
                />
              )}
            </PdfWrapper>
          ) : (
            <WebView
              source={{uri: Document.url!}}
              onLoadEnd={() => {
                setLoaded(true);
              }}
            />
          )}
        </Animated.View>

        {(!loaded || !accessToken || error) && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                alignItems: 'center',
                justifyContent: 'center',
                maxHeight: 300,
              },
            ]}>
            {error ? (
              <Typography>
                {intl.formatMessage({id: 'licenseScanDetail.errorUnknown'})}
              </Typography>
            ) : (
              <Loader
                text={intl.formatMessage({id: 'documentDetail.loadingText'})}
              />
            )}
          </View>
        )}
      </View>
    </>
  );
};

DocumentDetailScreen.options = getNavigationOptions;
