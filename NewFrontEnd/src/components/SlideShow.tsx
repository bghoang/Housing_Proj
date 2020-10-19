import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { AtLeastOne } from '../assets/utils';

interface SlideShowItem {
  src: string;
  alt: string;
}

export const testSlideShow: AtLeastOne<SlideShowItem> = [
  {
    src:
      'https://cdn.vox-cdn.com/thumbor/op7DSI_UdWcXSbVGqA4wKYc2v3E=/0x0:1800x1179/1200x800/filters:focal(676x269:964x557)/cdn.vox-cdn.com/uploads/chorus_image/image/66741310/3zlqxf_copy.0.jpg',
    alt: 'First slide',
  },
  {
    src:
      'https://i.pinimg.com/474x/98/d2/90/98d2901d829bb21263e099e3fe4701e7.jpg',
    alt: 'Second slide',
  },
  {
    src:
      'https://couriernewsroom.com/wp-content/uploads/sites/2/2020/06/coronavirus-memes-this-is-fine-1200x720.jpg',
    alt: 'Third slide',
  },
];

interface PathProps {
  images: AtLeastOne<SlideShowItem>;
  onImageClick: () => void;
}

const SlideShow: React.FC<PathProps> = ({ images, onImageClick }) => {
  return (
    <Carousel interval={null}>
      {images.map((image) => (
        <Carousel.Item>
          <button
            className="no-show w-100 h-100"
            type="button"
            onClick={onImageClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onImageClick();
            }}
          >
            <img
              className="d-block w-100 h-100"
              src={image.src}
              alt={image.alt}
            />
          </button>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default SlideShow;
