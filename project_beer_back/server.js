const express = require('express');
const db = require('./config/db')
const cors = require('cors')

const app = express();
const  PORT = 3002;
app.use(cors());
app.use(express.json());


// Route to get all rates of a user 
db.connect(err=>{
    if(err){
        console.log("connection failed");
        throw err;
    }
    console.log("database connected")

// Route for creating the post
    app.post('/login', (req,res)=> {
        let password = req.body.password;
        let pseudo = req.body.name;

        db.query("SELECT `id` FROM `user` WHERE `pseudo`=? AND `password`=?",[pseudo,password], (err,result)=>{
            let data_to_return={
                connected:false,
                pseudo:"",
                id:-1,
                userRate:[],
            };
            if(err) throw  err;
            if (result.length) {
                data_to_return.connected = true;
                data_to_return.id = result[0].id;
                data_to_return.pseudo=pseudo;
                db.query("SELECT user_beers.beer_id, user_beers.rating  FROM user LEFT JOIN user_beers ON user.id = user_beers.user_id WHERE user.id=?", [data_to_return.id], (err, result2) => {
                    if (err) throw err;
                    result2.forEach(r => {
                        data_to_return.userRate.push(
                            {
                                beer_id: r.beer_id,
                                rating: r.rating

                            }
                        )
                    });
                    console.log(data_to_return);
                    res.send(data_to_return);


                });
            }
            else {
                res.send(data_to_return);
            }
        });


    })


    app.post('/signin', (req,res)=> {
        let password = req.body.password;
        let pseudo = req.body.name;
        db.query("SELECT `pseudo` FROM `user` WHERE `pseudo`=?",[pseudo], (err,result)=>{
            if(err) throw  err;
            if (!result.length) {
                db.query("INSERT INTO `user`(`pseudo`, `password`) VALUES (?,?)", [pseudo,password], (err, result2) => {
                    if (err) throw err;
                    res.send({success:1});

                });
            }
            else {
                res.send({success:0});
            }
        });
    })

    app.post('/newrate',(req,res)=>{
        let beer_id = req.body.beer_id;
        let user_id = req.body.user_id;
        let rate = req.body.rate;

        db.query("INSERT INTO `user_beers`(`rating`, `user_id`, `beer_id`) VALUES (?,?,?)",[rate,user_id,beer_id], (err,result)=>{
            if(err) {
                res.send({success: 0});
                throw err;
            }
            res.send({success:1});
        });
    });


    app.post('/setrate',(req,res)=> {
        let beer_id = req.body.beer_id;
        let user_id = req.body.user_id;
        let rate = req.body.rate;
        console.log("body", req.body);

        db.query("SELECT `beer_id` FROM `beer` WHERE `beer_id`=?", [beer_id],(err1,result1)=> {
            if (err1){
                throw err1;
            }
            console.log(result1);
            if (!result1.length) {
                  db.query("INSERT INTO `beer`(`beer_id`) VALUES (?)", [beer_id]);
            }
        });
        db.query("UPDATE `user_beers` SET `rating`=? WHERE `user_id`=? AND`beer_id`=?", [rate, user_id, beer_id], (err2, result2) => {
            if (err2) {
                res.send({success: 0});
                throw err2;

            }
            if (result2.changedRows) {
                res.send({success: 1});


            } else {
                db.query("INSERT INTO `user_beers`(`rating`, `user_id`, `beer_id`) VALUES (?,?,?)", [rate, user_id, beer_id], (err3, result3) => {
                    if (err3) {
                        res.send({success: 0});
                        throw err3;
                    }
                    res.send({success: 1});
                });
            }
        });
    });
    app.post('/removerate',(req,res)=> {
        let beer_id = req.body.beer_id;
        let user_id = req.body.user_id;
        let rate = req.body.rate;

        db.query("SELECT `rating`, `user_id`, `beer_id` FROM `user_beers` WHERE`user_id`=? AND `beer_id`=?", [user_id,beer_id],(err,result)=> {
            if (err)throw err;
            if (result.length) {
                db.query("DELETE FROM `user_beers` WHERE `user_id`=? AND `beer_id`=?", [ user_id, beer_id], (err1, result1) => {
                    if(err)throw err;
                    console.log(result1);
                    res.send({success:1});

                });
            }
        });
    });


    app.post('/getrate',(req,res)=>{
        let beer_id = req.body.beer_id;
        let user_id = req.body.user_id;
        db.query("SELECT `rating` FROM `user_beers` WHERE `beer_id`=? AND `user_id`=?",[beer_id,user_id], (err,result)=>{
            if(err) {
                res.send({success:0});
                throw err;
            }
            if(result.length){
                let tmp={
                    success:1,
                    rate:result[0].rating
                }
                res.send(tmp)
            }else {
                res.send({success: 1, rate: -1});
            }
        });
    });


    app.post('/getbeerswithrate',(req,res)=>{
        let rate = req.body.rate;
        let user_id = req.body.user_id;
        console.log(req.body);
      //  console.log(req.body);
       // console.log("a",beer_id,"b",rate);
        db.query("SELECT `beer_id` FROM `user_beers` WHERE `rating`=? AND `user_id`=?",[rate,user_id], (err,result)=>{
            if(err) {
                res.send({success:0});
                throw err;
            }
            console.log("getbeerswithrate",result);
                res.send({
                    success:1,
                    beersId:result
                });
        });
    });


})
app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})
