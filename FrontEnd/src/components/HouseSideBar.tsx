import React from 'react';
import Button from 'react-bootstrap/Button';
import TV from './TV';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/auth';
import BookmarksList from './BookmarksList';

type ButtonOnClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => any;
interface HouseSideBarProps {
  onLoginClick?: ButtonOnClick;
  onPostClick?: ButtonOnClick;
}

const HouseSideBar: React.FC<HouseSideBarProps> = ({
  onLoginClick,
  onPostClick,
}) => {
  const user = useSelector(selectUser);
  console.log('here in houseside bar');

  return (
    <div className="house-sidebar-container">
      <TV>
        {!user ? (
          <>
            <Button variant="secondary" onClick={onLoginClick}>
              Sign in to post
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onPostClick}>
              Post here
            </Button>
          </>
        )}
      </TV>

      <div className="house-sidebar-bookmarks-container">
        <BookmarksList />
      </div>
    </div>
  );
};

export default HouseSideBar;
