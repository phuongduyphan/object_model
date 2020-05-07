import {
  Object,
  objectVt,
  createVt,
  newObj,
  send
} from './obj_model';

/* JS code

class Employee {
  firstName: string;
  lastName: string;

  fullname () {
    return this.firstName + this.lastName;
  }
}

class Engineer extends Employee {
  type: string;

  greet () {
    return `My name is ${this.fullname}. I'm a ${this.type} Engineer.`;
  }
}
*/

// Object Model

const employeeVt = createVt({
  fullname (obj: Object) {
    return obj.data.firstName + ' ' + obj.data.lastName;
  }
}, objectVt);

const employee = newObj(employeeVt);
send(employee, 'set', 'firstName', 'John');
send(employee, 'set', 'lastName', 'Doe');
console.log(employee);

const fullname = send(employee, 'fullname');
console.log(fullname);

const engineerVt = createVt({
  greet (obj: Object) {
    return `My name is ${send(obj, 'fullname')}. I'm a ${send(obj, 'get', 'type')} Engineer.`;
  }
}, employeeVt);

const engineer = newObj(engineerVt);
send(engineer, 'set', 'firstName', 'Uncle');
send(engineer, 'set', 'lastName', 'Bob');
send(engineer, 'set', 'type', 'Software');
console.log(engineer);
console.log(send(engineer, 'greet'));