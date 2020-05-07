import {
  Object,
  objectVt,
  createVt,
  newObj,
  send
} from './obj_model';

/* Ruby Module

module Auth
  def login(username, password)
    @username == username && @password == password
  end
end

module Serialize
  def serialize
    self.inspect
  end
end

class Users
  include Auth
  include Serialize

  def initialize(username, password, name)
    @username = username
    @password = password
    @name = name
  end
end

user = Users.new('johndoe', 'password1', 'John Doe');

p user.login('johndoe', 'password1')
p user.serialize()

*/

// Object Model
// The order of vtable chain is same as ancestor chain in Ruby: Users Serialize Auth Object
const authVt = createVt({
  login (obj: Object, username: string, password: string) {
    return send(obj, 'get', 'username') === username && send(obj, 'get', 'password') === password;
  }
}, objectVt);

const serializeVt = createVt({
  serialize (obj: Object) {
    return send(obj, 'toJSON');
  }
}, authVt);

const userVt = createVt({}, serializeVt);

const user = newObj(userVt);
send(user, 'set', 'username', 'johndoe');
send(user, 'set', 'password', 'password1');
send(user, 'set', 'name', 'John Doe');

console.log(user);
console.log(send(user, 'login', 'johndoe', 'password1'));
console.log(send(user, 'login', 'johndoe', 'password2'));
console.log(send(user, 'serialize'));