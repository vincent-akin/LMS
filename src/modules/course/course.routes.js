import express from 'express';
import { 
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse } from './course.controller.js';

import { authenticate } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/role.middleware.js';

const router = express.Router();

router.get('/', getCourses);

router.post('/', authenticate, authorize('instructor', 'admin'), createCourse);

router.put('/:id', authenticate, authorize('instructor', 'admin'), updateCourse);

router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourse);

export default router;