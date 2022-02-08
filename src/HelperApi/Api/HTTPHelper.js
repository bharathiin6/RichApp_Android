import base64 from 'react-native-base64';

export function HttpHelper(url, method, body) {
    return fetch(url, {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    })
        .then(response => response.json())
        .catch(e => console.log(e))
}
export function HttpMultiPartHelper(url, method, body) {
    return fetch(url, {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
        body: body,
    })
        .then(response => response.json())
        .catch(e => console.log(e))
}
export function HttpAuthHelper(url, method) {
    // console.log(url);
    return fetch(url, {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .catch(e => console.log(e))
}








