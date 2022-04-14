const express = require("express");
const service = require("./service");

const router = express.Router();

//로그인
router.post("/login", async (req, res) => {
	const response = await service.login(req);
	return res.status(200).json(response);
});

//결제자 목록조회
router.get("/approver", async (req, res) => {
	const response = await service.getApprovers();
	return res.status(200).json(response);
});

//문서 생성
router.post("/document", async (req, res) => {
	const response = await service.postDocument(req);
	return res.status(200).json(response);
});

//OUTBOX 문서목록조회
router.get("/documents-out", async (req, res) => {
	const response = await service.getOutboxList(req);
	return res.status(200).json(response);
});

//INBOX 문서목록조회
router.get("/documents-in", async (req, res) => {
	const response = await service.getInboxList(req);
	return res.status(200).json(response);
});

//ARCHIVE 문서목록조회
router.get("/documents-archive", async (req, res) => {
	const response = await service.getArchiveList(req);
	return res.status(200).json(response);
});

//문서 상세조회
router.get("/document/:document_id", async (req, res) => {
	const response = await service.getDocument(req);
	return res.status(200).json(response);
});

//문서 결제
router.post("/document/approval", async (req, res) => {
	const response = await service.documentApproval(req);
	return res.status(200).json(response);
});

module.exports = router;
