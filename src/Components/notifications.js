import { observable, action } from "mobx";

let nb = observable.box(0);

const Notifications = observable({
  counter: 0,
  add: action(() => {
    Notifications.counter += 1;
    nb.value += 1;
  }),
  remove: action(() => {
    Notifications.counter -= 1;
    nb.value += 1;
  }),
  get count() {
    return Notifications.counter;
  },
});

global.nb = nb;
global.Notifications = Notifications;

export { Notifications, nb };
