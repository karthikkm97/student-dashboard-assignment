import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://student-dashboard-backend-89ff.onrender.com';

const EditStudentModal = ({ isOpen, onClose, student, onStudentUpdated, onStudentDeleted }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    cohort: student?.cohort || '',
    courses: student?.courses || [],
    date_joined: student?.date_joined || '',
    last_login: student?.last_login || '',
    status: student?.status || 'active',
  });

  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        cohort: student.cohort,
        courses: student.courses,
        date_joined: student.date_joined ? formatDateTimeInput(student.date_joined) : '',
        last_login: student.last_login ? formatDateTimeInput(student.last_login) : '',
        status: student.status || 'active',
      });
    }
  }, [student]);

  // Format date to 'YYYY-MM-DDTHH:mm' for datetime-local input
  const formatDateTimeInput = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle datetime fields
    if (name === 'date_joined' || name === 'last_login') {
      const formattedDate = formatDateTimeInput(value); // Ensure the date is in the correct format
      setFormData({ ...formData, [name]: formattedDate });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCoursesChange = (e, index) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index] = e.target.value;
    setFormData({ ...formData, courses: updatedCourses });
  };

  const addCourse = () => {
    setFormData({ ...formData, courses: [...formData.courses, ''] });
  };

  const removeCourse = (index) => {
    const updatedCourses = formData.courses.filter((_, i) => i !== index);
    setFormData({ ...formData, courses: updatedCourses });
  };

  const handleSubmit = async (e, mode) => {
    e.preventDefault();
    try {
      if (mode === 'update') {
        const response = await axios.put(`${BASE_URL}/students/${student.id}`, formData);
        onStudentUpdated(response.data);
        setSuccessMessage('Student data updated successfully!');
      } else if (mode === 'delete') {
        await axios.delete(`${BASE_URL}/students/${student.id}`);
        onStudentDeleted(student.id);
        setSuccessMessage('Student deleted successfully!');
      }

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1000);
    } catch (error) {
      console.error(`Error during ${mode} operation:`, error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 className="text-lg font-medium mb-4">Update Student Details</h2>

        {successMessage && (
          <div className="mb-4 text-green-600">{successMessage}</div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Student Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Cohort</label>
            <input
              type="text"
              name="cohort"
              value={formData.cohort}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Courses</label>
            {formData.courses.map((course, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={course}
                  onChange={(e) => handleCoursesChange(e, index)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <button
                  type="button"
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded-lg"
                  onClick={() => removeCourse(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={addCourse}
            >
              + Add Course
            </button>
          </div>

          {/* Date Joined */}
          <div>
            <label className="block text-sm font-medium">Date Joined</label>
            <input
              type="datetime-local"
              name="date_joined"
              value={formData.date_joined}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Last Login */}
          <div>
            <label className="block text-sm font-medium">Last Login</label>
            <input
              type="datetime-local"
              name="last_login"
              value={formData.last_login}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={(e) => handleSubmit(e, 'delete')}
            >
              Delete
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={(e) => handleSubmit(e, 'update')}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
