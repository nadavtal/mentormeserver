const config = require('../config.js');
const Sequelize = require("sequelize");
// const usersController = require('../controllers/usersController')
const data = require('./data')
// const UserModel = require('./user.model') 
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: config.pool,
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
const Event = sequelize.define("event", {

  name : {
    type: Sequelize.STRING
  },
  description : {
    type: Sequelize.STRING
  },
  image : {
    type: Sequelize.STRING
  },
  start : {
    type: Sequelize.DATE
  },
  language : {
    type: Sequelize.STRING
  },
  hostId: {
    type: Sequelize.INTEGER,
    // references: 'users', // <<< Note, its table's name, not object name
    // referencesKey: 'id' // <<< Note, its a column name
  },

  } 
);


const User = sequelize.define('user', {
  // id: {
  //   type: Sequelize.INTEGER,
  //   primaryKey: true
  // },
  // fname: {
  //   type: Sequelize.STRING,
  // },
  full_name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.STRING,
  },
  token: {
    type: Sequelize.STRING,
  },

  balance: {
    type: Sequelize.INTEGER,
  },
  status: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
  },
  language: {
    type: Sequelize.STRING,
  },
  rank: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0,
      max: 10
      // note: many validations need to be defined in the "validate" object
      // allowNull is so common that it's the exception
    }
  },
  isLoggedIn: {
    type: Sequelize.BOOLEAN,
  },
});
Event.belongsTo(User, {as: 'host'})

const Category = sequelize.define("category", {

  name : {
    type: Sequelize.STRING
  },
  icon : {
    type: Sequelize.STRING
  },
  color : {
    type: Sequelize.STRING
  },
  parentCategoryId : {
    type:   Sequelize.INTEGER
  }

});
const Subject = sequelize.define("subject", {

  name : {
    type: Sequelize.STRING,
    allowNull: false

  },
  description : {
    type: Sequelize.STRING,
    allowNull: false

  },
  min_education_length : {
    type: Sequelize.INTEGER
  },
  education_unit: {
    type: Sequelize.STRING
  },
  icon : {
    type: Sequelize.STRING
  },
  color : {
    type: Sequelize.STRING
  },
  difficulty : {
    type: Sequelize.INTEGER
  },
  createdBy : {
    type: Sequelize.INTEGER
  },
});
const Skill = sequelize.define("skill", {

  name : {
    type: Sequelize.STRING,
    allowNull: false

  },
  description : {
    type: Sequelize.STRING,
    allowNull: false

  },
});
const Field = sequelize.define("field", {

  name : {
    type: Sequelize.STRING,
    allowNull: false

  },
  description : {
    type: Sequelize.STRING
  },
  icon : {
    type: Sequelize.STRING
  },
  color : {
    type: Sequelize.STRING
  },
  
});

const Job = sequelize.define("job", {

  name : {
    type: Sequelize.STRING,
    allowNull: false

  },
  description : {
    type: Sequelize.STRING
  },
  min_education_length : {
    type: Sequelize.INTEGER
  },
  education_unit: {
    type: Sequelize.STRING
  },
  icon : {
    type: Sequelize.STRING
  },
  color : {
    type: Sequelize.STRING
  },
});
const Session = sequelize.define("session", {

  start : {
    type: Sequelize.DATE
  },
  end : {
    type: Sequelize.DATE
  },
  description : {
    type: Sequelize.STRING
  },
  createdByUserId: {
    type: Sequelize.INTEGER
  },
  updatedByUserId: {
    type: Sequelize.INTEGER
  },
  session_length: {
    type: Sequelize.INTEGER
  },
  min_cost_request: {
    type: Sequelize.INTEGER
  },
  cost: {
    type: Sequelize.INTEGER
  },
  max_cost_request: {
    type: Sequelize.INTEGER
  },
  privacy: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  },
  finalCost: {
    type: Sequelize.DECIMAL
  },

});
const Message = sequelize.define("message", {

  fromUserId: {
    type: Sequelize.INTEGER
  },
  toUserId: {
    type: Sequelize.INTEGER
  },
  folder: {
    type: Sequelize.INTEGER
  },
  dateOpened : {
    type: Sequelize.DATE
  },
  subject : {
    type: Sequelize.STRING
  },
  message : {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  },
  lables: {
    type: Sequelize.STRING
  },
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  
});
const Resource = sequelize.define("resource", {

  name : {
    type: Sequelize.STRING
  },
  link : {
    type: Sequelize.STRING
  },
  type : {
    type: Sequelize.STRING
  },
  lastUpdated : {
    type: Sequelize.DATE
  },
  uploadedByUserId: {
    type: Sequelize.INTEGER
  },
  cost: {
    type: Sequelize.INTEGER
  },
  views: {
    type: Sequelize.INTEGER
  },
  enrolled: {
    type: Sequelize.INTEGER
  },
  rate: {
    type: Sequelize.INTEGER
  },

  
});

const Offer = sequelize.define("offer", {

  type : {
    type: Sequelize.STRING
  },
  offer_amount: {
    type: Sequelize.INTEGER
  },
  status : {
    type: Sequelize.STRING
  },
  // createdByUserId: {
  //   type: Sequelize.INTEGER
  // }
  
});
const Article = sequelize.define("article", {

  type : {
    type: Sequelize.STRING
  },
  link: {
    type: Sequelize.STRING
  },

  // createdByUserId: {
  //   type: Sequelize.INTEGER
  // }
  
});
const Article_subjects = sequelize.define('article_subjects', {});

const EventCategory = sequelize.define("event_category", {})
const User_followers = sequelize.define("user_followers", {
  status: {
    type: Sequelize.STRING,
    defaultValue: 'Active'
  },
})
const RelatedSubjects =  sequelize.define('related_subjects', {
  required : {
    type: Sequelize.BOOLEAN
  },
  relationType : {
    type: Sequelize.STRING
  },
});
const User_fields = sequelize.define('user_fields', {
  status: {
    type: Sequelize.STRING
  },
});
const User_jobs = sequelize.define('user_jobs', {
  status: {
    type: Sequelize.STRING
  },
  date_stared: {
    type: Sequelize.DATE
  },
  date_ended: {
    type: Sequelize.DATE
  },
  is_current_job: {
    type: Sequelize.BOOLEAN
  }
});
// const User_offers = sequelize.define('user_offers', {
//   status: {
//     type: Sequelize.STRING
//   },
// });
const User_subjects = sequelize.define('user_subjects', {
  status: {
    type: Sequelize.STRING,
    defaultValue: 'Active'
  },
  min_price: {
    type: Sequelize.INTEGER,
  },
  fixed_price: {
    type: Sequelize.INTEGER,
  },
  max_price: {
    type: Sequelize.INTEGER,
  },
  price_method: {
    type: Sequelize.STRING,
  },
  years_experience: {
    type: Sequelize.INTEGER,
  },
});

const User_skills = sequelize.define('user_skills', {
  status: {
    type: Sequelize.STRING,
    defaultValue: 'Active'
  },
  min_price: {
    type: Sequelize.INTEGER,
  },
  fixed_price: {
    type: Sequelize.INTEGER,
  },
  max_price: {
    type: Sequelize.INTEGER,
  },
  price_method: {
    type: Sequelize.STRING,
  },
  years_experience: {
    type: Sequelize.INTEGER,
  },
});
const Session_users = sequelize.define('session_users', {
  role: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING,
    // defaultValue: false
  },
});
const Session_subjects = sequelize.define('session_subjects', {});
// const User_job_skills = sequelize.define('user_job_skills', {});
const Field_jobs = sequelize.define('field_jobs', {});
const User_articles = sequelize.define('user_articles', {
  isAuther: Sequelize.BOOLEAN,
});
const Field_subjects = sequelize.define('field_subjects', {});
const Field_skills = sequelize.define('field_skills', {});
const Skill_subjects = sequelize.define('skill_subjects', {});
const Job_subjects = sequelize.define('job_subjects', {
  required: {
    type: Sequelize.BOOLEAN
  }
});


Field.belongsToMany(Job, { through: Field_jobs });
Field.belongsToMany(Subject, { through: Field_subjects });
Field.belongsToMany(Skill, { through: Field_skills });
Subject.belongsToMany(Field, { through: Field_subjects });
Job.belongsToMany(Field, { through: Field_jobs });
Job.belongsToMany(Subject, { through: Job_subjects });
Subject.belongsToMany(Job, { through: Job_subjects });
Subject.belongsToMany(Skill, { through: Skill_subjects });
Skill.belongsToMany(Subject, { through: Skill_subjects });
Subject.belongsToMany(Subject, { through: RelatedSubjects, as: 'relatedSubjects' });
User.belongsToMany(Field, { through: User_fields });
User.belongsToMany(Skill, { through: User_skills });
User.belongsToMany(Article, { through: User_articles });
User.belongsToMany(User, { through: User_followers, as: 'followers' });
Skill.belongsToMany(User, { through: User_skills });
User.belongsToMany(Job, { through: User_jobs });
// User_jobs.belongsToMany(Skill, {through: User_job_skills})
User.belongsToMany(Subject, { through: User_subjects });
Subject.belongsToMany(User, { through: User_subjects });
Article.belongsToMany(Subject, { through: Article_subjects });
Subject.belongsToMany(Article, { through: Article_subjects });
Message.belongsTo(Offer)
// User.belongsToMany(Offer, { through: User_offers });
Session.belongsToMany(User, { through: Session_users });
User.belongsToMany(Session, { through: Session_users });
// User.belongsToMany(Session, { through: Session_users });
Session.belongsToMany(Subject, { through: Session_subjects });
Subject.belongsToMany(Session, { through: Session_subjects });
// Subject.hasOne(Session) // This will add subjectId to the Session table
Subject.hasOne(Resource) // This will add subjectId to the Resource table
Job.hasOne(Resource) // This will add jobId to the Resource table
// Offer.hasOne(Message) // This will add offerId to the Message table
Field.hasOne(Resource) // This will add fieldId to the Resource table
Session.hasOne(Message) // This will add sessionId to the Message table
Session.hasOne(Offer) // This will add sessionId to the Offer table
User.hasOne(Offer) // This will add userId to the Offer table

EventCategory.belongsTo(Event)
EventCategory.belongsTo(Category)

// return Event;
// db.event = require("./event.model.js")(sequelize, Sequelize);
// db.user = require("./user.model.js")(sequelize, Sequelize);
db.event = Event;
db.user = User;
db.category = Category;
db.eventCategory = EventCategory;
db.field = Field
db.subject = Subject;
db.article = Article;
db.skill = Skill;
db.job = Job;
db.session = Session;
db.resource = Resource;
db.job_subjects = Job_subjects
db.user_fields = User_fields
db.user_jobs = User_jobs

db.user_subjects = User_subjects;
db.user_articles = User_articles;
db.user_skills = User_skills;
db.field_skills = Field_skills;
// db.user_offers = User_offers;
db.related_subjects = RelatedSubjects;
db.session_users = Session_users;
db.session_subjects = Session_subjects;
db.article_subjects = Article_subjects;
db.field_jobs = Field_jobs;
db.field_subjects = Field_subjects;
db.skill_subjects = Skill_subjects;
db.message = Message;
db.offer = Offer;
db.user_followers = User_followers;

const sync = () => {
  // return sequelize.sync({force: true})
  return sequelize.sync()
}
const seed = async (numUsers) => {

  return sync()
    .then(() => {
      let promises = []
      // data.users.forEach((user, index) => index < numUsers && createUserPromise(user))
      for (let index = 0; index < numUsers; index++) {
        let user = data.users[index + 55];
        const email = `${user.name.split(' ').join('').toLowerCase()}@gmail.com`
  
        user.email = email
        const promise = createUserPromise(user);
        promises.push(promise)
      }

      return Promise.all(promises)
    }).then(users => {

    })
}
// seed(10);
// sync()
module.exports = db;