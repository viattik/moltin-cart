import React, { Component } from 'react';
import toBe from 'prop-types';
import Select from 'react-select';
import _ from 'lodash/fp';

import './cart-product.scss';

import { getFormattedPrice } from 'utils/formatters';
import IconLink from '../icon-link';

class CartProduct extends Component {
  static propTypes = {
    item: toBe.object,
    stockLevel: toBe.number,
    mainImageLink: toBe.string,
    onQtyChange: toBe.func,
    onRemove: toBe.func,
    isLoading: toBe.bool,
  };

  static defaultProps = {
    onQtyChange: () => {},
    onRemove: () => {},
    item: {},
    stockLevel: 0,
    mainImageLink: '',
    isLoading: false,
  };

  constructor() {
    super();
    this.onQtyChange = this.onQtyChange.bind(this);
  }

  onQtyChange(payload) {
    this.props.onQtyChange(payload.value);
  }

  render() {
    const { stockLevel, item, isLoading, mainImageLink } = this.props;
    const options = _.times(
      (i) => ({
        value: i + 1,
        label: i + 1,
      }),
      stockLevel
    );
    return (
      <tr className="cart-product">
        <td className="-item">
          <div className="item-wrapper">
            <div className="item-img">
              <img src={mainImageLink} />
            </div>
            <div>
              <div className="item-name">{item.name}</div>
              <div className="item-description">{item.description}</div>
            </div>
          </div>
        </td>
        <td className="-price">{getFormattedPrice(item.unit_price.amount)}</td>
        <td className="-qty">
          <Select
            name="form-field-name"
            value={item.quantity}
            onChange={this.onQtyChange}
            clearable={false}
            searchable={false}
            options={options}
            disabled={isLoading}
          />
        </td>
        <td className="-total">{getFormattedPrice(item.value.amount)}</td>
        <td className="-remove">
          <IconLink
            icon="remove-from-cart"
            disabled={isLoading}
            onClick={this.props.onRemove}
          />
        </td>
      </tr>
    );
  }
}

export default CartProduct;
