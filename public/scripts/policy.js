//variables

//..Terms of service

var tosOptions = `
<div id="divider"></div>
<div id="acceptance-of-terms" class="option">Acceptance of Terms</div>
<div id="divider"></div>
<div id="site-policy" class="option">Site Policy</div>
<div id="divider"></div>
<div id="billing-payments" class="option">Billing/Payments</div>
<div id="divider"></div>
<div id="account-saftey" class="option">Account Saftey</div>
`

var privacyPolicyOptions = `
<div id="divider"></div>
<div id="data-policy" class="option">Data Policy</div>
<div id="divider"></div>
<div id="account-policy" class="option">Your account on Chattr</div>
<div id="divider"></div>
<div id="purchasing-policy" class="option">Purchasing Policy</div>
<div id="divider"></div>
<div id="socialization-policy" class="option">Socialization</div>
`


//function calls
renderContent(tos);
renderOptions(tosOptions)

//function declarations

function renderOptions(content) {
  $('#options-container').empty();
  $('#options-container').html(content);
}

function renderContent(content) {
  $('#text-area').empty();
  $('html,body').scrollTop(0);
  $('#text-area').html(content);
}

//click functions

$('#terms-of-service').click(function(){
  renderContent(tos);
  renderOptions(tosOptions);

  $("#acceptance-of-terms").click(function() {
    location.href = '#acceptance-of-terms-title'

  });

  $("#site-policy").click(function() {
    $('html, body').scrollTop($('.SitePolicy').offset().top - 50);
    
  });

  $("#billing-payments").click(function() {
    $('html, body').scrollTop($('.billingPayments').offset().top - 50);
    
  });

  $("#account-saftey").click(function() {
    $('html').scrollTop($('.accountSaftey').offset().top - 50);
    
  });
});

$('#privacy-policy').click(function(){
  renderContent(privacyPolicy);
  renderOptions(privacyPolicyOptions);
});


