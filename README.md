 //Calculates learner grades from course data, assignments, and submissions

## Parameters
- *course* (Object): Course information containing `id` and `name`
- *ag* (Object): Assignment group containing `id`, `name`, `course_id`, `group_weight`, and an array of `assignments`
- *submissions* (Array): Array of learner submissions, each containing `learner_id`, `assignment_id`, and submission details (`submitted_at`, `score`)

## Returns
Returns an array of objects, one per learner, containing:
- `id`: The learner's ID
- `avg`: The learner's weighted average (total points earned / total points possible)
- Assignment scores: Individual assignment IDs as keys with their percentage scores as values


## Notes
- Assignments not yet due are excluded from calculations
- Late submissions incur a 10% penalty (deducted from points_possible)
- Assignment group must belong to the specified course