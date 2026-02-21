const express = require('express');
const router = express.Router();
const { createJob, getOpenJobs, getJobById, getClientJobs, acceptJob, submitJob, approveJob, extendJob, bidOnJob, getJobBids, selectWorker, rateJob, getRecommendedJobs, getWorkerBidInfo } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', authMiddleware, checkRole('client'), getClientJobs);
router.post('/', authMiddleware, checkRole('client'), upload.single('question_file'), createJob);
router.get('/open', authMiddleware, checkRole('worker'), getOpenJobs);
router.get('/recommended', authMiddleware, getRecommendedJobs);
router.get('/:id', authMiddleware, getJobById);
router.get('/:id/bid-info', authMiddleware, checkRole('worker'), getWorkerBidInfo);
router.post('/:id/accept', authMiddleware, checkRole('worker'), acceptJob);
router.post('/:id/submit', authMiddleware, checkRole('worker'), upload.single('submission_file'), submitJob);
router.post('/:id/approve', authMiddleware, checkRole('client'), approveJob);
router.post('/:id/extend', authMiddleware, checkRole('worker'), extendJob);
router.post('/:id/bid', authMiddleware, checkRole('worker'), bidOnJob);
router.get('/:id/bids', authMiddleware, checkRole('client'), getJobBids);
router.post('/:id/select', authMiddleware, checkRole('client'), selectWorker);
router.post('/:id/rate', authMiddleware, checkRole('client'), rateJob);

module.exports = router;
