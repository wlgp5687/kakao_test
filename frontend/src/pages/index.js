import { Input, Space, Button } from "antd";
import { Cookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Router from "next/router";

const cookies = new Cookies();

export default function Home() {
  const [userId, setUserId] = useState([]);
  const [password, setPassword] = useState([]);

  const setId = (e) => {
    setUserId(e.target.value);
  };

  const setPasswordinput = (e) => {
    setPassword(e.target.value);
  };

  const setCookie = async () => {
    await axios({
      method: "post",
      url: "http://localhost:4000/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        login_id: userId,
        password: password,
      },
    }).then((res) => {
      cookies.set("x-access-token", res.data);
      Router.push("/admin");
    });
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ display: "flex" }}>
        <Space direction="vertical">
          <Input placeholder="id" onChange={setId} />
          <Input.Password placeholder="password" onChange={setPasswordinput} />
        </Space>
      </div>
      <Button type="primary" onClick={setCookie}>
        <div style={{ color: "white" }}>로그인</div>
      </Button>
    </div>
  );
}
