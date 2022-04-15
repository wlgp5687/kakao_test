import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

function outbox() {
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
		let res = await axios.get("http://localhost:4000/documents-out");
		setGetData(res.data);
	};

	useEffect(() => {
		api();
	}, []);

	useEffect(() => {
		const listData = [];
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
	}, [getData]);

	return (
		<div>
			<Table columns={columns} dataSource={dataList}></Table>
		</div>
	);
}

export default outbox;
