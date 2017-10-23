/*****************************************************************************/
/* Course: Event Handlers */
/*****************************************************************************/
Template.Course.events({
	'click #create-lecture-trigger': function() {
		// $('#create-lecture-modal').modal('open')
		$('#create-lecture-modal').openModal()
	},
	'click #cancel-create-lecture': function() {
		//Reset form
		$('#lectureName').val('')
		$('#lectureName').removeClass("invalid")
		//$('#create-lecture-modal').modal('close')
		$('#create-lecture-modal').closeModal()
	},
	'submit #create-lecture-form': function(event) {
		event.preventDefault();
		target = event.target
		var title = target.lectureName.value
		var user = Meteor.user()
		var course = Courses.findOne({code: Session.get('courseCode')})
		if (title == "") {
			$("#lectureName").removeClass("validate")
			$("#lectureName").removeClass("valid")
			$("#lectureName").addClass("invalid")
			$("#lectureName-label").attr("data-error", "Please give this lecture a title")
			Session.set("validLectureSection", false)
		} else if (Lectures.findOne({'lecture':title})) {
			$("#lectureName").removeClass("validate")
			$("#lectureName").removeClass("valid")
			$("#lectureName").addClass("invalid")
			$("#lectureName-label").attr("data-error", "This lecture already exists")
			Session.set("validLectureSection", false)
		} else if (course && course.instructors.indexOf(user._id) >= 0) {
			Meteor.call('addLecture', title, course.code, function(error, result) {
				if (error) {
					console.log(error)
					Materialize.toast('Error: ' + error.message, 8000)
				} else {
					$('#lectureName').val('')
					$('#lectureName').removeClass("invalid")
					// $('#create-lecture-modal').modal('close')
					$('#create-lecture-modal').closeModal()
					Materialize.toast('Lecture ' + title + ' has been created!', 4000)
				}
			})
		}
	}
});

/*****************************************************************************/
/* Course: Helpers */
/*****************************************************************************/
Template.Course.helpers({
	lectures: function() {
		var lectures = Lectures.find({courseCode: Session.get('courseCode')})
		if (lectures.count() > 0) return lectures
	},
	course: function() {
		//return course
		var course = Courses.findOne({
			'code': Session.get('courseCode'),
			'status': 'active'
		})
		if (course) return course
	},
	get_lecture: function(lecture_id) {
		var this_lecture = Lectures.findOne({_id: lecture_id});
		return this_lecture;
	}
});

/*****************************************************************************/
/* Course: Lifecycle Hooks */
/*****************************************************************************/
Template.Course.onCreated(function () {
});

Template.Course.onRendered(function () {
	Session.set("validLectureSection", false)
	var courseCode = Router.current().params.code
	if (courseCode) Session.set('courseCode', courseCode.toUpperCase())
	// $('#create-lecture-modal').modal()
	$('#class-size-tooltip').tooltip({delay: 50})

});

Template.Course.onDestroyed(function () {
});
