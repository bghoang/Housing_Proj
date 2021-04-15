import React, { FunctionComponent } from 'react';
import * as z from 'zod';
import { largeAmenitiesIcons, amenitiesTranslations } from '@icons';
import { WizardFormStep, ToggleGroup } from '@basics';
import styles from './HousingPostForm.module.scss';

// TODO this should be in a different file
type Amenity = keyof typeof largeAmenitiesIcons;

export const page3Schema = z.object({
  amenities: z.string().array(),
});

export type Page3Store = z.infer<typeof page3Schema>;

export const page3InitialStore: Page3Store = {
  amenities: [],
};

const PostPage3: FunctionComponent<WizardFormStep<Page3Store>> = ({
  amenities,
  setStore,
}) => {
  return (
    <ToggleGroup
      toggleClassName={styles.amenitiesToggle}
      label="Please select all the amenities your place offers."
      content={(Object.keys(largeAmenitiesIcons) as [Amenity]).map((key) => ({
        label: amenitiesTranslations[key],
        icon: largeAmenitiesIcons[key],
      }))}
      initialSelected={amenities}
      onSelect={({ label, selected }) => {
        if (selected) {
          setStore({ amenities: amenities ? [...amenities, label] : [label] });
        } else {
          setStore({
            amenities: amenities?.filter((amenity) => amenity !== label),
          });
        }
      }}
      center
    />
  );
};

export default PostPage3 as FunctionComponent;
