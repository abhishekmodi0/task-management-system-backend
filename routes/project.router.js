const projectRouter = require("express").Router();

const projectValidator = require('../validators/project.validators');
const projectController = require('../controllers/project.controller');
const userController = require('../controllers/user.controller');
const { validateAdminUser } = require('../utility/authorization');


projectRouter.post('/create', projectValidator.createProject, projectController.createProject);

projectRouter.put('/edit/:id', validateAdminUser, projectValidator.editProject, projectController.editProject);

projectRouter.delete('/delete/:id', validateAdminUser, projectValidator.paramIdValidation, projectController.deleteProject);

projectRouter.get('/getAllProjects', projectController.getAllProjects);

projectRouter.get('/getById/:id', validateAdminUser, projectValidator.paramIdValidation, projectController.getProjectById);

projectRouter.get('/users', validateAdminUser, userController.getUsersList);

projectRouter.get('/users/:projectId', validateAdminUser,  projectValidator.paramProjectIdValidation, userController.getUsersListByProject);

module.exports = projectRouter;
