import {REFRESH_CLICKED, APP_MOUNTED} from '../constants';

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