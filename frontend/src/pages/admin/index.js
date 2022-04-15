import React, { useEffect, useState } from "react";
import { Input, Button, Select, Modal, Transfer } from "antd";
import axios from "axios";

const Data = [
	{ key: 1, title: "황순환 대표" },
	{ key: 2, title: "송보은 차장" },
	{ key: 3, title: "이영현 사원" },
	{ key: 4, title: "현규섭 대표" },
	{ key: 5, title: "박상일 리더" },
];

function AdminPage() {
	const { TextArea } = Input;
	const { Option } = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const [targetKeys, setTargetKeys] = useState([]);
	const [selectedKeys, setSelectedKeys] = useState([]);

	const [dataList, setDataList] = useState([]);
	const [getData, setGetData] = useState([]);

	const onChange = (e) => {
		console.log(e);
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
		// console.log('targetKeys:', nextTargetKeys);
		// console.log('direction:', direction);
		// console.log('moveKeys:', moveKeys);
		setTargetKeys(nextTargetKeys);
	};

	const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
		// console.log('sourceSelectedKeys:', sourceSelectedKeys);
		// console.log('targetSelectedKeys:', targetSelectedKeys);
		setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
	};

	const api = async () => {
		let res = await axios.get("http://localhost:4000/approver");
		setGetData(res.data);
	};

	const postDocument = async () => {};

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
					<Input size={"large"} style={{ width: 320 }} onChange={onChange} />
				</div>
				<br />
				<br />
				<div style={{ display: "flex", alignItems: "center" }}>
					<div style={{ width: "50px" }}>분류</div>
					<Select
						size={"large"}
						defaultValue="lucy"
						style={{ width: 320 }}
						onChange={onChange}
					>
						<Option value="jack">휴가</Option>
						<Option value="lucy">일반</Option>
					</Select>
				</div>
				<br />
				<br />
				<div style={{ display: "flex", alignItems: "center" }}>
					<div style={{ width: "50px" }}>내용</div>
					<TextArea size={"large"} onChange={onChange} />
				</div>
			</div>
		</div>
	);
}

export default AdminPage;
