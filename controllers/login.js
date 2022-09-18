const loginController = (req, res, database, bcrypt) => {
  const { email, password } = req.body;
  database
    .where({ email: email.toLowerCase() })
    .select("email", "password")
    .from("users")
    .then((confirmer) => {
      if (confirmer.length) {
        if (bcrypt.compareSync(password, confirmer[0].password)) {
          database
            .select("*")
            .from("users")
            .where({ email: email })
            .then((logininfo) => res.json(logininfo));
        } else {
          res.json("Wrong Password");
        }
      } else {
        res.json("Not Found");
      }
    });
};

module.exports = {
  loginController: loginController,
};
