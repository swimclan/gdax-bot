import {
  REFRESH_CLICKED,
  FETCH_ALL_STATE_SUCCESS,
  FETCH_ALL_STATE_ERROR,
  APP_MOUNTED} from '../constants';
import { put, takeEvery, call, all } from 'redux-saga/effects'
import {fetchBotState, fetchFills} from '../services';

const putAllState = function* () {
  try {
    const [bot, fills] = yield all([
      call(fetchBotState),
      call(fetchFills)
    ]);
    yield put({type: FETCH_ALL_STATE_SUCCESS, payload: {bot, fills}});
  } catch (e) {
    yield put({type: FETCH_ALL_STATE_ERROR, payload: {error: e}});
  }

}

export const watchRefresh = function* () {
  yield takeEvery(REFRESH_CLICKED, putAllState);
}

export const watchAppMounted = function* () {
  yield takeEvery(APP_MOUNTED, putAllState);
}

export default function* rootSaga() {
  yield all([
    watchRefresh(),
    watchAppMounted()
  ])
}