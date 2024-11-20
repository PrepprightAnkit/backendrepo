import { User } from '../models/student.models.js';
import { Course } from '../models/courses.model.js';

// Buy a course 
export const buyCourse = async (req, res) => {
    try {
        const userId = req.user._id; // assuming user is authenticated
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const user = await User.findById(userId);
        if (user.courses.some(c => c.course.toString() === courseId)) {
            return res.status(400).json({ message: 'Course already purchased' });
        }

        user.courses.push({ course: courseId });
        await user.save();

        res.status(200).json({ message: 'Course purchased successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update course progress
export const updateProgress = async (req, res) => {
    try {
        const userId = req.user._id; // assuming user is authenticated
        const { courseId, progress } = req.body;

        const user = await User.findById(userId);
        const course = user.courses.find(c => c.course.toString() === courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.progress = progress;
        await user.save();

        res.status(200).json({ message: 'Progress updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
