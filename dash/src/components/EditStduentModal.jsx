import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://student-dashboard-backend-89ff.onrender.com';

const EditStudentModal = ({
  isOpen,
  onClose,
  student,
  onStudentUpdated,
  onStudentDeleted,
}) => {
  const [formData, setFormData] = useState({
    name: student?.name || "",
    cohort: student?.cohort || "",
    courses: student?.courses || [],
    date_joined: student?.date_joined || "",
    last_login: student?.last_login || "",
    status: student?.status || "active",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        cohort: student.cohort,
        courses: student.courses,
        date_joined: student.date_joined
          ? formatDateTimeInput(student.date_joined)
          : "",
        last_login: student.last_login
          ? formatDateTimeInput(student.last_login)
          : "",
        status: student.status || "active",
      });
    }
  }, [student]);

  const formatDateTimeInput = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    const localDate = new Date(
      parsedDate.getTime() - parsedDate.getTimezoneOffset() * 60000
    );

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours() + 1).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCoursesChange = (e, index) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index] = e.target.value;
    setFormData({ ...formData, courses: updatedCourses });
  };

  const addCourse = () => {
    setFormData({ ...formData, courses: [...formData.courses, ""] });
  };

  const removeCourse = (index) => {
    const updatedCourses = formData.courses.filter((_, i) => i !== index);
    setFormData({ ...formData, courses: updatedCourses });
  };

  const handleSubmit = async (e, mode) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };

      // Convert date fields to UTC if present
      if (updatedData.date_joined) {
        updatedData.date_joined = convertToUTC(updatedData.date_joined);
      }
      if (updatedData.last_login) {
        updatedData.last_login = convertToUTC(updatedData.last_login);
      }

      if (mode === "update") {
        const response = await axios.put(
          `${BASE_URL}/students/${student.id}`,
          updatedData
        );
        onStudentUpdated(response.data);

        // Show success message in alert box
        window.alert("Student data updated successfully!");

      } else if (mode === "delete") {
        await axios.delete(`${BASE_URL}/students/${student.id}`);
        onStudentDeleted(student.id);

        // Show success message in alert box
        window.alert("Student deleted successfully!");
      }

      onClose();
    } catch (error) {
      console.error(`Error during ${mode} operation:`, error);
    }
  };

  const convertToUTC = (localDate) => {
    // The datetime-local value is in local time, so just append "Z" for UTC storage
    const date = new Date(localDate);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 className="text-lg font-medium mb-4">Update Student Details</h2>

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
              onClick={(e) => handleSubmit(e, "delete")}
            >
              Delete
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              onClick={(e) => handleSubmit(e, "update")}
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

