const Course = require("../models/courseModel");

/**
 * Creates a course
 *
 * @param {*} req
 * @param {*} res
 */
const coursePost = async (req, res) => {
  let course = new Course(req.body);
  await course.save()
    .then(course => {
      res.status(201); // CREATED
      res.header({
        'location': `/api/courses/?id=${course.id}`
      });
      res.json(course);
    })
    .catch( err => {
      res.status(422);
      console.log('error while saving the course', err);
      res.json({
        error: 'There was an error saving the course'
      });
    });
};

/**
 * Get all courses or one
 *
 * @param {*} req
 * @param {*} res
 */
const courseGet = (req, res) => {
  // if an specific teacher is required
  if (req.query && req.query.id) {
    Course.findById(req.query.id).populate('teacher')
      .then( (course) => {
        res.json(course);
      })
      .catch(err => {
        res.status(404);
        console.log('error while queryting the course', err)
        res.json({ error: "Course doesnt exist" })
      });
  } else {
    // get all teachers
    Course.find().populate('teacher')
      .then( courses => {
        res.json(courses);
      })
      .catch(err => {
        res.status(422);
        res.json({ "error": err });
      });
  }
};

/**
 * Update a course
 *
 * @param {*} req
 * @param {*} res
 */
const courseUpdate = async (req, res) => {
  const { id, name, credits, teacher } = req.body;

  // Verifica si se recibe el ID
  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    // Actualiza el curso según el ID
    const updatedCourse = await Course.findByIdAndUpdate(id, { name, credits, teacher }, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse); // Devuelve el curso actualizado
  } catch (err) {
    res.status(422).json({ error: 'Error updating the course', details: err });
  }
};

/**
 * Delete a course
 *
 * @param {*} req
 * @param {*} res
 */
const courseDelete = async (req, res) => {
  const { id } = req.query;

  // Verifica si se recibe el ID
  if (!id) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course successfully deleted' });
  } catch (err) {
    res.status(422).json({ error: 'Error deleting the course', details: err });
  }
};


module.exports = {
  coursePost,
  courseGet,
  courseUpdate,
  courseDelete
}