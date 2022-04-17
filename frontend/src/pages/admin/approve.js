import React, { useEffect, useState } from "react";
import { Input, Button, Select, Modal, Form, List, TextArea } from "antd";
import { Cookies } from "react-cookie";
import axios from "axios";
import Router, { useRouter } from "next/router";

const cookies = new Cookies();

function ApprovePage() {
  const router = useRouter();
  const { TextArea } = Input;
  const { Option } = Select;

  const [list, setList] = useState([]);

  const [content, setContent] = useState([]);
  const [title, setTitle] = useState([]);
  const [category, setCategory] = useState("일반");
  const [isApprove, setIsApprove] = useState([]);
  const [review, setReview] = useState([]);

  const [documentId, setdocumentId] = useState(router.query.document_id);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onChangeApprove = (e) => {
    setIsApprove(e);
  };

  const onChangeReview = (e) => {
    setReview(e.target.value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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

  const approveDocument = async () => {
    await axios({
      method: "post",
      url: "http://localhost:4000/document/approval",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": cookies.get("x-access-token"),
      },
      data: {
        is_approve: isApprove,
        document_id: documentId,
        review: review,
      },
    }).then((res) => {
      Router.push("/admin/inbox");
    });
  };

  useEffect(() => {
    setdocumentId(router.query.document_id);
    api();
  }, []);

  return (
    <div>
      <div>
        <div style={{ display: "flex", marginBottom: "50px" }}>
          <Button
            type="primary"
            style={{ marginRight: "20px" }}
            onClick={showModal}
          >
            결제하기
          </Button>
        </div>
        <Modal
          title="결제하기"
          visible={isModalVisible}
          onOk={approveDocument}
          onCancel={handleCancel}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <Form.Item label="구분">
              <Select onChange={onChangeApprove}>
                <Option value="Y">승인</Option>
                <Option value="N">거절</Option>
              </Select>
            </Form.Item>
            <Form.Item label="의견" onChange={onChangeReview}>
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
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

export default ApprovePage;
