
const db = require('../models/index')


const getJob = async (req, res) => {
  try {
    const job = await db.job.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: db.subject
        },
        {
          model: db.field
        },
      ]
    })
    res.send(job)
  } catch (error) {
    throw error
    // res.send(error)
  }
 };


module.exports = {
  getJob
};