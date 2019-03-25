import {
  REFRESH_CLICKED,
  FETCH_ALL_STATE_SUCCESS,
  FETCH_ALL_STATE_ERROR,
  APP_MOUNTED,
  BOT_PROPERTY_UPDATED,
  PATCH_BOT_STATE_SUCCESS,
  PATCH_BOT_STATE_ERROR } from '../constants';
import { put, takeEvery, call, all } from 'redux-saga/effects'
import {fetchBotState, fetchFills, patchBotState} from '../services';

const putAllState = function* () {
  try {
    const [{ data: bot }, {data: fills}] = yield all([
      call(fetchBotState),
      call(fetchFills)
    ]);
    yield put({type: FETCH_ALL_STATE_SUCCESS, payload: {bot, fills}});
  } catch (e) {
    yield put({type: FETCH_ALL_STATE_ERROR, payload: {error: e}});
  }

}

const putPatchBotState = function* ({ payload }) {
  try {
    const { data: bot } = yield call(patchBotState, payload);
    yield put({type: PATCH_BOT_STATE_SUCCESS, payload: {bot: bot}});
  } catch (e) {
    yield put({type: PATCH_BOT_STATE_ERROR, payload: {error: e}});
  }
}

export const watchRefresh = function* () {
  yield takeEvery(REFRESH_CLICKED, putAllState);
}

export const watchAppMounted = function* () {
  yield takeEvery(APP_MOUNTED, putAllState);
}

export const watchUpdateBotState = function* () {
  yield takeEvery(BOT_PROPERTY_UPDATED, putPatchBotState);
}

export default function* rootSaga() {
  yield all([
    watchRefresh(),
    watchAppMounted(),
    watchUpdateBotState()
  ])
}