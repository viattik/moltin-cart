import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// importing sagas and reducers
import errors from './errors';
import products, { productSagas } from './products';
import cart, { cartSagas } from './cart';

export const rootReducer = combineReducers({
  errors,
  products,
  cart,
});

export function* rootSaga() {
  yield all([...productSagas, ...cartSagas]);
}
