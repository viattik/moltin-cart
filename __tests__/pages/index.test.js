/* eslint-env jest */

import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';

import Index from 'pages/index.js';

describe('Index Page', () => {
  it('Index shows cart and list without data', () => {
    const component = renderer.create(<Index />);
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
