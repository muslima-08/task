const mongoose = require('mongoose')
const Task = require('../model/taskModel')

const dashCtrl = {
  dashboard: async (req, res) => {
    let perPage = 12;
    let page = req.query.page || 1;
    const locals = {
      title: "Dashboard",
      description: "Super NodeJs Tasks App"
    }

    try {
      const tasks = await Task.aggregate([
        { $sort: { updatedAt: -1 } },
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } }
      ]).skip(perPage * page - perPage)
        .limit(perPage)
        .exec()

      const count = await Task.find({ user: req.user.id }).count()


      res.render('dashboard/index',
        {
          userName: req.user.firstName,
          locals,
          tasks,
          layout: '../views/layouts/dashboard',
          current: page,
          pages: Math.ceil(count / perPage),
        })
    } catch (error) {
      console.log(error);
    }
  },

  // add new task POST
  addTask: async (req, res) => {
    req.body.user = req.user.id;
    try {
      await Task.create(req.body)
      res.redirect('/dashboard')
    } catch (error) {
      console.log(error);
    }
  },
  // Get add page

  addPage: async (req, res) => {
    res.render('dashboard/add', { layout: "../views/layouts/dashboard" })
  },

  // View a task

  viewtask: async (req, res) => {
    const { id } = req.params;
    try {
      const task = await Task.findById(id)
      if (task) {
        res.render('dashboard/view-task', {
          taskId: id,
          task,
          layout: '../views/layouts/dashboard',
        })
      } else {
        res.send("Something went wrong. Please try again later")
      }
    } catch (error) {
      console.log(error);
    }
  },

  // update Task
  updateTask: async (req, res) => {
    const { id } = req.params;
    const { title, body } = req.body
    try {
      await Task.findOneAndUpdate({ _id: id }, { title, body, updatedAt: Date.now() })
      res.redirect('/dashboard')
    } catch (error) {
      console.log(error);
    }
  },

  // Delte task
  deleteTask: async (req, res) => {
    const { id } = req.params;
    try {
      await Task.deleteOne({ _id: id })
      res.redirect('/dashboard')
    } catch (error) {
      console.log(error);
    }
  },

  // Search tasks Pgae get
  searchTask: async (req, res) => {
    try {
      res.render('dashboard.search', {
        searchResult: '',
        layout: '../views/layouts/dashboard'
      })
    } catch (error) {
      console.log(error);
    }
  },

  // Search Tasks Post

  searchResultTask: async (req, res) => {
    try {
      const { searchTerm } = req.body;

      const key = new RegExp(searchTerm, 'i')
      const searchResult = await Task.find({
        $or: [
          { title: { $regex: key } },
          { body: { $regex: key } }
        ]
      })
      res.render('dashboard/search', {

        searchResult,
        layout: '../views/layouts/dashboard'
      })
    } catch(error) {
    console.log(error);
  }
}

}

module.exports = dashCtrl