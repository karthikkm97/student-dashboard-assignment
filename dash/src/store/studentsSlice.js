// src/store/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const studentsSlice = createSlice({
  name: 'students',
  initialState: [],
  reducers: {
    // Add a new student to the list
    addStudent: (state, action) => {
      state.push(action.payload);
    },
    
    // Set all students in the state (used for fetching data)
    setStudents: (state, action) => {
      // Sort the students in ascending order by name (or any field you prefer)
      return action.payload.sort((a, b) => a.name.localeCompare(b.name)); // Ascending order by name
    },

    // Update a student's data in the list
    updateStudent: (state, action) => {
      const index = state.findIndex((student) => student.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;  // Update student details at the index
      }
    },

    // Remove a student from the list
    deleteStudent: (state, action) => {
      return state.filter((student) => student.id !== action.payload);
    },
  },
});

export const { addStudent, setStudents, updateStudent, deleteStudent } = studentsSlice.actions;
export default studentsSlice.reducer;
