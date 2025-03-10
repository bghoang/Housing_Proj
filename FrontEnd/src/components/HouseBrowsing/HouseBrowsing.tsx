import React, { FunctionComponent, useEffect } from 'react';
import Header from './Header';
import { Body2 } from '@basics';
import HouseCardList from '@components/HouseCardList';

const Housing: FunctionComponent = () => {
  return (
    <>
      <div className="px-md-0 pb-5 px-3">
        <Header />
      </div>

      <div className="px-md-0 px-3 pb-3">
        <Body2>
          Posts are arranged by earliest to latest <b>available time</b>{' '}
        </Body2>
      </div>

      <div>
        <HouseCardList />
      </div>
    </>
  );
};

export default Housing;
