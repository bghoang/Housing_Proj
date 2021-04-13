import React, { FunctionComponent } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import * as z from 'zod';
import { WizardFormStep, Input } from '@basics';
import { miscIcons } from '@icons';
import styles from './FilterForm.module.scss';

export const page3Schema = z
  .object({
    minPrice: z.number().positive('Make sure price is positive.'),
    maxPrice: z
      .number()
      .positive('Make sure price is positive.')
      .max(5000, 'This is unrealistic for a college student!'),
  })
  .refine((vals) => vals.minPrice <= vals.maxPrice, {
    message: 'Minimum price cannot be larger than maximum price!',
    path: ['minPrice', 'maxPrice'],
  });

export type Page3Store = z.infer<typeof page3Schema>;

export const page3InitialStore: Page3Store = {
  minPrice: 1,
  maxPrice: 5000,
};

const FilterPage3: FunctionComponent<WizardFormStep<Page3Store>> = ({
  minPrice,
  maxPrice,
  validations,
  setStore,
}) => {
  return (
    <Container>
      <Row className={styles.title}>Price Range</Row>

      <br />

      <Form.Row className="m-2">
        <Col>
          <Form inline className="justify-content-center">
            <Form.Label className={`${styles.word} m-2`}>$</Form.Label>
            <Input
              value={minPrice}
              type="number"
              onChange={(e) =>
                setStore({
                  minPrice: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              className={`${styles.shortInput} m-2 mr-5`}
              isValid={validations?.minPrice?.success}
              isInvalid={
                validations?.minPrice && !validations?.minPrice?.success
              }
            />
            <miscIcons.dash />
            <Form.Label className={`${styles.word} m-2 ml-5`}>$</Form.Label>
            <Input
              value={maxPrice}
              type="number"
              onChange={(e) =>
                setStore({
                  maxPrice: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              className={`${styles.shortInput} m-2`}
              isValid={validations?.maxPrice?.success}
              isInvalid={
                validations?.maxPrice && !validations?.maxPrice?.success
              }
              errorClassName="d-none"
            />
          </Form>
        </Col>
      </Form.Row>
    </Container>
  );
};

export default FilterPage3 as FunctionComponent;
