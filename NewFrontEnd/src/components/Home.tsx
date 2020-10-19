import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useCookies } from 'react-cookie';
import HousingList from './HouseCardList';
import Filter from './Filter';
import TV from './TV';
import Login from './Login';
import HousingPost from './HousingPostForm';

const Home: React.FC = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [showHousingPost, setShowHousingPost] = useState<boolean>(false);
  const handleCloseHousingPost = () => setShowHousingPost(false);
  const handleShowHousingPost = () => setShowHousingPost(true);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  return (
    <Container>
      <Login show={showLogin} handleClose={handleCloseLogin} />
      <HousingPost show={showHousingPost} setShow={setShowHousingPost} />

      <Row>
        <Col md={{ span: 8, offset: 1 }}>
          <Filter />
        </Col>

        <Col md={3}>
          <TV>
            {cookies.user === undefined ? (
              <>
                <div className="secondary-title mt-3">Hello</div>
                <div className="tv-separator" />
                <Button onClick={handleShowLogin}>Sign in to post</Button>
              </>
            ) : (
              <>
                <Button onClick={handleShowHousingPost}>Post house info</Button>
                <Button>Post a request</Button>
              </>
            )}
          </TV>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 8, offset: 1 }}>
          <HousingList />
        </Col>

        <Col md={3}>Favorites go here let's go</Col>
      </Row>
    </Container>
  );
};

export default Home;
