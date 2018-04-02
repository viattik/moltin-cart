/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import _ from 'lodash/fp';

import CartProduct from 'components/cart/cart-product';

describe('<CartProduct />', () => {
  it('Cart renders with an item', () => {
    const component = renderer.create(
      <CartProduct
        item={{
          name: 'Test name',
          description: 'Test desc',
          unit_price: { amount: 1000 },
          value: { amount: 1000 },
          quantity: 1,
        }}
        stockLevel={2}
        mainImageLink="img.png"
        onQtyChange={_.noop}
        onRemove={_.noop}
        isLoading={false}
      />
    );
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
