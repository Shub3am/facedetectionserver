const register = (req, res, database, bcrypt) => {
  const { name, email, password } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, 10);
  console.log(encryptedPassword);
  if (name && email && password) {
    database.transaction((trx) => {
      trx
        .insert({
          email: email,
          hash: encryptedPassword,
        })
        .into("login")
        .then(() => {
          return trx
            .insert({
              name: name,
              email: email,
              password: encryptedPassword,
              joined: new Date(),
            })
            .into("users")
            .then(() => {
              trx
                .select("*")
                .from("users")
                .where({ email: email })
                .then((data) => res.json(data));
            })
            .catch((err) => {
              res.json("Value Already Exists");
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    });
  } else {
    res.json("Something is Missing");
  }
};

module.exports = { registerController: register };
