import React from "react";
import LayoutForm from "../components/layout";
import "antd/dist/antd.css";

function MyApp({ Component, pageProps, ...appProps }) {
  const isLayoutNeeded = appProps.router.pathname.indexOf("/admin");
  const LayoutComponent = isLayoutNeeded !== -1 ? LayoutForm : React.Fragment;
  return (
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
  );
}

export default MyApp;
