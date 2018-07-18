/* eslint-disable no-undef */
function get(cb) {
  return fetch("api/get", {
    accept: "application/json"
  })
      .then(checkStatus)
      .then(parseJSON)
      .then(cb);
}

function put(songs, cb) {
  return fetch("api/put", {
    accept: "aplication/json",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(songs),
    method: "POST"
  })
      .then(checkStatus)
      .then(parseJSON)
      .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

const ApiClient = {get, put};
export default ApiClient;