import {REFRESH_CLICKED, APP_MOUNTED, BOT_PROPERTY_UPDATED} from '../constants';

export const refreshClicked = () => {
  return {
    type: REFRESH_CLICKED
  }
}

export const appMounted = () => {
  return {
    type: APP_MOUNTED
  }
}

export const updateBotState = (options) => {
  return {
    type: BOT_PROPERTY_UPDATED,
    payload: options
  }
}