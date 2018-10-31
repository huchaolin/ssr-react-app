//代理登陆
const router = require('express').Router();
const axios = require('axios');

const baseUrl = 'https://cnodejs.org/api/v1';

router.post(`/login`, async (req, res, next) => {
    try {
        const res1 = await axios.post(`${baseUrl}/accesstoken`, {
            accesstoken: req.body.accessToken
        });
        if (res1.status === 200 && res1.data.success) {
            req.session.user = {
                accessToken: req.body.accessToken,
                loginname: res1.data.loginname,
                id: res1.data.id,
                avatar_url: res1.data.avatar_url
            };
            res.json({
                success: true,
                data: res1.data
            });
        }
    }
    catch (err) {
        if (err.response) {
            res.json({
                success: false,
                data: err.response.data
            });
        } else {
            next(err);
        }
    }
});

module.exports = router;
