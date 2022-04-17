import React, { useEffect, useState } from "react";
import { Input, Select, List } from "antd";
import { Cookies } from "react-cookie";
import axios from "axios";
import Router, { useRouter } from "next/router";

const cookies = new Cookies();

function DetailPage() {
  const router = useRouter();
  const { TextArea } = Input;
  const { Option } = Select;

  const [list, setList] = useState([]);

  const [content, setContent] = useState([]);
  const [title, setTitle] = useState([]);
  const [category, setCategory] = useState("일반");

  const [documentId, setdocumentId] = useState(router.query.document_id);

  const api = async () => {
    await axios({
      method: "get",
      url: `http://localhost:4000/document/${documentId}`,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": cookies.get("x-access-token"),
      },
    }).then((res) => {
      setContent(res.data.content);
      setTitle(res.data.title);
      setCategory(res.data.category);
      setList(res.data.approver);
    });
  };

  useEffect(() => {
    setdocumentId(router.query.document_id);
    api();
  }, []);

  return (
    <div>
      <div>
        <List
          style={{ display: "flex", marginBottom: "50px" }}
          bordered
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <List.Item>{item.user_id}</List.Item>
              <List.Item>{item.status}</List.Item>
              <List.Item>{item.review}</List.Item>
            </List.Item>
          )}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "50px" }}>제목</div>
          <Input
            size={"large"}
            style={{ width: 320 }}
            value={title}
            disabled={true}
          />
        </div>
        <br />
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "50px" }}>분류</div>
          <Select
            size={"large"}
            defaultValue="일반"
            style={{ width: 320 }}
            value={category}
            disabled={true}
          >
            <Option value="휴가">휴가</Option>
            <Option value="일반">일반</Option>
          </Select>
        </div>
        <br />
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "50px" }}>내용</div>
          <TextArea size={"large"} value={content} disabled={true} />
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
