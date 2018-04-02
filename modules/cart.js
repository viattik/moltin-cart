import { put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import 'isomorphic-unfetch';
import _ from 'lodash/fp';
import Moltin from 'utils/moltin-api';
import { failure } from './errors';

// helpers
export const generateCartReference = function() {
  return `cart-${_.random(100000, 999999)}`;
};

// constants
const PREFIX = 'CART/';
export const ACTION_TYPES = {
  EXPAND: `${PREFIX}EXPAND`,
  COLLAPSE: `${PREFIX}COLLAPSE`,
  SET_CART_REF: `${PREFIX}SET_CART_REF`,
  FETCH_CART: `${PREFIX}FETCH_CART`,
  FETCH_CART_SUCCESS: `${PREFIX}FETCH_CART_SUCCESS`,
  ADD_TO_CART: `${PREFIX}ADD_TO_CART`,
  ADD_TO_CART_SUCCESS: `${PREFIX}ADD_TO_CART_SUCCESS`,
  UPDATE_QTY: `${PREFIX}UPDATE_QTY`,
  UPDATE_QTY_SUCCESS: `${PREFIX}UPDATE_QTY_SUCCESS`,
  DELETE_ITEM: `${PREFIX}DELETE_ITEM`,
  DELETE_ITEM_SUCCESS: `${PREFIX}DELETE_ITEM_SUCCESS`,
  CLEAR_CART: `${PREFIX}CLEAR_CART`,
  CLEAR_CART_SUCCESS: `${PREFIX}CLEAR_CART_SUCCESS`,
};

// initital state
export const initialState = {
  isExpanded: false,
  cartRef: '',
  items: [],
  addingProducts: [],
  updatingItems: [],
  deletingItems: [],
  totalPrice: 0,
  isClearing: false,
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.EXPAND:
      return { ...state, isExpanded: true };
    case ACTION_TYPES.COLLAPSE:
      return { ...state, isExpanded: false };
    case ACTION_TYPES.SET_CART_REF:
      return { ...state, cartRef: action.data.cartRef };
    case ACTION_TYPES.FETCH_CART_SUCCESS:
      return {
        ...state,
        ...{
          items: action.data.items,
          totalPrice: action.data.totalPrice,
        },
      };
    case ACTION_TYPES.ADD_TO_CART:
      return {
        ...state,
        ...{
          addingProducts: [...state.addingProducts, action.data.id],
        },
      };
    case ACTION_TYPES.ADD_TO_CART_SUCCESS:
      return {
        ...state,
        ...{
          items: action.data.items,
          totalPrice: action.data.totalPrice,
          addingProducts: state.addingProducts.filter(
            (i) => i !== action.data.product_id
          ),
        },
      };
    case ACTION_TYPES.UPDATE_QTY:
      return {
        ...state,
        ...{
          updatingItems: [...state.updatingItems, action.data.id],
        },
      };
    case ACTION_TYPES.UPDATE_QTY_SUCCESS:
      return {
        ...state,
        ...{
          items: action.data.items,
          totalPrice: action.data.totalPrice,
          updatingItems: state.updatingItems.filter(
            (i) => i !== action.data.id
          ),
        },
      };
    case ACTION_TYPES.DELETE_ITEM:
      return {
        ...state,
        ...{
          deletingItems: [...state.deletingItems, action.data.id],
        },
      };
    case ACTION_TYPES.DELETE_ITEM_SUCCESS:
      return {
        ...state,
        ...{
          items: action.data.items,
          totalPrice: action.data.totalPrice,
          deletingItems: state.deletingItems.filter(
            (i) => i !== action.data.id
          ),
        },
      };
    case ACTION_TYPES.CLEAR_CART:
      return {
        ...state,
        ...{ isClearing: true },
      };
    case ACTION_TYPES.CLEAR_CART_SUCCESS:
      return {
        ...state,
        ...{ isClearing: false },
      };
    default:
      return state;
  }
}

// actions
export function expandCart() {
  return { type: ACTION_TYPES.EXPAND };
}
export function collapseCart() {
  return { type: ACTION_TYPES.COLLAPSE };
}
export function setCartRef(cartRef) {
  return { type: ACTION_TYPES.SET_CART_REF, data: { cartRef } };
}
export function fetchCart() {
  return { type: ACTION_TYPES.FETCH_CART };
}
export function fetchCartSuccess(data) {
  return { type: ACTION_TYPES.FETCH_CART_SUCCESS, data };
}
export function addToCart(product_id) {
  return { type: ACTION_TYPES.ADD_TO_CART, data: { product_id } };
}
export function addToCartSuccess(data) {
  return { type: ACTION_TYPES.ADD_TO_CART_SUCCESS, data };
}
export function updateQty(id, qty) {
  return { type: ACTION_TYPES.UPDATE_QTY, data: { id, qty } };
}
export function updateQtySuccess(data) {
  return { type: ACTION_TYPES.UPDATE_QTY_SUCCESS, data };
}
export function deleteItem(id) {
  return { type: ACTION_TYPES.DELETE_ITEM, data: { id } };
}
export function deleteItemSuccess(data) {
  return { type: ACTION_TYPES.DELETE_ITEM_SUCCESS, data };
}
export function clearCart() {
  return { type: ACTION_TYPES.CLEAR_CART };
}
export function clearCartSuccess() {
  return { type: ACTION_TYPES.CLEAR_CART_SUCCESS };
}

// selectors
const getTotalPriceFromCartData = _.get('meta.display_price.with_tax.amount');
const getItemsFromCartData = _.get('data');
const getCartRefFromState = _.get('cart.cartRef');
export const getQuantityByItemFromCart = (cart) =>
  cart.items.reduce(
    (acc, item) => ({
      ...acc,
      [item.product_id]: item.quantity,
    }),
    {}
  );

// sagas
function prepareCartData(data) {
  return {
    items: getItemsFromCartData(data),
    totalPrice: getTotalPriceFromCartData(data),
  };
}

function* fetchCartSaga() {
  try {
    const state = yield select();
    const cartRef = getCartRefFromState(state);
    const res = yield Moltin.Cart(cartRef).Items();
    yield put(fetchCartSuccess(prepareCartData(res)));
  } catch (err) {
    yield put(failure(err));
  }
}
function* addToCartSaga({ data: { product_id } }) {
  try {
    const state = yield select();
    const cartRef = getCartRefFromState(state);
    const res = yield Moltin.Cart(cartRef).AddProduct(product_id);
    yield put(addToCartSuccess({ product_id, ...prepareCartData(res) }));
  } catch (err) {
    yield put(failure(err));
  }
}
function* updateQtySaga({ data: { id, qty } }) {
  try {
    const state = yield select();
    const cartRef = getCartRefFromState(state);
    const res = yield Moltin.Cart(cartRef).UpdateItemQuantity(id, qty);
    yield put(updateQtySuccess({ id, ...prepareCartData(res) }));
  } catch (err) {
    yield put(failure(err));
  }
}
function* deleteItemSaga({ data: { id } }) {
  try {
    const state = yield select();
    const cartRef = getCartRefFromState(state);
    const res = yield Moltin.Cart(cartRef).RemoveItem(id);
    yield put(deleteItemSuccess({ id, ...prepareCartData(res) }));
  } catch (err) {
    yield put(failure(err));
  }
}
function* clearCartSaga() {
  try {
    const state = yield select();
    const cartRef = getCartRefFromState(state);
    const res = yield Moltin.Cart(cartRef).Delete();
    yield put(clearCartSuccess());
    yield put(fetchCart());
  } catch (err) {
    yield put(failure(err));
  }
}

export const cartSagas = [
  takeLatest(ACTION_TYPES.FETCH_CART, fetchCartSaga),
  takeEvery(ACTION_TYPES.ADD_TO_CART, addToCartSaga),
  takeEvery(ACTION_TYPES.UPDATE_QTY, updateQtySaga),
  takeEvery(ACTION_TYPES.DELETE_ITEM, deleteItemSaga),
  takeLatest(ACTION_TYPES.CLEAR_CART, clearCartSaga),
];
