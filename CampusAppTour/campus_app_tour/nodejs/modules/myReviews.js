const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const vals = require('../db/config/consts.js');
const bodyParser = require('body-parser');

const pool = mysql.createPool({
    host: vals.DBHost,
    port: vals.DBPort,
    user: vals.DBUser,
    password: vals.DBPass,
    database: 'campus_app_tour',
    connectionLimit: 5,
});


module.exports = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/myReviews', async (req, res) => {
        const conn = await pool.getConnection(vals);
        let userKakaoId = req.body.user_kakao_id;
        console.log('myReviews: userKakaoId : ', userKakaoId);
        const findUserQuery = `SELECT * FROM user WHERE user_id = ?`
        const user = await conn.execute(findUserQuery, [userKakaoId]);
        const userIdx = user[0].at(0).idx;
        const findMyReviews = `SELECT * FROM review WHERE user_idx = ?`
        const myReviews = await conn.execute(findMyReviews, [userIdx]);
        if (myReviews[0].lenght == 0) res.end({});
        else {
            let reviewArr = [];

            for(let review of myReviews[0]){
                reviewArr.push(review);
            }

            res.send(reviewArr);
        }
        res.end();
    });
}
