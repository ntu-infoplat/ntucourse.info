var logger = require('log4js').getLogger('service:db.js');
var config = _require('/config.json');


/* pgsql start */
var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  host: config.db.host,
  dialect: 'postgres',
  //logging: false
});

var User = sequelize.import(__dirname + "/db_schema/user");
var Schedule = sequelize.import(__dirname + "/db_schema/schedule");
var Course = sequelize.import(__dirname + "/db_schema/course");
var Review = sequelize.import(__dirname + "/db_schema/review");
var PttReview = sequelize.import(__dirname + "/db_schema/pttReview");
var CourseComment = sequelize.import(__dirname + "/db_schema/courseComment");
var ReviewComment = sequelize.import(__dirname + "/db_schema/reviewComment");

// Sync all models that aren't already in the database
sequelize.sync()

//建立關係
//一個user有多個課表
User.hasMany(Schedule, { onDelete: 'cascade' });
Schedule.belongsTo(User);

//一門課有多個評論
Course.hasMany(CourseComment, { onDelete: 'cascade' });
CourseComment.belongsTo(Course);

//一門課有多個評價
Course.hasMany(Review, { onDelete: 'cascade' });
Review.belongsTo(Course);

//一門評價有多個評論
/*
Review.hasMany(ReviewComment, { onDelete: 'cascade' });
ReviewComment.belongsTo(Review);
*/

var DB = {
	sequelize: sequelize,
	User: User,
	Schedule: Schedule,
	Course: Course,
	Review: Review,
	PttReview: PttReview,
	CourseComment: CourseComment,
	ReviewComment: ReviewComment
}

module.exports = DB;