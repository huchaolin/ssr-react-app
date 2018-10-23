const axios = require('axios');
const queryString = require('query-string')
const baseUrl = 'https://cnodejs.org/api/v1';

// module.exports = (req, res, next) => {
//     const path = req.path;
//     const user = req.session.user || {};
//     const needAccessToken = req.query.needAccessToken;
//     if (needAccessToken && !user.needAccessToken) {
//         res.status(401).send({
//             success: false,
//             msg: 'need login'
//         })
//     };
//     const query = Object.assign({}, req.query);
//     if (query.needAccessToken) delete query.needAccessToken;
//     axios(`${baseUrl}${path}`, {
//         method: req.method,
//         params: query,
//         data: Object.assign({}, req.body, {
//             accesstoken: user.accessToken
//         }),
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     })
//         .then(res1 => {
//             if (res1.status == 200) {
//                 res.send(res1.data)
//             } else {
//                 res.status(res1.status).send(res1.data)
//             }
//         })
//         .catch(err => {
//             if (err.response) {
//                 res.status(500).send(err.response.data)
//             } else {
//                 res.status(500).send({
//                     success: false,
//                     msg: '未知错误'
//                 })
//             }
//         })
// }

module.exports = async (req, res, next) => {
    const path = req.path;
    const user = req.session.user || {};
    const needAccessToken = req.query.needAccessToken;
    if (needAccessToken && !user.accessToken) {
        res.status(401).send({
            success: false,
            msg: 'need login'
        })
    };
    const query = Object.assign({}, req.query, {
        accesstoken: (needAccessToken && req.method == 'GET') ? user.accessToken : '',
    }); //get请求需要传入accessToken的情况
    if (query.needAccessToken) delete query.needAccessToken;
    try {
        const res1 = await axios(`${baseUrl}${path}`, {
            method: req.method,
            params: query,
            data: queryString.stringify(
                Object.assign({}, req.body, {
                    accesstoken:(needAccessToken && req.method.toUpperCase( ) == 'POST') ? user.accessToken : ''
                })
            ),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (res1.status == 200) {
            res.send(res1.data);
        } else {
            res.status(res1.status).send(res1.data);
        }
    } catch (err) {
        if (err.response) {
            res.status(500).send(err.response.data);
        } else {
            res.status(500).send({
                success: false,
                msg: '未知错误'
            });
        }
    }
}