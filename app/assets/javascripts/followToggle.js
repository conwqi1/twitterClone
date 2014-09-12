$.FollowToggle = function (el, options) {
  this.$el = $(el);
  this.userId = this.$el.data("user-id") || options.userId;
  this.followState = this.$el.data("initial-follow-state") || options.followState;
  this.render();
  this.$el.on("click", this.handleClick.bind(this));
};

$.FollowToggle.prototype.render = function(){
  if(this.followState === "following" || this.followState == "unfollowing") {
    this.$el.prop("disabled", true);
  } else {
    this.$el.prop("disabled", false);
  }
  
  if (this.followState === "followed") {
    this.$el.text("Unfollow!");
  } else if (this.followState === "following") {
    this.$el.text("Following...");
  } else if (this.followState === "unfollowing") {
    this.$el.text("Unfollowing...");
  } else {
    this.$el.text("Follow!");
  }
};

$.FollowToggle.prototype.toggleFollowState = function () {
  if (this.followState === "followed" || this.followState === "unfollowing") {
    this.followState = "unfollowed";
  } else {
    this.followState = "followed";
  }
};

$.FollowToggle.prototype.handleClick = function(event){
  event.preventDefault();
  
  if (this.followState === "followed") {
    this.followState = "unfollowing";
    this.render();
  } else if (this.followState === "unfollowed") {
    this.followState = "following";
    this.render();
  }
  
  var obj = {
    dataType: "json",
    url: "/users/" + this.userId + "/follow",
    success: (function () {
      this.toggleFollowState();
      this.render();
    }.bind(this)),
    error: (function () {console.log("Something went wrong!")})
  };
  
  if(this.followState === "followed" || this.followState === "following") {
    obj["type"] = "POST";
  } else {
    obj["type"] = "DELETE";
  }
  $.ajax(obj);
};

$.fn.followToggle = function (options) {
  return this.each(function () {
    new $.FollowToggle(this, options);
  });
};

