import React, { useEffect, useState } from "react";
import { Input, Button, Select, Modal, Transfer } from "antd";
import { Cookies } from "react-cookie";
import axios from "axios";
import Router from "next/router";

const cookies = new Cookies();

function AdminPage() {
  const { TextArea } = Input;
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [dataList, setDataList] = useState([]);
  const [getData, setGetData] = useState([]);

  const [content, setContent] = useState([]);
  const [title, setTitle] = useState([]);
  const [category, setCategory] = useState("일반");

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeCategory = (e) => {
    setCategory(e);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onChangeTransfer = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const api = async () => {
    await axios({
      method: "get",
      url: "http://localhost:4000/approver",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": cookies.get("x-access-token"),
      },
    }).then((res) => {
      setGetData(res.data);
    });
  };

  const postDocument = async () => {
    await axios({
      method: "post",
      url: "http://localhost:4000/document",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": cookies.get("x-access-token"),
      },
      data: {
        title: title,
        category: category,
        content: content,
        approvers: targetKeys,
      },
    }).then((res) => {
      Router.push("/admin/outbox");
    });
  };

  useEffect(() => {
    api();
  }, []);

  useEffect(() => {
    const listData = [];
    getData.map((data, index) => {
      listData.push({
        key: data.id,
        user_id: data.user_id,
      });
    });
    setDataList(listData);
  }, [getData]);

  const disabled = !targetKeys.length;
  return (
    <div>
      <div>
        <Modal
          title="Basic Modal"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Transfer
            dataSource={dataList}
            titles={["Source", "Target"]}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={onChangeTransfer}
            onSelectChange={onSelectChange}
            render={(item) => item.user_id}
          />
        </Modal>
        <div style={{ display: "flex", marginBottom: "50px" }}>
          <Button
            type="primary"
            style={{ marginRight: "20px" }}
            disabled={disabled}
            onClick={postDocument}
          >
            기안하기
          </Button>
          <Button type="primary" onClick={showModal}>
            결재선 변경
          </Button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "50px" }}>제목</div>
          <Input
            size={"large"}
            style={{ width: 320 }}
            onChange={onChangeTitle}
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
            onChange={onChangeCategory}
          >
            <Option value="휴가">휴가</Option>
            <Option value="일반">일반</Option>
          </Select>
        </div>
        <br />
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "50px" }}>내용</div>
          <TextArea size={"large"} onChange={onChangeContent} />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
