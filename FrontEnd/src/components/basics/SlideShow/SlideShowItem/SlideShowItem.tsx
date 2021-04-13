import React, { FunctionComponent } from 'react';
import { CarouselItem, CarouselItemProps } from 'reactstrap';
import cn from 'classnames';
import Image from '../../FilledImage/FilledImage';
import styles from './SlideShowItem.module.scss';

interface SlideShowItemProps extends CarouselItemProps {
  src: string;
  alt: string;
  onClick?: () => any;
}

const SlideShowItem: FunctionComponent<SlideShowItemProps> = ({
  src,
  alt,
  onClick,
  className,
  ...carouselItemProps
}) => {
  const imageElement = <Image src={src} alt={alt} />;

  return (
    <CarouselItem
      {...carouselItemProps}
      key={src}
      className={cn(styles.item, className)}
    >
      {onClick ? (
        <button
          className="no-show w-100 h-100"
          type="button"
          onClick={onClick}
          onKeyDown={({ key }) => key === 'Enter' && onClick()}
        >
          {imageElement}
        </button>
      ) : (
        imageElement
      )}
    </CarouselItem>
  );
};

export default SlideShowItem;
