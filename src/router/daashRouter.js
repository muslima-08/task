const router = require("express").Router();
const  isLoggedIn = require('../middleware/checkAuth');
const dashCtrl = require('../controller/dashboardCtrl');

router.get('/dashboard', isLoggedIn, dashCtrl.dashboard);
router.post('/dashboard/add', isLoggedIn,  dashCtrl.addTask);
router.get('/dashboard/add', isLoggedIn,  dashCtrl.addPage);
router.get('/dashboard/item/:id', isLoggedIn,  dashCtrl.viewtask);
router.post('dashboard/item-update/:id', isLoggedIn, dashCtrl.updateTask);
router.get('dashboard/item-delete/:id', isLoggedIn, dashCtrl.deleteTask);
router.get('dashboard/search', isLoggedIn, dashCtrl.searchTask);
router.post('dashboard/search', isLoggedIn, dashCtrl.searchResultTask);

 
module.exports = router;

