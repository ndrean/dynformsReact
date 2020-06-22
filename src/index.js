import { render } from "react-dom";
import Router from "universal-router";
import history from "./Components/history";
import { routes } from "./Components/routes";

import * as serviceWorker from "./serviceWorker";

// import { useIdb } from "react-use-idb";

/*******************************************************/
const router = new Router(routes);
// eslint-disable-next-line no-restricted-globals
function renderRoute() {
  router.resolve({ pathname: window.location.pathname }).then((html) => {
    render(html, document.getElementById("root"));
  });
}

history.listen(renderRoute);
history.listen(({ location }) => console.log(`${location.pathname}`));
renderRoute(history.location);

/*******************************************************/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker
//       .register("/serviceWorker.js")
//       .then((res) => console.log("service worker registered"))
//       .catch((err) => console.log("service worker not registered", err));
//   });
// }
