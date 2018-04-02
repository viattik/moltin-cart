const PREFIX = 'ERRORS/';
export const ACTION_TYPES = {
  FAILURE: `${PREFIX}FAILURE`,
};

export const initialState = {
  errors: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.FAILURE:
      return {
        ...state,
        ...{ errors: [...state.errors, action.error] },
      };
    default:
      return state;
  }
}

export function failure(error) {
  return { type: ACTION_TYPES.FAILURE, error };
}
