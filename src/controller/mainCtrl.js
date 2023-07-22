
const mainCtrl = {
  home: async (req, res) => {
    const locals = {
      title: "Node JS Task App ",
      description: "Free NodeJs Tasks App"
    }
    res.render('index', {
      locals,
      layout: '../ views / layouts / front - pahe'
    });
  },

  about: async (req, res) => {
    const locals = {
      title: "About Nodejs task app ",
      description: "Free NodeJs Tasks App"
    }
    res.render('about', {locals });
  }
}

module.exports = mainCtrl