import React from "react";
import Container from "@material-ui/core/Container";
import Layout from "./Layout";
import { ReactComponent as Logo } from "./images/kitesurfing.svg";
// import Logo from "./Components/logo"; IDEM ?
import Downwind from "./Downwind";

import Geoloc from "./Geoloc";
import Lmap from "./MapLeaf";
import Search from "./Search";

export const routes = [
  {
    path: "/",
    async action() {
      return (
        <>
          <Layout>
            <Container style={{ position: "relative", display: "flex" }}>
              <Logo style={{ opacity: 0.15, position: "relative" }} />
              <Container style={{ position: "absolute" }}>
                <h1> Welcome to Downwind Finder </h1>
                <p>
                  {" "}
                  To fully use this app, you may want to enable geolocalisation
                  and create an account.
                </p>
                <Geoloc />
                <p>You can find a downwind close to you:</p>

                <p>
                  You can propose to join a downwind when you are logged in. The
                  kiter who initiated the downwind will accept or not your
                  demand.
                </p>
                <p>
                  You can create a downwind and push an invitation to other
                  members when logged in.
                </p>
                <p>You can respond to an invitation when you are logged in.</p>
                <li></li>
              </Container>
            </Container>
          </Layout>
        </>
      );
    },
  },
  {
    path: "/new",
    async action() {
      return (
        <>
          {/* <React.StrictMode> */}
          <Layout>
            <Downwind />
          </Layout>
          {/* </React.StrictMode> */}
        </>
      );
    },
  },
  // {
  //   path: "/MMap",
  //   async action() {
  //     const { Lat, Lng, zoom = 7 } = (await JSON.parse(
  //       localStorage.getItem("localPosition")
  //     )) || {
  //       Lat: 47.2,
  //       Lng: -1.5,
  //     };

  //     return (
  //       <Layout>
  //         <Container>
  //           <Map Lat={Lat} Lng={Lng} zoom={zoom} />
  //         </Container>
  //       </Layout>
  //     );
  //   },
  // },
  {
    path: "/LMap",
    async action() {
      const { Lat, Lng, zoom = 7 } = (await JSON.parse(
        localStorage.getItem("localPosition")
      )) || {
        Lat: 47.2,
        Lng: -1.5,
      };

      return (
        <Layout>
          <Container>
            <Lmap Lat={Lat} Lng={Lng} zoom={zoom} />
          </Container>
        </Layout>
      );
    },
  },
  {
    path: "/Search",
    async action() {
      const { Lat, Lng, zoom = 7 } = (await JSON.parse(
        localStorage.getItem("localPosition")
      )) || {
        Lat: 47.2,
        Lng: -1.5,
      };

      return (
        <Layout>
          <Search Lat={parseFloat(Lat)} Lng={parseFloat(Lng)} zoom={zoom} />
        </Layout>
      );
    },
  },
];
