const database = require('./database');



const getUsers = (req, res)=>{
    database
        .query('select*from users')
        .then(([users])=>{
            res.send(users)
        })
        .catch((err)=>{
            res.status(500).send('Error retrieving data from data base')
        })
};

const getUsersId = (req, res)=>{
    const usersId = Number(req.params.id);
    database
        .query('select * from users where id=?', [usersId])
        .then(([users])=>{
            if(users[0]!= null){
                res.send(users[0]);
            }else{
                res.status(404).send('Not found')
            }
        })
        .catch((err)=>{
            res.status(500).send('Error retrieving data from database')
        });
};


module.exports = {
    getUsers,
    getUsersId,
  };