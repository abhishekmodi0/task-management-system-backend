const taskRouter = require("express").Router();

const taskValidator = require('../validators/task.validator');
const taskController = require('../controllers/task.controller');

taskRouter.get('/getFormFields', taskController.getFormFields);

taskRouter.get('/:projectId/list', taskValidator.paramProjectIdValidation, taskController.getProjectTasks);

taskRouter.post('/create', taskValidator.createTask, taskController.createTask);

taskRouter.put('/edit/:id', taskValidator.editTask, taskController.editTask);

taskRouter.delete('/delete/:id', taskValidator.paramIdValidation, taskController.deleteTask);

taskRouter.get('/getById/:id', taskValidator.paramIdValidation, taskController.getTaskById);

module.exports = taskRouter;
