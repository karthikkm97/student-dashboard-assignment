require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { DateTime } = require('luxon');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// CRUD Routes

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany();

    // Format the date fields before sending the response
    const formattedStudents = students.map(student => {
      return {
        ...student,
        date_joined: student.date_joined ? DateTime.fromJSDate(student.date_joined).toISO() : null,
        last_login: student.last_login ? DateTime.fromJSDate(student.last_login).toISO() : null,
      };
    });

    res.json(formattedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

// Get a specific student by ID
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(id) },
    });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Format the date fields before sending the response
    const formattedStudent = {
      ...student,
      date_joined: student.date_joined ? DateTime.fromJSDate(student.date_joined).toISO() : null,
      last_login: student.last_login ? DateTime.fromJSDate(student.last_login).toISO() : null,
    };

    res.json(formattedStudent);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Error fetching student' });
  }
});

// Create a new student
app.post('/students', async (req, res) => {
  const { name, cohort, courses, dateJoined, lastLogin, status } = req.body;

  // Log the received values to check if they are correct
  console.log("Received Date Joined: ", dateJoined);
  console.log("Received Last Login: ", lastLogin);

  // Parse the incoming date values (if available)
  const parsedDateJoined = dateJoined ? DateTime.fromISO(dateJoined, { zone: 'utc' }) : null;
  const parsedLastLogin = lastLogin ? DateTime.fromISO(lastLogin, { zone: 'utc' }) : null;

  // Log the parsed date values
  console.log("Parsed Date Joined: ", parsedDateJoined ? parsedDateJoined.toISO() : null);
  console.log("Parsed Last Login: ", parsedLastLogin ? parsedLastLogin.toISO() : null);

  // If the parsed date is valid, convert it to JavaScript Date
  const formattedDateJoined = parsedDateJoined && parsedDateJoined.isValid
    ? parsedDateJoined.toJSDate()
    : null;

  const formattedLastLogin = parsedLastLogin && parsedLastLogin.isValid
    ? parsedLastLogin.toJSDate()
    : null;

  // Log the final formatted date values
  console.log("Formatted Date Joined: ", formattedDateJoined);
  console.log("Formatted Last Login: ", formattedLastLogin);

  try {
    const newStudent = await prisma.student.create({
      data: {
        name,
        cohort,
        courses: Array.isArray(courses) ? courses : [],
        date_joined: formattedDateJoined || new Date(),  // Default to current date if not provided
        last_login: formattedLastLogin || new Date(),   // Default to current date if not provided
        status,
      },
    });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Error creating student' });
  }
});

// Update a student
app.put('/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name, cohort, courses, date_joined, last_login, status } = req.body;

  // Parse incoming dates and default to current time if invalid
  const parsedDateJoined = date_joined ? new Date(date_joined) : null;
  const parsedLastLogin = last_login ? new Date(last_login) : new Date();

  if (isNaN(parsedDateJoined)) {
    return res.status(400).json({ error: 'Invalid date_joined value' });
  }
  if (isNaN(parsedLastLogin)) {
    return res.status(400).json({ error: 'Invalid last_login value' });
  }

  try {
    const updatedStudent = await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
        name,
        cohort,
        courses: Array.isArray(courses) ? courses : [],
        date_joined: parsedDateJoined,
        last_login: parsedLastLogin,
        status,
      },
    });
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Error updating student' });
  }
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.student.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Error deleting student' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
