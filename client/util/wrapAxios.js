import axios from 'axios';

const baseUrl = process.env.API_BASE || ''

const parseUrl = (url, params) => {
    let parsedUrl = `${baseUrl}/api${url}`;
    if (!!params && (Object.keys(params).length !== 0)) {
        const paramsStr = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        parsedUrl = `${baseUrl}/api${url}?${paramsStr}`;
    };
    return parsedUrl;
}
export const get = (url, params) => new Promise((resolve, reject) => {
        axios.get(parseUrl(url, params))
        .then((res) => {
            const { data } = res;
            if (data && data.success === true) {
                resolve(data);
            } else {
                reject(data)
            }
        })
        .catch(reject);
        // .catch( err => {
        //     if(err.response) {
        //         reject(err.response.data);
        //     } else {
        //         reject({
        //             success: false,
        //             err_msg: err.message,
        //         })
        //     }
        // })
    })

export const post = (url, params, bodyData) => new Promise((resolve, reject) => {
        axios.post(parseUrl(url, params), bodyData)
        .then((res) => {
            const { data } = res;
            if (data && data.success === true) {
                resolve(data);
            } else {
                reject(data)
            }
        })
        .catch(reject);
        // .catch( err => {
        //     if(err.response) {
        //         reject(err.response.data);
        //     } else {
        //         reject({
        //             success: false,
        //             err_msg: err.message,
        //         })
        //     }
        // })
    })
