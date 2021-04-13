import React, { useState, FunctionComponent } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'react-bootstrap/Image';
import { SchoolYear, majors, BackendMapping } from '../../constants';
import { Dropdown, Input, ToggleGroup } from '@basics';
import { miscIcons, profileIcons } from '@icons';
import {
  selectUser,
  selectUserDraft,
  setUserDraft,
  logout,
  editProfile,
} from '@redux';
import { User, dummyUser } from '../../models/User';
import styles from './ProfileModal.module.scss';
import cn from 'classnames';

interface PathProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

const phoneFormat = (phone: string, previousPhone: string) => {
  const phoneRegex = /\d+/;
  const charArray = [];
  const limit = 14;
  let i;
  for (i = 0; i < Math.min(phone.length, limit); i++) {
    if (phone[i].match(phoneRegex)) {
      charArray.push(phone[i]);
    }
  }
  if (
    previousPhone.length > phone.length && // if it is a delete operation
    phone.length > 0 && // if it is non empty
    !previousPhone[previousPhone.length - 1].match(phoneRegex)
  ) {
    charArray.pop();
  }
  const bracket = charArray.length >= 3;
  const space = charArray.length > 3;
  const horizontal = charArray.length > 6;
  if (horizontal) {
    charArray.splice(6, 0, '-');
  }
  if (space) {
    charArray.splice(3, 0, ' ');
  }
  if (bracket) {
    charArray.splice(0, 0, '(');
    charArray.splice(4, 0, ')');
  }
  return charArray.join('');
};

// Will only be called during confirmation

const generateUpdates = (original: User, draft: User) => {
  const updatePairs: { [k: string]: any } = {};
  const updateKeys = (Object.keys(original) as Array<keyof User>).filter(
    (key) => original[key] !== draft[key],
  );
  updateKeys.forEach((key) => {
    if (Object.keys(BackendMapping).includes(key)) {
      updatePairs[BackendMapping[key] as string] = draft[key];
    } else {
      updatePairs[key] = draft[key];
    }
  });
  return updatePairs;
};

// use this before implementing pulling user-created posts from BE
const dummyPosts = [
  {
    name: 'Const Verde Village',
    roomType: 'Single',
    price: '$800',
  },
];

const ProfileModal: FunctionComponent<PathProps> = ({ show, setShow }) => {
  const userSelected = useSelector(selectUser) || dummyUser;
  const userSelectedDraft = useSelector(selectUserDraft) || dummyUser;
  const dispatch = useDispatch();
  const [activeIndicator, setactiveIndicator] = useState(true);
  const [editPosts, setEditPosts] = useState(false);
  return (
    <Modal
      dialogClassName={styles.modal}
      show={show}
      onHide={() => setShow(false)}
      centered
    >
      <div className="h-100 w-100">
        <Button
          variant="no-show"
          className={styles.profileCross}
          onClick={() => setShow(false)}
        >
          <miscIcons.orangeX />
        </Button>
        <Row className={`px-3 py-2 ${styles.topBar}`}>
          <div
            className={cn(styles.title, {
              [styles.profileSelected]: editPosts,
            })}
            onClick={() => setEditPosts(false)}
          >
            Profile
            {!editPosts && <div className={styles.element}>_____</div>}
          </div>
          <div className={`${styles.divider} mx-5`}>|</div>
          <span
            className={cn(styles.title, {
              [styles.profileSelected]: editPosts,
            })}
            onClick={() => setEditPosts(true)}
          >
            Manage my posts
            {editPosts && <div className={styles.element}>_____________</div>}
          </span>
        </Row>
        <div className={`my-4 px-4 ${styles.middleSection}`}>
          <Container fluid className="h-100">
            <Row className="h-100">
              <Col md={4} className="align-self-center">
                <div className={styles.profileWrap}>
                  <Image
                    src={`https://houseit.s3.us-east-2.amazonaws.com/${userSelectedDraft.profilePhoto}`} // TODO shouldnt use constant for the src
                    roundedCircle
                    className={styles.icon}
                  />
                </div>
                <div className={styles.name}>{userSelectedDraft.name}</div>
                <div className={styles.verified}>
                  <profileIcons.tickMark />
                  UCSD Email Verified
                </div>
                <div className={styles.profileWrap}>
                  <Button
                    className={styles.signOut}
                    variant="no-show"
                    onClick={() => {
                      dispatch(logout());
                      setShow(false);
                    }}
                  >
                    Log Out
                  </Button>
                </div>
                <div
                  className={`mt-5 ${styles.editWrap} ${styles.profileWrap}`}
                >
                  {activeIndicator ? (
                    <Button
                      variant="secondary"
                      onClick={() => setactiveIndicator(false)}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div>
                      <div>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            const updates = generateUpdates(
                              userSelected,
                              userSelectedDraft,
                            );
                            // if nothing changes upon confirm, no need to send to backend
                            if (
                              !(
                                Object.keys(updates).length === 0 &&
                                updates.constructor === Object
                              )
                            ) {
                              dispatch(
                                editProfile(
                                  userSelected.email,
                                  userSelectedDraft,
                                  generateUpdates(
                                    userSelected,
                                    userSelectedDraft,
                                  ),
                                  setactiveIndicator,
                                ),
                              );
                            } else {
                              setactiveIndicator(true);
                            }
                            // TODO: display error if fails at backend
                          }}
                        >
                          Confirm
                        </Button>
                      </div>
                      <div className={`mt-1 ${styles.profileWrap}`}>
                        <Button
                          className={styles.cancel}
                          variant="no-show"
                          onClick={() => {
                            setactiveIndicator(true);
                            dispatch(setUserDraft(userSelected));
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Col>
              <Col md={8} className={cn({ [styles.postsList]: editPosts })}>
                {!editPosts ? (
                  <>
                    <Form.Row className="justify-content-center m-2">
                      <Form.Group as={Col} controlId="profileEmail">
                        <Form.Label className={styles.label}>
                          School Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          disabled
                          value={userSelectedDraft.email}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="profilePhone">
                        <Form.Label className={styles.label}>Phone</Form.Label>
                        <Form.Control
                          readOnly={activeIndicator}
                          type="text"
                          value={userSelectedDraft.phone}
                          onChange={(event) => {
                            console.log(userSelected, 'hello');
                            const previousPhone = userSelectedDraft.phone;
                            dispatch(
                              setUserDraft({
                                ...userSelectedDraft,
                                phone: phoneFormat(
                                  event.target.value,
                                  previousPhone,
                                ),
                              }),
                            );
                          }}
                        />
                      </Form.Group>
                    </Form.Row>
                    {/* tenary form for toggle group and display as a string */}
                    <Form.Row className="m-2 px-0">
                      <Form.Group as={Col} controlId="profileSchoolYear">
                        <Form.Label className={styles.label}>
                          School Year
                        </Form.Label>
                        <Form.Row className={`pl-1 ${styles.schoolYear}`}>
                          {!activeIndicator ? (
                            <ToggleGroup
                              singleSelect
                              content={Object.values(SchoolYear)}
                              initialSelected={userSelectedDraft.schoolYear}
                              onSelect={({ label }) => {
                                dispatch(
                                  setUserDraft({
                                    ...userSelectedDraft,
                                    schoolYear: label as SchoolYear,
                                  }),
                                );
                              }}
                            />
                          ) : (
                            <Input
                              type="text"
                              value={userSelectedDraft.schoolYear}
                              readOnly
                              placeholder="School Year"
                            />
                          )}
                        </Form.Row>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row className="m-2">
                      <Form.Group as={Col} controlId="profileMajor">
                        <Form.Label className={styles.label}>Major</Form.Label>
                        {!activeIndicator ? (
                          <Dropdown
                            options={majors}
                            label=""
                            onSelect={(s) =>
                              dispatch(
                                setUserDraft({
                                  ...userSelectedDraft,
                                  major: s || userSelectedDraft.major,
                                }),
                              )
                            }
                            initialSelected={userSelectedDraft.major}
                            placeholder="Major"
                          />
                        ) : (
                          <Input
                            type="text"
                            value={userSelectedDraft.major}
                            readOnly
                            placeholder="Major"
                          />
                        )}
                      </Form.Group>
                    </Form.Row>
                    <Form.Row className="m-2">
                      <Form.Group as={Col} controlId="profileBio">
                        <Form.Label className={styles.bio}>
                          Tell us about yourself in a short bio
                        </Form.Label>
                        <Form.Control
                          readOnly={activeIndicator}
                          as="textarea"
                          className={styles.bioText}
                          type="text"
                          maxLength={600}
                          value={userSelectedDraft.description}
                          onChange={(event) =>
                            dispatch(
                              setUserDraft({
                                ...userSelectedDraft,
                                description: event.target.value,
                              }),
                            )
                          }
                        />
                        <span className={styles.charCheck}>
                          {userSelectedDraft.description.length}/600
                        </span>
                      </Form.Group>
                    </Form.Row>
                  </>
                ) : (
                  <>
                    {dummyPosts.length == 0 ? (
                      <div className={styles.noPostsText}>
                        You don't have any housing posts yet.
                        <br />
                        Are you looking for your Bookmarks instead?
                      </div>
                    ) : (
                      dummyPosts.map((post) => (
                        <div className={`m-2 ${styles.myPost}`}>
                          <Image
                            src="https://houseit.s3.us-east-2.amazonaws.com/test0.png"
                            className={styles.myPostPicture}
                          />

                          <div className={styles.myPostInfo}>
                            <div className={styles.myPostTitle}>
                              {post.name}
                            </div>
                            <div className={`${styles.myPostDetails} mt-1`}>
                              {post.roomType} | {post.price}
                            </div>

                            <div className={`mt-auto ${styles.myPostActions}`}>
                              <Button variant="secondary" className="w-90">
                                Mark as occupied
                              </Button>

                              <div className={`ml-auto ${styles.myPostEdit}`}>
                                Edit this post
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;
