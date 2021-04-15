import React, { FunctionComponent } from 'react';
import { Container, Row, Form } from 'react-bootstrap';
import * as z from 'zod';
import { largeAmenitiesIcons, amenitiesTranslations } from '@icons';
import { WizardFormStep, ToggleGroup } from '@basics';
import styles from './FilterForm.module.scss';

type Amenity = keyof typeof largeAmenitiesIcons;

export const page5Schema = z.object({
  amenities: z.string().array(),
});

export type Page5Store = z.infer<typeof page5Schema>;

export const page5InitialStore: Page5Store = {
  amenities: [],
};

const FilterPage5: FunctionComponent<WizardFormStep<Page5Store>> = ({
  amenities,
  setStore,
}) => {
  return (
    <Container>
      <Row className={styles.title}>Amenities</Row>

      <Form.Row className="m-2">
        <ToggleGroup
          toggleClassName={styles.amenitiesToggle}
          content={(Object.keys(largeAmenitiesIcons) as [Amenity]).map(
            (key) => ({
              label: amenitiesTranslations[key],
              icon: largeAmenitiesIcons[key],
            }),
          )}
          initialSelected={amenities}
          onSelect={({ label, selected }) => {
            if (selected) {
              setStore({
                amenities: amenities ? [...amenities, label] : [label],
              });
            } else {
              setStore({
                amenities: amenities?.filter((amenity) => amenity !== label),
              });
            }
          }}
          center
        />
      </Form.Row>
    </Container>
  );
};

export default FilterPage5 as FunctionComponent;
