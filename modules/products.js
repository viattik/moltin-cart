import { put, takeLatest } from 'redux-saga/effects';
import 'isomorphic-unfetch';
import _ from 'lodash/fp';
import Moltin from 'utils/moltin-api';
import { failure } from './errors';

// constants
const PREFIX = 'PRODUCTS/';
export const ACTION_TYPES = {
  LOAD_LIST: `${PREFIX}LOAD_LIST`,
  LOAD_LIST_SUCCESS: `${PREFIX}LOAD_LIST_SUCCESS`,
};

// initital state
export const initialState = {
  list: [],
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.LOAD_LIST_SUCCESS:
      return {
        ...state,
        ...{ list: action.data },
      };
    default:
      return state;
  }
}

// actions
export function loadList() {
  return { type: ACTION_TYPES.LOAD_LIST };
}
export function loadListSuccess(data) {
  return { type: ACTION_TYPES.LOAD_LIST_SUCCESS, data };
}

// selectors
export const getMainImageIdFromItem = _.get('relationships.main_image.data.id');
export const getMainImageLinkFromItem = _.get('main_image.link.href');
export const getStockLevelFromItem = _.get('meta.stock.level');
export const getStockLevelByItem = (products) =>
  products.list.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: getStockLevelFromItem(item),
    }),
    {}
  );
export const getMainImageLinkByItem = (products) =>
  products.list.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: getMainImageLinkFromItem(item),
    }),
    {}
  );
export const getPriceFromItem = _.get('meta.display_price.with_tax.amount');

// sagas
function* loadListSaga() {
  try {
    const res = yield Moltin.Products.With('main_image').All();
    const list = res.data.map((item) => {
      const mainImageId = getMainImageIdFromItem(item);
      const mainImage = _.find({ id: mainImageId }, res.included.main_images);
      return { ...item, main_image: mainImage };
    });
    yield put(loadListSuccess(list));
  } catch (err) {
    yield put(failure(err));
  }
}

export const productSagas = [takeLatest(ACTION_TYPES.LOAD_LIST, loadListSaga)];
