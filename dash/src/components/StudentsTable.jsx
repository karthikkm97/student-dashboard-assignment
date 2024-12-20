import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStduentModal';
import { useDispatch, useSelector } from 'react-redux';
import { setStudents } from '../store/studentsSlice';
import axios from 'axios';
import { DateTime } from 'luxon';  // Import Luxon for date handling
import c1 from '../image/c1.png';
import c2 from '../image/c2.png';

const BASE_URL = 'http://localhost:5000';

const StudentsTable = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Manage Edit Modal
  const students = useSelector((state) => state.students);
  const [selectedStudent, setSelectedStudent] = useState(null); // Store selected student for edit
  const dispatch = useDispatch();

  const openAddModal = () => setModalOpen(true);
  const closeAddModal = () => setModalOpen(false);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedStudent(null);
    setEditModalOpen(false);
  };

  useEffect(() => {
    // Fetch student data from the backend on initial load
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/students/`);
        
        // Sort students in ascending order based on 'name' or 'date_joined'
        const sortedStudents = response.data.sort((a, b) => a.name.localeCompare(b.name)); // Ascending order by name
  
        // Dispatch data to Redux store
        dispatch(setStudents(sortedStudents));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
  
    fetchStudents();
  }, [dispatch]);
  
  
  

  // Handle student updates
  const onStudentUpdated = (updatedStudent) => {
    const updatedStudents = students.map((student) =>
      student.id === updatedStudent.id ? updatedStudent : student
    );
    dispatch(setStudents(updatedStudents));
    closeEditModal();
  };

  // Handle student deletion
  const onStudentDeleted = (deletedStudentId) => {
    const updatedStudents = students.filter((student) => student.id !== deletedStudentId);
    dispatch(setStudents(updatedStudents));
    closeEditModal();
  };

  // Helper function to format date only (using Luxon)
  const formatDate = (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.isValid ? date.toLocaleString(DateTime.DATE_MED) : 'N/A';
  };
  
  const formatDateTime = (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.isValid ? date.toLocaleString(DateTime.DATETIME_MED) : 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Filters Section */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg flex items-center gap-2">
            AY 2024-25
            <ChevronDown className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-lg flex items-center gap-2">
            CBSE 9
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <button
          className="px-4 py-2 text-sm text-white font-medium bg-blue-600 rounded-lg"
          onClick={openAddModal}
        >
          + Add new Student
        </button>
      </div>

      {/* Table Section */}
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm border-b">
            <th className="px-4 py-3 font-medium">Student Name</th>
            <th className="px-4 py-3 font-medium">Cohort</th>
            <th className="px-4 py-3 font-medium">Courses</th>
            <th className="px-4 py-3 font-medium">Date Joined</th>
            <th className="px-4 py-3 font-medium">Last login</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {students && students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td
                  className="px-4 py-3 text-sm font-medium text-blue-600 cursor-pointer"
                  onClick={() => openEditModal(student)}
                >
                  {student.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{student.cohort}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 items-center">
                    {student.courses.map((course, i) => {
                      const defaultImage = i % 2 === 0 ? c1 : c2;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <img
                            src={student.photoUrl || defaultImage}
                            alt="course-icon"
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="px-2 py-1 bg-gray-100 text-xs rounded font-medium text-gray-600">
                            {course}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(student.date_joined)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDateTime(student.last_login)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`h-3 w-3 inline-block rounded-full ${
                      student.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-600">
                No students available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modals */}
      <AddStudentModal isOpen={isModalOpen} onClose={closeAddModal} />
      {selectedStudent && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          student={selectedStudent}
          onStudentUpdated={onStudentUpdated}
          onStudentDeleted={onStudentDeleted}
        />
      )}
    </div>
  );
};

export default StudentsTable;
