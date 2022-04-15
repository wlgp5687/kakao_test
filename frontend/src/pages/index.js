import Link from "next/link";
import { Input, Space, Button } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ display: "flex" }}>
        <Space direction="vertical">
          <Input placeholder="id" />
          <Input.Password
            placeholder="password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Space>
      </div>
      <Button type="primary">
        <div style={{ color: "white" }}>로그인</div>
      </Button>
    </div>
  );
}
