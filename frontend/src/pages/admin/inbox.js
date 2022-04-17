import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import { Cookies } from "react-cookie";
import Router from "next/router";

const cookies = new Cookies();

function inbox() {
  const [dataList, setDataList] = useState([]);
  const [getData, setGetData] = useState([]);
  const columns = [
    {
      title: "제목",
      dataIndex: "title",
      align: "center",
    },
    {
      title: "카테고리",
      dataIndex: "category",
      align: "center",
    },
    {
      title: "상태",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "작성자",
      dataIndex: "user_id",
      align: "center",
    },
  ];

  const api = async () => {
    await axios({
      method: "get",
      url: "http://localhost:4000/documents-in",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": cookies.get("x-access-token"),
      },
    }).then((res) => setGetData(res.data));
  };

  const onRow = (record, rowIndex) => {
    return {
      onClick: (event) => {
        Router.push({
          pathname: "/admin/approve",
          query: { document_id: record.key },
        });
      },
    };
  };

  useEffect(() => {
    api();
  }, []);

  useEffect(() => {
    const listData = [];
    if (getData) {
      getData.map((data, index) => {
        listData.push({
          key: data.id,
          title: data.title,
          category: data.category,
          status: data.status,
          user_id: data.user_id,
        });
      });
      setDataList(listData);
    }
  }, [getData]);

  return (
    <div>
      <Table columns={columns} dataSource={dataList} onRow={onRow}></Table>
    </div>
  );
}

export default inbox;
