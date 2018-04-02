/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import _ from 'lodash/fp';

import { Cart } from 'components/cart';

describe('<Cart />', () => {
  it('Cart renders without data', () => {
    const component = renderer.create(
      <Cart
        expandCart={_.noop}
        collapseCart={_.noop}
        updateQty={_.noop}
        deleteItem={_.noop}
        clearCart={_.noop}
      />
    );
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
