const users = require('./userData');

const getById = id => {
  return users.find(user => user.id === id);
};

const getByEmail = email => {
  return users.find(user => user.email === email);
}

const getAll = () => {
  return users;
}

module.exports = {
  getById,
  getByEmail,
  getAll
}