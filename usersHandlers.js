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

const postUser = (req, res)=>{
    const {firstname, lastname, email, city, language} = req.body;
    database
        .query('INSERT INTO users(firstname, lastname, email, city, language) VALUES(?, ?, ?, ?, ?)',
        [firstname, lastname, email, city, language])
        .then(([result])=>{
            res.location(`/api/users/${result.insertId}`).sendStatus(201);
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send('Error saving the user');
        })
}

const updateUser = (req, res) => {
    const id = Number(req.params.id);
    const {firstname, lastname, email, city, language} = req.body;

    database
        .query("update users set firstname=?, lastname=?, email=?, city=?, language=? where id=?",
        [firstname, lastname, email, city, language, id])
        .then(([result])=>{
            if(result.affectedRows === 0){
                res.status(404).send("Not Found");
            }else {
                res.sendStatus(204);
            }
        })
        .catch((error)=>{
            console.error(error);
            res.status(500).send("Error editing the user")
        })
    }


module.exports = {
    getUsers,
    getUsersId,
    postUser,
    updateUser,
  };