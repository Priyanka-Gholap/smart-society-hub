import express from 'express';
import {
  createAlert,
  getAlerts,
  activateDisasterMode,
  deactivateDisasterMode,
  submitSOS,
  updateSafetyStatus,
  getSafetyStatus,
  createShelter,
  getShelters,
  addResource,
  getResources,
  registerVolunteer,
  getVolunteers,
} from '../controllers/disaster/disasterController.js';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Alerts and Disaster Mode
router.post('/alerts', authorize('society_admin', 'super_admin'), createAlert);
router.get('/alerts', getAlerts);
router.post('/activate-disaster-mode', authorize('society_admin', 'super_admin'), activateDisasterMode);
router.post('/deactivate-disaster-mode', authorize('society_admin', 'super_admin'), deactivateDisasterMode);

// Safety Status
router.post('/safety-status', updateSafetyStatus);
router.get('/safety-status', getSafetyStatus);

// SOS
router.post('/sos', submitSOS);

// Shelters
router.post('/shelters', authorize('society_admin', 'super_admin'), createShelter);
router.get('/shelters', getShelters);

// Resources
router.post('/resources', authorize('society_admin', 'super_admin'), addResource);
router.get('/resources', getResources);

// Volunteers
router.post('/volunteers/register', registerVolunteer);
router.get('/volunteers', getVolunteers);

export default router;
