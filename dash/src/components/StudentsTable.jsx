import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import { useDispatch, useSelector } from 'react-redux';
import { setStudents } from '../store/studentsSlice';
import axios from 'axios';
import { FixedSizeList } from 'react-window'; // For virtualization
import { DateTime } from 'luxon'; // Import Luxon for date handling
import c1 from '../image/c1.png';
import c2 from '../image/c2.png';

const BASE_URL = 'https://student-dashboard-backend-89ff.onrender.com';

const StudentsTable = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // Manage Edit Modal
  const [selectedStudent, setSelectedStudent] = useState(null); // Store selected student for edit
  const [page, setPage] = useState(1); // Current page number
  const [pageSize] = useState(20); // Number of students per page
  const [hasMore, setHasMore] = useState(true); // To track if more students are available
  const [loading, setLoading] = useState(false); // Track loading state
  const students = useSelector((state) => state.students);
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

  const fetchStudents = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/students`, {
        params: { page, size: pageSize },
      });

      const fetchedStudents = response.data;

      // If fewer students are returned than pageSize, there are no more students to fetch
      if (fetchedStudents.length < pageSize) {
        setHasMore(false);
      }

      dispatch(setStudents([...students, ...fetchedStudents]));
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.isValid ? date.toLocaleString(DateTime.DATE_MED) : 'N/A';
  };

  const formatDateTime = (dateString) => {
    const date = DateTime.fromISO(dateString);
    return date.isValid ? date.toLocaleString(DateTime.DATETIME_MED) : 'N/A';
  };

  const loadMoreStudents = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const Row = ({ index, style }) => {
    const student = students[index];
    if (!student) return null;

    return (
      <div style={style} className="border-b last:border-b-0 hover:bg-gray-50 flex">
        <div
          className="px-4 py-3 text-sm font-medium text-blue-600 cursor-pointer w-1/6"
          onClick={() => openEditModal(student)}
        >
          {student.name}
        </div>
        <div className="px-4 py-3 text-sm text-gray-600 w-1/6">{student.cohort}</div>
        <div className="px-4 py-3 w-1/6">
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
        </div>
        <div className="px-4 py-3 text-sm text-gray-600 w-1/6">{formatDate(student.date_joined)}</div>
        <div className="px-4 py-3 text-sm text-gray-600 w-1/6">{formatDateTime(student.last_login)}</div>
        <div className="px-4 py-3 w-1/6">
          <span
            className={`h-3 w-3 inline-block rounded-full ${
              student.status === 'active' ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></span>
        </div>
      </div>
    );
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
      {students.length > 0 ? (
        <FixedSizeList
          height={400}
          itemCount={students.length}
          itemSize={60}
          onScroll={({ scrollDirection, scrollOffset }) => {
            if (scrollDirection === 'forward' && scrollOffset > students.length * 60 - 200) {
              loadMoreStudents();
            }
          }}
          itemData={students}
        >
          {Row}
        </FixedSizeList>
      ) : (
        <div className="text-center py-4 text-gray-600">No students available</div>
      )}

      {/* Modals */}
      <AddStudentModal isOpen={isModalOpen} onClose={closeAddModal} />
      {selectedStudent && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          student={selectedStudent}
        />
      )}
    </div>
  );
};

export default StudentsTable;
