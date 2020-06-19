import React from "react";
import Container from "@material-ui/core/Container";
import SearchAppBar from "./appbar";

export default function Layout({ children }) {
  const [body, setBody] = React.useState(
    <>
      <Container>
        <SearchAppBar />
      </Container>
    </>
  );

  React.useEffect(() => {
    setBody(
      <>
        <Container>
          <SearchAppBar />
          {children}
        </Container>
      </>
    );
  }, [children]);
  return body;
}
