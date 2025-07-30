class Auth {
  constructor(parameters) {}

  registerUser(req, res) {
    res.send("user registered");
  }
}

module.exports = new Auth();
