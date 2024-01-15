const isEmail = (email) => {
  let regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email != null) {
    if (regex.test(email)) {
      // Return true for valid email address
      return true;
    }
  }
  // invalid email, return false.
  return false;
};

const checkUsername = (username) => {
  let regex = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
  if (username != null) {
    if (regex.test(username)) {
      return true;
    }
  }
  return false;
};

module.exports = {
  isEmail,
  checkUsername,
};
