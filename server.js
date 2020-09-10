const userProtoPath = __dirname + '/user.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const User = require('./repository/user');

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
  userProtoPath,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const userProto = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy

const server = new grpc.Server();

server.addService(userProto.User.service, {
  getById: (call, callback) => {
    const user = User.getById(call.request.id);

    if (user) {
      callback(null, user);
      return;
    }

    callback({
      code: grpc.status.NOT_FOUND,
      details: 'User not found'
    });
  },
  getByEmail: (call, callback) => {
    const user = User.getByEmail(call.request.email);

    if (user) {
      callback(null, user);
      return;
    }

    callback({
      code: grpc.status.NOT_FOUND,
      details: 'User not found'
    });
  },
  list: (call, callback) => {
    const users = User.getAll();
    if (users) {
      callback(null, {users});
      return;
    }

    callback({
      code: grpc.status.NOT_FOUND,
      details: 'User not found'
    });
  }
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
console.log('Server started');