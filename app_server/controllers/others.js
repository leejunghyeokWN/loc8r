const index = (req, res) =>{
  res.render('index', {title: 'Express Home'});
};

const about = (req, res)=>{
  res.render('generic-text', {title: 'About'});
}

module.exports = {
  index,
  about
}