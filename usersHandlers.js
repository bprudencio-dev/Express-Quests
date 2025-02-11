const database = require('./database');



const getUsers = (req, res)=>{
    let sql = "select * from users";
    const sqlValues = [];
    if(req.query.language != null){
        sql += " where language=?";
        sqlValues.push(req.query.language);
     
    if(req.query.city != null){
        sql += " and city=?";
        sqlValues.push(req.query.city);
        }
    }else if (req.query.city != null){
        sql += " where city =?";
        sqlValues.push(req.query.city);
    }
    database
        .query(sql, sqlValues)
        .then(([users])=>{
            res.status(200).json(users)
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
    // const {firstname, lastname, email, city, language, hashedPassword} = req.body;
    database
    .query('INSERT INTO users set ?', req.body)
        // .query('INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES(?, ?, ?, ?, ?, ?)',
        // [firstname, lastname, email, city, language, hashedPassword])
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
        .query("update users set firstname=?, lastname=?, email=?, city=?, language=?, hashedPassword=? where id=?",
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

    const deleteUser =(req, res)=>{
        const id = Number(req.params.id)

        database
            .query("delete from users where id=?", [id])
            .then(([result])=>{
                if(result.affectedRows === 0){
                    res.status(404).send("Not Found");
                }else {
                    res.sendStatus(204);
                }
            })
            .catch((error)=>{
                console.error(error);
                res.status(500).send("Error deleting user")
            })

    }

    const getUserByEmailWithPasswordAndPassToNext =(req, res, next)=>{
        const{email}= req.body;
        database
            .query("SELECT * FROM users WHERE email=?",[email])
            .then(([users])=>{
                if(users[0] !== null){
                    req.user = users[0];

                    next();
                }else{
                    res.sendStatus(401)
                }
            })
            .catch((err)=>{
                console.error(err);
                res.status(500).send('Error retrieving data from database')
            })
    }


module.exports = {
    getUsers,
    getUsersId,
    postUser,
    updateUser,
    deleteUser,
    getUserByEmailWithPasswordAndPassToNext,
  };