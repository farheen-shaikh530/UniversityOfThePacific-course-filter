const cors = require('cors');
app.use(cors());

app.get('/api/courses', async (req, res) => {
  const query = req.query.q;

  try {
    const courses = await Course.find({
      uop_course_code: { $regex: query, $options: 'i' }
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});