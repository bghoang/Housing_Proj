import React, { FunctionComponent, useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { reduxNextWrapper } from '@redux';
import Login from '@components/Login';
import '../assets/scss/global/index.scss';
import Layout from '@components/Layout';
import TagManager from 'react-gtm-module';

const App: FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  const tagManagerArgs = {
    gtmId: 'GTM-KRRW5N3',
    dataLayer: {
      page: 'home',
    },
  };

  useEffect(() => {
    TagManager.initialize(tagManagerArgs);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Homehub</title>
      </Head>

      <Login />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default reduxNextWrapper.withRedux(App);
