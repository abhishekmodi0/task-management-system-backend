const databaseConsts = {
    emailExists : `SELECT * FROM users WHERE email = ?`,
    registerUser : `INSERT INTO users (firstName, lastName, address, email, password) VALUES (?, ?, ?, ?, ?);`,
    validUser : `SELECT * FROM users WHERE email = ? AND password = ?;`,
    createTask : `INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, STR_TO_DATE(?, '%d-%m-%Y'));`,
    updateTask : `UPDATE tasks SET  title = ?, description = ?, due_date = STR_TO_DATE(?, '%d-%m-%Y') WHERE id = ?;`,
    updateTaskStatus : `UPDATE tasks SET status = ? WHERE id = ?;`,
    deleteTask : `UPDATE tasks SET is_delete = 1 WHERE id = ?;`,
    getAllTasksForUser : `SELECT * FROM tasks WHERE user_id = ? AND is_delete = 0 ORDER BY ID ASC;`
}

module.exports = databaseConsts;
