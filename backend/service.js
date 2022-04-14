const req = require("express/lib/request");
const jwt = require("jsonwebtoken");
const model = require("./model");

// 로그인
exports.login = async (req) => {
	const userId = req.body.login_id;
	const password = req.body.password;

	const memberData = await model.getMemberByLoginId(userId);
	if (!memberData) return null;

	if (password !== memberData.password) {
		return null;
	}

	//로그인 정보 일치시 토큰발급
	const token = await encodeToken({
		data: {
			user_id: memberData.id,
		},
	});
	return token;
};

// 토큰발급
const encodeToken = async (payload) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXP_TIME,
				issuer: process.env.JWT_ISSUER,
			},
			(err, token) => (err ? reject(err) : resolve(token))
		);
	});
};

// 토큰 해체
const decodeToken = async (req) => {
	// const token =
	// 	req.headers["x-access-token"] || req.query.token || req.cookies.token;
	// if (!token) throwError("JsonWebTokenError", 400);

	const token =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJfaWQiOjF9LCJpYXQiOjE2NDk5MDYxNTIsImV4cCI6MTY1MDUxMDk1MiwiaXNzIjoia2FrYW90ZXN0ZXIifQ.2l2PVkfwUO_LNlgRJACFcx7a_QgWegqLXufJGYyiwdQ";

	let decodedToken = null;

	decodedToken = jwt.decode(token);

	return decodedToken.data.user_id;
};

// 결제자 목록조회
exports.getApprovers = async () => {
	const approvers = await model.getApprovers();

	return approvers;
};

// 결제문서 작성
exports.postDocument = async (req) => {
	const userId = await decodeToken(req);

	// 문서 생성
	const documentData = {
		title: req.body.title,
		category: req.body.category,
		content: req.body.content,
		user_id: userId,
	};
	const document = await model.postDocument(documentData);
	const documentId = document.id;

	// 결제선 지정
	const approvers = req.body.approvers;

	for (let i = 0; i < approvers.length; i += 1) {
		const approversData = {
			document_id: documentId,
			order: i + 1,
			user_id: approvers[i],
		};
		await model.postDocumentApprovers(approversData);
	}

	await model.patchDocumentApproveStatus(documentId, 1);

	return approvers;
};

// OUTBOX 문서목록조회
exports.getOutboxList = async (req) => {
	const userId = await decodeToken(req);
	const outboxList = await model.getOutboxList(userId);

	return outboxList;
};

// Inbox 문서목록조회
exports.getInboxList = async (req) => {
	const userId = await decodeToken(req);
	const inboxList = await model.getInboxList(userId);

	return inboxList;
};

// Archive 문서목록조회
exports.getArchiveList = async (req) => {
	const userId = await decodeToken(req);
	const archiveList = await model.getArchiveList(userId);

	return archiveList;
};

// 문서상세조회
exports.getDocument = async (req) => {
	const documentId = req.params.document_id;
	const documentDetail = await model.getDocumentById(documentId);
	const documentApprovers = await model.getDocumentApproverById(documentId);

	documentDetail.approver = documentApprovers;

	return documentDetail;
};

// 문서결제
exports.documentApproval = async (req) => {
	let response = null;
	const userId = await decodeToken(req);
	const isApprove = req.body.is_approve;
	const documentId = req.body.document_id;
	const approvalData = {
		user_id: userId,
		document_id: documentId,
		review: req.body.review ? req.body.review : "",
	};

	// 거절시
	if (isApprove == "N") {
		// 결제자 거절수정
		await model.patchIsApprove(approvalData, "거절");
		// 문서상태 거절
		await model.patchDocumentStatus(documentId, "결제거절");
	}

	// 승인시
	if (isApprove == "Y") {
		// 결제자 승인수정
		await model.patchIsApprove(approvalData, "승인");

		const order = await model.isApprovingDocument(documentId);

		if (order) {
			// 다음결제자 결제진행
			console.log(documentId, order);
			await model.patchDocumentApproveStatus(documentId, order);
		} else {
			// 결제자가 전부 완료된경우 문서상태 승인
			await model.patchDocumentStatus(documentId, "결제승인");
		}
	}

	return response;
};
