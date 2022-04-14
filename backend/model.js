const pg = require("pg");

const dbconfig = {
	host: "localhost",
	user: "kakao",
	password: "kakao1!",
	database: "kakao",
	port: "5432",
	dialectOptions: {
		charset: "utf8mb4",
		dateStrings: true,
		typeCast: true,
	},
	timezone: "Asia/Seoul",
};

const client = new pg.Client(dbconfig);

client.connect();

// UserId로 회원조회
exports.getMemberByLoginId = async (userId) => {
	let data = null;
	const sql = "SELECT id, user_id, password FROM users WHERE user_id = $1";
	const response = await client.query(sql, [userId]);

	if (response.rows.length != 0) {
		data = response.rows[0];
	}
	return data;
};

// 회원조회
exports.getApprovers = async () => {
	let data = null;
	const sql = "SELECT id, user_id FROM users";
	const response = await client.query(sql);

	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// 문서 생성
exports.postDocument = async (documentData) => {
	let data = null;
	const sql =
		"INSERT INTO document (title, category, content, status, user_id) VALUES ($1, $2, $3, '결제진행중', $4) RETURNING *";
	const response = await client.query(sql, [
		documentData.title,
		documentData.category,
		documentData.content,
		documentData.user_id,
	]);

	if (response.rows.length != 0) {
		data = response.rows[0];
	}
	return data;
};

// 결제선 생성
exports.postDocumentApprovers = async (approversData) => {
	let data = null;
	const sql =
		'INSERT INTO document_approver (document_id, "order", user_id) VALUES ($1, $2, $3) RETURNING *';
	const response = await client.query(sql, [
		approversData.document_id,
		approversData.order,
		approversData.user_id,
	]);
	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// 결제상태 수정
exports.patchDocumentApproveStatus = async (documentId, order) => {
	let data = null;
	const sql = `UPDATE document_approver SET status = '진행중' WHERE document_id = $1 AND "order" = $2`;
	const response = await client.query(sql, [documentId, order]);

	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// OUTBOX 문서목록조회
exports.getOutboxList = async (userId) => {
	let data = null;
	const sql = `
        SELECT document.id, document.title, document.category, document.status, users.user_id 
        FROM document
        JOIN users  
        ON document.user_id = users.id
        WHERE document.user_id = $1
        AND status = '결제진행중'`;
	const response = await client.query(sql, [userId]);

	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// Inbox 문서목록조회
exports.getInboxList = async (userId) => {
	let data = null;
	const sql = `
        SELECT document.id, document.title, document.category, document.status, users.user_id 
        FROM document
        JOIN users  
        ON document.user_id = users.id
        JOIN document_approver
        ON document.id = document_approver.document_id
        AND document_approver.user_id = $1
        AND document_approver.status = '진행중'`;
	const response = await client.query(sql, [userId]);

	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// Archive 문서목록조회
exports.getArchiveList = async (userId) => {
	let data = null;
	const sql = `
        SELECT DISTINCT document.id, document.title, document.category, document.status, users.user_id 
        FROM document
        JOIN users  
        ON document.user_id = users.id
        JOIN document_approver
        ON document.id = document_approver.document_id
        WHERE document.status != '결제진행중'
        AND (document.user_id = $1 OR document_approver.user_id = $1)`;
	const response = await client.query(sql, [userId]);

	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// 문서상세조회
exports.getDocumentById = async (documentId) => {
	let data = null;
	const sql = `
        SELECT id, title, category, content, user_id
		FROM document
		WHERE id = $1`;
	const response = await client.query(sql, [documentId]);

	if (response.rows.length != 0) {
		data = response.rows[0];
	}
	return data;
};

// 문서결제자조회
exports.getDocumentApproverById = async (documentId) => {
	let data = null;
	const sql = `
        SELECT users.user_id, document_approver.status, document_approver.review
		FROM document_approver
		JOIN users
		ON users.id = document_approver.user_id
		WHERE document_approver.document_id = $1`;
	const response = await client.query(sql, [documentId]);

	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// 문서 결제
exports.patchIsApprove = async (approvalData, status) => {
	let data = null;
	const sql = `
        UPDATE document_approver 
        SET status = $1, review = $2 
        WHERE user_id = $3
        AND document_id = $4`;
	const response = await client.query(sql, [
		status,
		approvalData.review,
		approvalData.user_id,
		approvalData.document_id,
	]);

	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// 문서 상태 변경
exports.patchDocumentStatus = async (documentId, status) => {
	let data = null;
	const sql = `
        UPDATE document
        SET status = $1
        WHERE id = $2`;
	const response = await client.query(sql, [status, documentId]);

	if (response.rows.length != 0) {
		data = response.rows;
	}
	return data;
};

// 결제문서 조회
exports.isApprovingDocument = async (documentId) => {
	let data = null;
	const sql = `
        SELECT "order" 
        FROM document_approver
        WHERE document_id = $1
        AND status IS NULL
        ORDER BY "order" ASC
        LIMIT 1`;
	const response = await client.query(sql, [documentId]);

	if (response.rows.length != 0) {
		data = response.rows[0].order;
	}
	return data;
};

// user
// id
// login_id
// password

// document
// id
// title
// category
// content
// status
// user_id

// document_approve
// document_id
// order
// user_id
// status
// review
