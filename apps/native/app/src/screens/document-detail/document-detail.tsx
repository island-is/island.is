import {useQuery} from '@apollo/client';
import {dynamicColor, Header, Loader, Typography} from '@ui';
import React, {useEffect, useRef, useState} from 'react';
import {FormattedDate, useIntl} from 'react-intl';
import {Animated, Platform, StyleSheet, View} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
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
import {
  GetDocumentResponse,
  GET_DOCUMENT_QUERY,
} from '../../graphql/queries/get-document.query';
import {LIST_DOCUMENTS_QUERY} from '../../graphql/queries/list-documents.query';
import {createNavigationOptionHooks} from '../../hooks/create-navigation-option-hooks';
import {authStore} from '../../stores/auth-store';
import {inboxStore} from '../../stores/inbox-store';
import {useOrganizationsStore} from '../../stores/organizations-store';
import {ButtonRegistry} from '../../utils/component-registry';
import {Query} from 'src/graphql/types/schema';

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
        rightButtons: [
          {
            id: ButtonRegistry.ShareButton,
            icon: require('../../assets/icons/navbar-share.png'),
            accessibilityLabel: 'Share',
          },
        ],
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

  const res = useQuery<Query>(LIST_DOCUMENTS_QUERY, {
    client,
  });
  const docRes = useQuery<GetDocumentResponse>(GET_DOCUMENT_QUERY, {
    client,
    variables: {
      input: {
        id: docId,
      },
    },
  });
  const Document = {
    ...(docRes.data?.getDocument || {}),
    ...(res.data?.listDocumentsV2?.data?.find(d => d.id === docId) || {}),
  };

  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const hasPdf = Document.fileType === 'pdf';
  const isHtml = typeof Document.html === 'string' && Document.html !== '';

  useNavigationButtonPress(
    e => {
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
    },
    componentId,
    ButtonRegistry.ShareButton,
  );

  useNavigationComponentDidAppear(() => {
    setVisible(true);
  });

  useNavigationComponentDidDisappear(() => {
    setVisible(false);
    if (hasPdf) {
      setLoaded(false);
    }
  });

  useEffect(() => {
    if (Document.id) {
      inboxStore.getState().actions.setRead(Document.id);
    }
  }, [res.data]);

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

  const loading = res.loading || !accessToken;

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
