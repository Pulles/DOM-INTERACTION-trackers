
var checkChatIntervalID;
console.log('chat geladen');
var checkButton = function() {
  if (document.querySelector('.LPMimage')) {
    console.log('hophop chat');
    try {
      let chatLink = document.querySelector('.LPMimage');
      chatLink.addEventListener('click', function(e) {
        console.log(e);
        let status  = e.target.alt;
        tc_events_23(this, 'eventGA', {
          actionGA: 'click on a careline open link',
          labelGA: 'Careline Chat opened on ' + location.pathname+' with status ' + status,
          eventGA: 'open careline',
          categoryGA: 'Component - interaction: careline Chat',
        });
      });
      clearInterval(checkButtonIntervalID);
      checkChatIntervalID = window.setInterval(checkChat, 500);
    } catch (e) {
      console.log(e);
      clearInterval(checkButtonIntervalID);
      checkChatIntervalID = window.setInterval(checkChat, 500);
    }
}
};
// measure the form submit
var checkChat = function() {
  if (document.querySelector('.lp_submit_button')) {
    console.log('hophop button geladen');
    try {
      let chatButton = document.querySelectorAll('.lp_submit_button');
      chatButton.forEach(function(item) {
        item.addEventListener('click', function() {
          tc_events_23(this, 'eventGA', {
            actionGA: 'click on a careline submit',
            labelGA: 'Careline Chat form ' + location.pathname,
            eventGA: 'submit form careline',
            categoryGA: 'Component - interaction: careline Chat',
          });
        });
      });
      clearInterval(checkChatIntervalID);
    } catch (e) {
      console.log(e);
      clearInterval(checkChatIntervalID);
    }
  }
};
var checkButtonIntervalID = window.setInterval(checkButton, 500);
