const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const doSetAverageRating = (location) =>{
  if(location.reviews && location.reviews.length > 0){
    const count = location.reviews.length;
    const total = location.reviews.reduce((acc, {rating}) =>{ //(previous value, current value)
      return acc + rating;
    }, 0);
    location.rating = parseInt(total / count, 10); //두 번째 인자는 10진수를 의미
    location.save(err => {
      if(err){
        console.log(err);
      } else{
        console.log(`Average rating updated to ${location.rating}`);
      }
    });
  }
};

const updateAverageRating = (locationId) =>{
  Loc.findById(locationId)
    .select('rating reviews')
    .exec((err, location) =>{
      if(err){
        console.log(err);
      } else{
        doSetAverageRating(location);
      }
    });
};

const doAddReview = (req, res, location) =>{
  if(!location){
    res
      .status(404)
      .json({"message": "Location not found"});
  } else{
    const {author, rating, reviewText} = req.body;
    location.reviews.push({
      author,
      rating,
      reviewText
    });
    location.save((err, location) =>{
      if(err){
        res
          .status(400)
          .json(err);
      } else{
        updateAverageRating(location._id);
        const thisReview = location.reviews.slice(-1).pop();
        res
          .status(201)
          .json(thisReview);
      }
    });
  }
};

const reviewsReadOne = (req, res) => {
  Loc
    .findById(req.params.locationid)
    .select('name reviews')
    .exec((err, location) => {
      if(!location){
        return res
          .status(404)
          .json({"message": "location not found"});
      } else if(err){
        return res
          .status(404)
          .json(err);
      }

      if(location.reviews && location.reviews.length > 0){
        const review = location.reviews.id(req.params.reviewid);

        if(!review){ //리뷰 목록 중에서 아이디 검색했는데 안나옴
          return res
            .status(404)
            .json({"message": "wrong review ID"});
        } else{ //성공
          const response = {
            location:{
              name: location.name,
              id: req.params.locationid
            },
            review
          };
          return res
            .status(200)
            .json(response);
        }
      } else{ //해당 Locaiton에 리뷰가 없음
        return res
          .status(404)
          .json({"message": "No reviews found"});
      }
    });
};
const reviewsCreate = (req, res) => {
  const locationId = req.params.locationid;
  if (locationId){
    Loc
      .findById(locationId)
      .select('reviews')
      .exec((err, location) =>{
        if(err){
          res
            .status(400)
            .json(err);
        } else{
          doAddReview(req, res, location);
        }
      });
  } else{
    res
      .status(404)
      .json({"message": "Location not found"});
  }
};
const reviewsUpdateOne = (req, res) => {
  if(!req.params.locationid || !req.params.reviewid){
    return res
      .status(404)
      .json({
        "message": "Not found, locationid and reviewid are both required"
      });
  }
  //파라미터가 둘 다 있다.
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec((err, location)=>{
      if(!location){
        return res
          .status(404)
          .json({
            "message": "Location not found"
          });
      } else if (err){
        return res
          .status(400)
          .json(err);
      }
      if(location.reviews && location.reviews.length > 0){
        const thisReview = location.reviews.id(req.params.reviewid);
        if(!thisReview){ //리뷰ID로 리뷰를 찾지 못함.
          res
            .status(400)
            .json({
              "message": "Review not found"
            });
        } else{
          thisReview.author = req.body.author;
          thisReview.rating = req.body.rating;
          thisReview.reviewText = req.body.reviewText;
          location.save((err, location)=>{
            if(err){
              res
                .status(404)
                .json(err);
            } else{
              updateAverageRating(location._id);
              res
                .status(200)
                .json(thisReview);
            }
          });
        }
      } else{ //해당 로케이션에 리뷰가 없다.
        res
          .status(404)
          .json({
            "message": "No review to update"
          }
        );
      }
    }
  );
};

const reviewsDeleteOne = (req, res) => {
  console.log(req.params);
  const {locationid, reviewid} = req.params;
  if(!locationid || !reviewid){
    return res
      .status(404)
      .json({
        "message": "Not found, locationid and review id are both required"
      });
  }
  Loc
    .findById(locationid)
    .select('reviews')
    .exec((err, location) =>{
      if(!location){
        return res
          .status(404)
          .json({"message": "Location not found"});
      } else if(err){
        return res
          .status(404)
          .json({"message": "Location not found ERR"});
      }
      if(location.reviews && location.reviews.length>0){
        if(!location.reviews.id(reviewid)){
          return res
            .status(404)
            .json({"message": "Review not found"});
        } else{
          location.reviews.id(reviewid).remove();
          location.save(err =>{
            if(err){
              return res
                .status(404)
                .json({"message": "Location save ERROR"});
            } else{
              updateAverageRating(location._id);  
              return res
                .status(204)
                .json(null);
            }
          });
        }
      } else{
        return res
          .status(404)
          .json({"message": "No review to delete"});
      }
    });
};

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
}