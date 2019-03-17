import axios from 'axios';

export const fetchBotState = () => {
  return new Promise((resolve, reject) => {
    axios.get('/api/state')
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      reject(error);
    });
  })
}

export const fetchFills = () => {
  return new Promise((resolve, reject) => {
    axios.get('/api/history/fills')
    .then(response => {
      resolve(response);
    })
    .catch(error => {
      reject(error);
    });
  });
}