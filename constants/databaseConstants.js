const databaseConsts = {
    emailExists : `SELECT * FROM users WHERE email = ?`,
    registerUser : `INSERT INTO users (firstName, lastName, address, email, password, isAdmin) VALUES (?, ?, ?, ?, ?, ?);`,
    getUserList : 'SELECT id, CONCAT(`firstName`, " ", `lastName`) as fullName  FROM users WHERE isAdmin = 0;',
    getUserListByProject : `SELECT users.id, CONCAT(users.firstName, " ", users.lastName) as fullName 
    FROM users LEFT JOIN projectusers ON users.id = projectusers.userId WHERE projectusers.projectId = ?;`,
    createProject : `INSERT INTO projects (title, description, completionDate, updatedBy) VALUES (?, ?, STR_TO_DATE(?, '%d-%m-%Y'), ?);`,
    updateProject : `UPDATE projects SET  title = ?, description = ?, completionDate = STR_TO_DATE(?, '%d-%m-%Y'), updatedBy = ?  WHERE id = ?;`,
    getAllProjects: "SELECT *, DATE_FORMAT(completionDate, '%d-%m-%Y') AS completionDate FROM projects WHERE isDeleted = 0 AND updatedBy = ? ",
    getAllProjectsForUser: `SELECT DISTINCT projects.id, projects.*, DATE_FORMAT(projects.completionDate, '%d-%m-%Y') AS completionDate  FROM projectusers RIGHT JOIN projects
ON projects.id = projectusers.projectId WHERE projectusers.userId = ? `,
    getProjectById: "SELECT *, DATE_FORMAT(completionDate, '%d-%m-%Y') AS completionDate FROM projects WHERE id = ? ;",
    deleteProject : `UPDATE projects SET isDeleted = 1 WHERE id = ?;`,
    createTask : `INSERT INTO tasks (userId, title, description, dueDate, status, priorityLevel, tag, projectId, updatedBy, ownedBy) VALUES (?, ?, ?, STR_TO_DATE(?, '%d-%m-%Y'), ?, ?, ?, ?, ?, ?);`,
    updateTaskByUser : `UPDATE tasks SET  userId = ?, title = ?, description = ?, status = ? WHERE id = ?;`,
    updateTaskByAdmin : `UPDATE tasks SET  userId = ?, title = ?, description = ?, dueDate = STR_TO_DATE(?, '%d-%m-%Y'), status = ?, priorityLevel = ?, tag = ? WHERE id = ?;`,

    updateTaskStatus : `UPDATE tasks SET status = ? WHERE id = ?;`,
    deleteTask : `UPDATE tasks SET isDelete = 1 WHERE id = ?;`,
    getAllTasksForUser : `SELECT *, DATE_FORMAT(dueDate, '%d-%m-%Y') AS dueDate FROM tasks WHERE projectId = ? AND userId = ? AND isDelete = 0 ORDER BY ID ASC;`,
    getAllTasksForAdmin : `SELECT *, DATE_FORMAT(dueDate, '%d-%m-%Y') AS dueDate FROM tasks WHERE projectId = ? AND isDelete = 0 ORDER BY ID ASC;`,
    getTaskById : `SELECT *, DATE_FORMAT(dueDate, '%d-%m-%Y') AS dueDate FROM tasks WHERE id = ?`,
    getPriorityLevels : `SELECT * FROM prioritylevel;`,
    getAllStatuses : `SELECT * FROM status;`,
    getAllTagName : `SELECT * FROM tasktag;`,
    addProjectUsers: `INSERT IGNORE INTO projectusers (userId, projectId, updatedBy) VALUES ?;`,
    removeProjectUsers: `DELETE FROM projectusers WHERE userId IN (?) AND projectId = ?;`,
    updateProfile: `UPDATE users SET  firstName = ?, lastName = ?, email = ?, address = ? WHERE id = ?;`,
    getAllProjectsDueDateIsTomorrow: `SELECT p.title, DATE_FORMAT(p.completionDate, '%d-%m-%Y') AS completionDate, u.email,
        CONCAT(u.firstName, ' ', u.lastName) AS userName
        FROM task_manager_birdi.projects AS p
        JOIN projectusers as pu ON pu.projectId = p.id
        JOIN users AS u ON u.id = pu.userId
        WHERE p.completionDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL ? DAY) AND p.isDeleted = 0 ;`,
    getUserTasksDueDateIsTomorrow: `SELECT T.title, T.id, P.id AS projectId, (T.userId = T.ownedBy) AS selfOwner, 
        OU.email as OwnerEmail,
        concat(OU.firstName, " ", OU.lastName) AS OwnerFullName,
        DATE_FORMAT(T.dueDate, '%d-%m-%Y') AS dueDate, 
        concat(U.firstName, " ", U.lastName) AS fullName, 
        U.email,
        P.title AS projectTitle 
        FROM tasks AS T
        JOIN users AS U ON U.id = T.userId 
        JOIN users AS OU ON OU.id = T.ownedBy
        JOIN projects AS P ON P.id = T.projectId
        WHERE T.dueDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL ? DAY) AND T.isDelete = 0 AND P.isDeleted = 0 `,
    getMultipleUsers: `SELECT CONCAT(firstName, ' ', lastName) AS fullName, email from users WHERE id IN (?);`,
    getTaskDetails: `SELECT concat(U.firstName, " ", U.lastName) AS fullName, U.email, T.title, P.title AS projectTitle,
        PL.priorityLevel, TT.tagName, DATE_FORMAT(T.dueDate, '%d-%m-%Y') AS dueDate FROM tasks AS T
        JOIN users AS U ON U.id = T.userId
        JOIN projects AS P ON P.id = T.projectId
        JOIN prioritylevel AS PL ON PL.id = T.priorityLevel
        JOIN tasktag AS TT ON TT.id = T.tag
        WHERE T.id = ?;`
}

module.exports = databaseConsts;
