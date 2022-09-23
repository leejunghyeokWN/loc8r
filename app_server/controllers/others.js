const index = (req, res) =>{
  res.render('index', {title: 'Express Home'});
};

const about = (req, res)=>{
  res.render('index', {title: 'About'});
}

module.exports = {
  index,
  about
}