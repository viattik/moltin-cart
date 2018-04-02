import React, { Component } from 'react';
import toBe from 'prop-types';
import { connect } from 'react-redux';
import mbind from 'memoize-bind';
import Cookies from 'universal-cookie';
import _ from 'lodash/fp';

import Layout from 'layouts/main';
import Product from 'components/product';
import './index.scss';
import { loadList } from 'modules/products';
import {
  fetchCart,
  addToCart,
  generateCartReference,
  setCartRef,
  getQuantityByItemFromCart,
} from 'modules/cart';
import { getStockLevelFromItem } from 'modules/products';
import { withReduxSaga } from 'stores';

const mapStateToProps = (state) => ({
  list: state.products.list,
  cartRef: state.cart.cartRef,
  quantityInCartByItem: getQuantityByItemFromCart(state.cart),
});
const mapDispatchToProps = {
  addToCart,
};

class Index extends Component {
  static async getInitialProps(context) {
    const { store, isServer, req } = context;

    const cookies = isServer ? new Cookies(req.headers.cookie) : new Cookies();
    let cartRef = cookies.get('cart-ref');
    if (!cartRef) {
      cartRef = generateCartReference();
    }
    await store.dispatch(setCartRef(cartRef));
    await store.dispatch(fetchCart());
    await store.dispatch(loadList());
  }

  static propTypes = {
    list: toBe.array,
    addToCart: toBe.func.isRequired,
    cartRef: toBe.string,
  };

  static defaultProps = {
    list: [],
    cartRef: '',
  };

  constructor() {
    super();
    this.renderProduct = this.renderProduct.bind(this);
  }

  componentDidMount() {
    // Unfortunately, we can't update cookies on server from here. So we're syncing them in browser
    const cookies = new Cookies();
    cookies.set('cart-ref', this.props.cartRef);
  }

  onAdd(id) {
    this.props.addToCart(id);
  }

  renderProduct(product) {
    const { quantityInCartByItem } = this.props;
    const stockLevel = getStockLevelFromItem(product);
    const itemsInCart = _.getOr(0, product.id, quantityInCartByItem);
    return (
      <li key={product.id} className="col-md-4 col-sm-6 col-xs-12">
        <Product
          onAdd={mbind(this.onAdd, this, product.id)}
          data={product}
          itemsLeft={stockLevel - itemsInCart}
          disabledAdd={itemsInCart >= stockLevel}
        />
      </li>
    );
  }

  render() {
    const { list } = this.props;
    return (
      <Layout>
        <div className="page-index">
          <ul className="row">{list.map(this.renderProduct)}</ul>
        </div>
      </Layout>
    );
  }
}

export default withReduxSaga(
  connect(mapStateToProps, mapDispatchToProps)(Index)
);
