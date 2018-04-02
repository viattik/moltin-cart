import React, { Component } from 'react';
import { connect } from 'react-redux';
import toBe from 'prop-types';
import classNames from 'classnames';
import CartProduct from './cart-product';
import mbind from 'memoize-bind';
import IconLink from 'components/icon-link';

import './index.scss';

import {
  expandCart,
  collapseCart,
  updateQty,
  deleteItem,
  clearCart,
} from 'modules/cart';
import { getStockLevelByItem, getMainImageLinkByItem } from 'modules/products';
import { getFormattedPrice } from 'utils/formatters';

const mapStateToProps = (state) => {
  const items = state.cart.items;
  const totalAmount = items.reduce((acc, item) => acc + item.quantity, 0);
  return {
    isExpanded: state.cart.isExpanded,
    items,
    totalPrice: state.cart.totalPrice,
    totalAmount,
    stockLevelByItem: getStockLevelByItem(state.products),
    mainImageLinksByItem: getMainImageLinkByItem(state.products),
    updatingItems: state.cart.updatingItems,
    deletingItems: state.cart.deletingItems,
    isClearing: state.cart.isClearing,
  };
};

const mapDispatchToProps = {
  expandCart,
  collapseCart,
  updateQty,
  deleteItem,
  clearCart,
};

export class Cart extends Component {
  static propTypes = {
    isExpanded: toBe.bool,
    expandCart: toBe.func.isRequired,
    collapseCart: toBe.func.isRequired,
    updateQty: toBe.func.isRequired,
    deleteItem: toBe.func.isRequired,
    clearCart: toBe.func.isRequired,
    items: toBe.array,
    totalPrice: toBe.number,
    totalAmount: toBe.number,
    stockLevelByItem: toBe.object,
    mainImageLinksByItem: toBe.object,
    updatingItems: toBe.array,
    deletingItems: toBe.array,
    isClearing: toBe.bool,
  };

  static defaultProps = {
    isExpanded: false,
    items: [],
    totalPrice: 0,
    totalAmount: 0,
    stockLevelByItem: {},
    mainImageLinksByItem: {},
    updatingItems: [],
    deletingItems: [],
    isClearing: false,
  };

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onClearCart = this.onClearCart.bind(this);
  }

  componentDidMount() {
    // const { id } = query;
    // store.dispatch(loadItem(id));
  }

  toggle() {
    const { isExpanded } = this.props;
    isExpanded ? this.props.collapseCart() : this.props.expandCart();
  }

  onItemQtyChange(id, value) {
    this.props.updateQty(id, value);
  }

  onItemRemove(id) {
    this.props.deleteItem(id);
  }

  onClearCart() {
    this.props.clearCart();
  }

  renderItem(item) {
    const {
      stockLevelByItem,
      mainImageLinksByItem,
      updatingItems,
      deletingItems,
    } = this.props;
    const isLoading =
      updatingItems.includes(item.id) || deletingItems.includes(item.id);
    return (
      <CartProduct
        key={item.id}
        stockLevel={stockLevelByItem[item.product_id]}
        mainImageLink={mainImageLinksByItem[item.product_id]}
        item={item}
        onQtyChange={mbind(this.onItemQtyChange, this, item.id)}
        onRemove={mbind(this.onItemRemove, this, item.id)}
        isLoading={isLoading}
      />
    );
  }

  render() {
    const {
      isExpanded,
      totalPrice,
      totalAmount,
      items,
      isClearing,
    } = this.props;
    return (
      <div className={classNames('cart', { '-expanded': isExpanded })}>
        <div className="cart-content">
          <table cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="-item">Item</th>
                <th className="-price">Price</th>
                <th className="-qty">Qty</th>
                <th className="-total">Subtotal</th>
                <th className="-remove" />
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map(this.renderItem)
              ) : (
                <tr>
                  <td colSpan={5}>No items in cart yet. Go get something!</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>Total</td>
                <td colSpan={2} className="-total">
                  {getFormattedPrice(totalPrice)}
                </td>
              </tr>
              <tr>
                <td className="-buttons" colSpan={5}>
                  <div className="buttons-wrapper">
                    <IconLink
                      className="clear-button"
                      icon="delete-button"
                      onClick={this.onClearCart}
                      disabled={isClearing}
                    >
                      Clear cart
                    </IconLink>
                    <IconLink
                      className="checkout-button"
                      icon="transport"
                      onClick={() => {}}
                      disabled={isClearing}
                    >
                      Checkout
                    </IconLink>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="cart-sidebar" tabIndex="0" onClick={this.toggle}>
          <i className="cart-sidebar-icon icon-package-carrier" />
          <div className="cart-sidebar-amount">
            <span>{totalAmount}</span>
            items
          </div>
        </div>
        <div className="cart-close">
          <button onClick={this.toggle}>
            <i className="icon-multiplication-sign" />
          </button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
