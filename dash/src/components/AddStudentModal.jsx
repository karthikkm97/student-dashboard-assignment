import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setStudents } from '../store/studentsSlice';

const BASE_URL = 'https://student-dashboard-backend-89ff.onrender.com';

const AddStudentModal = ({ isOpen, onClose }) => {
  const [student, setStudent] = useState({
    name: '',
    cohort: '',
    courses: [],
    status: 'active',
    dateJoined: '',
    lastLogin: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleCourseChange = (e, index) => {
    const updatedCourses = [...student.courses];
    updatedCourses[index] = e.target.value;
    setStudent((prevStudent) => ({
      ...prevStudent,
      courses: updatedCourses,
    }));
  };

  const addCourse = () => {
    setStudent((prevStudent) => ({
      ...prevStudent,
      courses: [...prevStudent.courses, ''],
    }));
  };

  const removeCourse = (index) => {
    const updatedCourses = student.courses.filter((_, i) => i !== index);
    setStudent((prevStudent) => ({
      ...prevStudent,
      courses: updatedCourses,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the values before sending to the backend to confirm they are correct
    console.log("Date Joined: ", student.dateJoined);
    console.log("Last Login: ", student.lastLogin);
  
    const studentData = {
      ...student,
      dateJoined: student.dateJoined ? student.dateJoined : null,
      lastLogin: student.lastLogin ? student.lastLogin : null,
    };
  
    if (!studentData.name || !studentData.cohort) {
      alert('Please fill in all required fields.');
      return;
    }
  
    try {
      await axios.post(`${BASE_URL}/students`, studentData);
  
      const response = await axios.get(`${BASE_URL}/students`);
      dispatch(setStudents(response.data));
  
      setSuccessMessage('Student added successfully!');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
      }, 1000);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  
    setStudent({
      name: '',
      cohort: '',
      courses: [],
      status: 'active',
      dateJoined: '',
      lastLogin: '',
    });
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Add New Student</h2>

        {successMessage && <div className="mb-4 text-green-600">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Student Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={student.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="cohort">
              Cohort
            </label>
            <input
              type="text"
              id="cohort"
              name="cohort"
              value={student.cohort}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Courses</label>
            {student.courses.map((course, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={course}
                  onChange={(e) => handleCourseChange(e, index)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder={`Course ${index + 1}`}
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="dateJoined">
              Date Joined
            </label>
            <input
              type="datetime-local"
              id="dateJoined"
              name="dateJoined"
              value={student.dateJoined}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="lastLogin">
              Last Login
            </label>
            <input
              type="datetime-local"
              id="lastLogin"
              name="lastLogin"
              value={student.lastLogin}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={student.status}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white font-medium bg-blue-600 rounded-lg"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
