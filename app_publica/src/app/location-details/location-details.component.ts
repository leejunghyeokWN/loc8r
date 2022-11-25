import { Component, OnInit, Input } from '@angular/core';
import { Loc8rDataService } from '../loc8r-data.service';
import { Location, Review } from '../location';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.css']
})
export class LocationDetailsComponent implements OnInit {

  @Input() location: Location;

  public newReview:Review = {
    author: '',
    rating: 5,
    reviewText: ''
  };
  public formVisible: boolean = false;
  public formError: string;

  public googleAPIKey: string = 'AIzaSyBc3jHp2d2JaHN9Q3aC328_AuNWnnt8cA8'

  constructor(private loc8rDataService: Loc8rDataService) { }

  ngOnInit(): void {
  }

  private isFormValid(): boolean{
    if(this.newReview.author && this.newReview.rating && this.newReview.reviewText){
      return true;
    }
    return false
  }

  private resetAndHideReviewForm(){
    this.formVisible = false;
    this.newReview.author = '';
    this.newReview.rating = 5;
    this.newReview.reviewText = '';
  }

  public onReviewSubmit():void{
    this.formError = '';
    if(this.isFormValid()){
      this.loc8rDataService.addReviewByLocationId(this.location._id, this.newReview)
        .then((review:Review) => {
          console.log('review saved.', review);
          let reviews = this.location.reviews.slice(0);
          reviews.unshift(review);
          this.location.reviews = reviews;
          this.resetAndHideReviewForm();
        });
    } else{
      this.formError = 'All fields required, please try again.';
    }
  }

}
