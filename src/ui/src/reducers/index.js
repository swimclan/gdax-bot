import initialState from '../state';
import {FETCH_ALL_STATE_SUCCESS} from '../constants';

export const botState = (state=initialState, action) => {
  switch(action.type) {
    case FETCH_ALL_STATE_SUCCESS:
      const { payload: { bot: {data: bot}, fills: {data: fills} } } = action;
      return {
        ...state,
        bot,
        fills
      };
    default:
      return state;
  }
}