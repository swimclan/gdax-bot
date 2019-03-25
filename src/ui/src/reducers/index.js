import initialState from '../state';
import {FETCH_ALL_STATE_SUCCESS, PATCH_BOT_STATE_SUCCESS} from '../constants';

export const botState = (state=initialState, action) => {
  switch(action.type) {
    case FETCH_ALL_STATE_SUCCESS:
      const { payload: { bot, fills } } = action;
      return {
        ...state,
        bot,
        fills
      };
    case PATCH_BOT_STATE_SUCCESS:
      const { payload } = action;
      return {
        ...state,
        bot: payload.bot
      };
    default:
      return state;
  }
}