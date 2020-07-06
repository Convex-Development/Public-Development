var cards = [
  ["front-face-g", "back-face-g", "gold-membership", "cancel-g", "golden-membership-button"],
  ["front-face-b", "back-face-b", "bronze-membership", "cancel-b", "bronze-membership-button"],
  ["front-face-r", "back-face-r", "royalty-membership", "cancel-r", "royalty-membership-button"]
]

var backfaceCards = [
  ["back-face-g-front", "back-face-g-back", "credit-card", "back-face-g-back-debit", "debit-card"],
  ["back-face-b-front", "back-face-b-back", "credit-card1", "back-face-b-back-debit", "debit-card1"],
  ["back-face-r-front", "back-face-r-back", "credit-card2", "back-face-r-back-debit", "debit-card2"]
]

var scrollbarlist = [
  ["scroll-bar-knob", "gold-scroll-info", 5],
  ["scroll-bar-knob1", "gold-scroll-info1", 5],
  ["scroll-bar-knob2", "gold-scroll-info2", 7.00],
  ["scroll-bar-knob3", "gold-scroll-info3", 7.00],
  ["scroll-bar-knob4", "gold-scroll-info4", 1.75],
  ["scroll-bar-knob5", "gold-scroll-info5", 1.75]
]

for(i in backfaceCards){
  document.getElementById(backfaceCards[i][2]).addEventListener("click", function(){
    for(v in backfaceCards){
      if(backfaceCards[v][2]==event.target.id){
        document.getElementById(backfaceCards[v][0]).style.animation = "flipY 0.3s normal";
        document.getElementById(backfaceCards[v][0]).style.visibility = "hidden";
        document.getElementById(backfaceCards[v][0]).style.transform = "rotateX(-180deg)";
        document.getElementById(backfaceCards[v][0]).parentElement.id = "visible";
        document.getElementById(backfaceCards[v][1]).style.animation = "unflipY 0.3s normal";
        document.getElementById(backfaceCards[v][1]).style.transform = "rotateX(0deg)";
        document.getElementById(backfaceCards[v][1]).style.visibility = "visible";
      }
    }
  });
  document.getElementById(backfaceCards[i][4]).addEventListener("click", function(){
    for(v in backfaceCards){
      if(backfaceCards[v][4]==event.target.id){
        document.getElementById(backfaceCards[v][0]).style.animation = "flipY 0.3s normal";
        document.getElementById(backfaceCards[v][0]).style.visibility = "hidden";
        document.getElementById(backfaceCards[v][0]).style.transform = "rotateX(-180deg)";
        document.getElementById(backfaceCards[v][0]).parentElement.id = "visible";
        document.getElementById(backfaceCards[v][3]).style.animation = "unflipY 0.3s normal";
        document.getElementById(backfaceCards[v][3]).style.transform = "rotateX(0deg)";
        document.getElementById(backfaceCards[v][3]).style.visibility = "visible";
      }
    }
  })
}

for(i in cards){
  document.getElementById(cards[i][4]).addEventListener("click", function() {
    for(v in cards){
      console.log(event.target.id)
      if(cards[v][4]==event.target.id){
        document.getElementById(cards[v][0]).style.animation = "flip 0.3s normal";
        document.getElementById(cards[v][0]).style.visibility = "hidden";
        document.getElementById(cards[v][0]).style.transform = "rotateX(-180deg)";
        document.getElementById(cards[v][0]).parentElement.id = "visible";
        document.getElementById(cards[v][1]).children[0].style.visibility = "visible";
        document.getElementById(cards[v][4]).style.visibility = "hidden";
        document.getElementById(cards[v][1]).style.animation = "unflip 0.3s normal";
        document.getElementById(cards[v][1]).style.transform = "rotateY(0deg)";
        document.getElementById(cards[v][1]).style.visibility = "visible";
      }
    }
  });
  document.getElementById(cards[i][3]).addEventListener("click", function() {
    for(v in cards){
      if(cards[v][3]==event.target.id){
        document.getElementById(cards[v][0]).style.animation = "unflip 0.3s normal";
        document.getElementById(cards[v][0]).style.transform = "rotateY(0deg)";
        document.getElementById(cards[v][1]).style.animation = "flip 0.3s normal";
        document.getElementById(cards[v][1]).style.transform = "rotateY(180deg)";
        document.getElementById(cards[v][0]).style.visibility = "visible";
        document.getElementById(cards[v][4]).style.visibility = "visible";
        document.getElementById(cards[v][1]).style.visibility = "hidden";
        document.getElementById(cards[v][1]).children[0].style.visibility = "hidden";
        document.getElementById(cards[v][0]).parentElement.id = cards[v][2];
      }
    }
  });
}

function scroll(scroll_id, text_id, cost){
  var scroll_bar = document.getElementById(scroll_id);
  var text = document.getElementById(text_id)
  if(scroll_bar.value<=1){
    var amount = scroll_bar.value*cost;
    text.innerHTML = `${scroll_bar.value} month - ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}`;
  } else {
    var amount = scroll_bar.value*cost;
    text.innerHTML = `${scroll_bar.value} months - ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD'})}`;
  }
}

for(i in scrollbarlist){
  document.getElementById(scrollbarlist[i][0]).addEventListener("input", function(){
    for(i in scrollbarlist){
      scroll(scrollbarlist[i][0], scrollbarlist[i][1], scrollbarlist[i][2]);
    }
  });
}