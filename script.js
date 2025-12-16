// The provided course information.
//const CourseInfo = {
  //id: 451,
 // name: "Introduction to JavaScript"
//};

// // The provided assignment group.
// const AssignmentGroup = {
//   id: 12345,
//   name: "Fundamentals of JavaScript",
//   course_id: 451,
//   group_weight: 25,
// //   assignments: [
// //     {
//       id: 1,
//       name: "Declare a Variable",
//       due_at: "2023-01-25",
//       points_possible: 50
//     },
//     {
//       id: 2,
//       name: "Write a Function",
//       due_at: "2023-02-27",
//       points_possible: 150
//     },
//     {
//       id: 3,
//       name: "Code the World",
//       due_at: "3156-11-15",
//       points_possible: 500
//     }
//   ]
// };

// // The provided learner submission data.
// const LearnerSubmissions = [
//   {
//     learner_id: 125,
//     assignment_id: 1,
//     submission: {
//       submitted_at: "2023-01-25",
//       score: 47
//     }
//   },
//   {
//     learner_id: 125,
//     assignment_id: 2,
//     submission: {
//       submitted_at: "2023-02-12",
//       score: 150
//     }
//   },
//   {
//     learner_id: 125,
//     assignment_id: 3,
//     submission: {
//       submitted_at: "2023-01-25",
//       score: 400
//     }
//   },
//   {
//     learner_id: 132,
//     assignment_id: 1,
//     submission: {
//       submitted_at: "2023-01-24",
//       score: 39
//     }
//   },
//   {
//     learner_id: 132,
//     assignment_id: 2,
//     submission: {
//       submitted_at: "2023-03-07",
//       score: 140
//     }
//   }
// ];

// function getLearnerData(course, ag, submissions) {
//   // here, we would process this data to achieve the desired result.
//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0 // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833 // late: (140 - 15) / 150
//     }
//   ];

//   return result;
// }

// const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

// console.log(result);








function getLearnerData(course, ag, submissions) {
  try {
    // Validate that assignment group belongs to the course
    if (ag.course_id !== course.id) {
      throw new Error("Assignment group does not belong to this course");
    }

    const now = new Date();
    const learnerData = {};

    
    for (const sub of submissions) {
      const learnerId = sub.learner_id;
      const assignmentId = sub.assignment_id;
      
      // Find the corresponding assignment
      const assignment = ag.assignments.find(a => a.id === assignmentId);
      
      if (!assignment) {
        console.warn(`Assignment ${assignmentId} not found`);
        continue;
      }

      // Skip if assignment not yet due
      const dueDate = new Date(assignment.due_at);
      if (dueDate > now) {
        continue;
      }

      // Validate points_possible
      if (assignment.points_possible === 0) {
        throw new Error(`Assignment ${assignmentId} has 0 points possible`);
      } else if (assignment.points_possible < 0) {
        throw new Error(`Assignment ${assignmentId} has negative points possible`);
      }

      
      if (!learnerData[learnerId]) {
        learnerData[learnerId] = {
          id: learnerId,
          totalScore: 0,
          totalPossible: 0,
          assignments: {}
        };
      }

      // Calculate score with late penalty
      let score = sub.submission.score;
      const submittedDate = new Date(sub.submission.submitted_at);
      
      // Apply 10% deduction if submitted late
      if (submittedDate > dueDate) {
        score -= assignment.points_possible * 0.1;
      //  console.log(`Late penalty applied for learner ${learnerId} on assignment ${assignmentId}`);
      } else {
        //console.log(`On-time submission for learner ${learnerId} on assignment ${assignmentId}`);
      }

      // Calculate percentage for this assignment
      const percentage = score / assignment.points_possible;
      
      // Categorize performance using switch statement
      let performanceCategory;
      switch (true) {
        case percentage >= 0.9:
          performanceCategory = 'Excellent';
          break;
        case percentage >= 0.8:
          performanceCategory = 'Good';
          break;
        case percentage >= 0.7:
          performanceCategory = 'Satisfactory';
          break;
        case percentage >= 0.6:
          performanceCategory = 'Needs Improvement';
          break;
        default:
          performanceCategory = 'Failing';
      }
     // console.log(`Learner ${learnerId} - Assignment ${assignmentId}: ${performanceCategory} (${(percentage * 100).toFixed(1)}%)`);
      
      // Store assignment score
      learnerData[learnerId].assignments[assignmentId] = percentage;
      
      // Add to totals for weighted average
      learnerData[learnerId].totalScore += score;
      learnerData[learnerId].totalPossible += assignment.points_possible;
    }

   
    const result = [];
    for (const learnerId in learnerData) {
      const learner = learnerData[learnerId];
      
      // Calculating weighted average
      const avg = learner.totalPossible > 0 
        ? learner.totalScore / learner.totalPossible 
        : 0;
      
      const output = {
        id: learner.id,
        avg: avg
      };
      
    
      for (const assignmentId in learner.assignments) {
        output[assignmentId] = learner.assignments[assignmentId];
      }
      
      result.push(output);
    }

    return result;

  } catch (error) {
    console.error("Error processing learner data:", error.message);
    throw error;
  }
}

// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);

