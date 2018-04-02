import React, { Component } from 'react';
import toBe from 'prop-types';

import './index.scss';
import { getMainImageLinkFromItem, getPriceFromItem } from 'modules/products';
import IconLink from 'components/icon-link';
import { getFormattedPrice } from 'utils/formatters';

class Product extends Component {
  static propTypes = {
    data: toBe.object,
    onAdd: toBe.func,
    disabledAdd: toBe.bool,
    itemsLeft: toBe.number,
  };

  static defaultProps = {
    onAdd: () => {},
    disabledAdd: false,
    itemsLeft: 0,
  };

  render() {
    const { data, disabledAdd, itemsLeft } = this.props;
    return (
      <div className="product">
        <div className="product-img">
          <img src={getMainImageLinkFromItem(data)} />
        </div>
        <div className="product-name">{data.name}</div>
        <div className="product-description">{data.description}</div>
        <div className="product-price">
          {itemsLeft}
          {' left at '}
          <span>{getFormattedPrice(getPriceFromItem(data))}</span>
        </div>
        <div className="product-add">
          <IconLink
            disabled={disabledAdd}
            icon="add-to-cart"
            onClick={this.props.onAdd}
          >
            {disabledAdd ? 'None left' : 'Add To Cart'}
          </IconLink>
        </div>
      </div>
    );
  }
}

export default Product;
