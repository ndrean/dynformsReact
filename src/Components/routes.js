import React from "react";
import Container from "@material-ui/core/Container";
import Layout from "./Layout";
import { ReactComponent as Logo } from "./images/kitesurfing.svg";
// import Logo from "./Components/logo"; IDEM ?
import Downwind from "./Downwind";
import { Geoloc } from "./Geoloc";
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
                <h1> Welcome to Outdoors activity Finder </h1>
                <p>
                  {" "}
                  To fully use this app, you may want to enable geolocalisation
                  and create an account.
                </p>

                <Geoloc />
                <p>You can look to find an activity close to you.</p>

                <p>Once you are logged in, you can:</p>
                <ul>
                  <li>
                    propose to join an activity. The person who initiated the
                    activity will receive your notification and accept or not
                    your demand.
                  </li>
                  <li>
                    you can create an activity push invitations to other
                    members. You can then accept or not their demand.
                  </li>
                  <li>You can respond to an invitation</li>
                </ul>
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
