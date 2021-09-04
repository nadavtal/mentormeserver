
const db = require('../models/index')
const sessionsController = require('./sessionsController')
const sequelize = require("sequelize");
const {or, and, gt, lt} = sequelize.Op;
const keyword_extractor = require("keyword-extractor");

const getSkills = async (req, res) => {
  console.log(req.query)
  if (req.query.name.includes(' ')) {
    const extraction_result = keyword_extractor.extract(req.query.name, {
      language: 'english',
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true,
    });
    let allskills = []
    const words = req.query.name.split(' ')
    console.log(extraction_result)
    for (let word of extraction_result) {
      if (word.length) {
        try {
          const skills = await db.skill.findAll({
            where: {
              name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + word + '%')
            },
          })
          allskills = [...allskills, ...skills]
          
        } catch (err) {
          throw err
        }

      }
    }
    res.send(allskills)
  } else {
    try {
      const skills = await db.skill.findAll({
        where: {
          name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + req.query.name + '%')
        },
      })
      res.send(skills)
    } catch (err) {
      throw err
    }

  }
  // try {
  //   const skills = await db.skill.findAll({
  //     where: {
  //       name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + req.query.name + '%')
  //     },
  //   })
  //   res.send(skills)
  // } catch (err) {
  //   throw err
  // }
}

const createNewSkill = async (req, res) => {
  try {
    const skill = await db.skill.create({
      name: req.body.newSkill.name,
      description: req.body.newSkill.description,
      createdBy: req.body.newSkill.createdBy
    })

    const skillId = skill.dataValues.id
    let userSkillData = {...req.body.userSkill};

    userSkillData['skillId'] = skillId;
    // console.log('userSkillData', userSkillData)
    const userSkill = await db.user_skills.create(userSkillData)

    let skillSubjects = req.body.subjectsIds.map(subjectId => {
        return {
            skillId,
            subjectId
        }
    })
    console.log('skillSubjects', skillSubjects)
    let fieldSkills = req.body.fieldIds.map(fieldId => {
        return {
            skillId,
            fieldId
        }
    })
    const fieldSkillsResult = await db.field_skills.bulkCreate(fieldSkills, {
          returning: true
        })
    const skillSubjectsResult = await db.skill_subjects.bulkCreate(skillSubjects, {
          returning: true
        })
    console.log('req.body.userSubjects', req.body.userSubjects)
    const userSubjectsResult = await db.user_subjects.bulkCreate(req.body.userSubjects, {
          returning: true
        })

    console.log('userSubjectsResult', userSubjectsResult)
    skill.dataValues.user_skills = userSkill.dataValues
    res.send(skill)
  }
  catch (err) {
    res.send(err)
  }
}

module.exports = {
  createNewSkill,
  getSkills
};