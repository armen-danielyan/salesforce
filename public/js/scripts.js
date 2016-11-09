$( document ).ready(function() {
    


$( ".viewBtn" ).click(function() {
  $('.overlay').show();
  $('#viewDoc').fadeIn('slow');
});
$( ".uploadBtn" ).click(function() {
  $('.overlay').show();
  $('#uploadDoc').fadeIn('slow');
});
$( ".balanceBtn" ).click(function() {
  $('.overlay').show();
  $('#balance').fadeIn('slow');
});
/*
$( ".payBtn" ).click(function() {
  $('.overlay').show();
  $('#pay').fadeIn('slow');
});
*/
$( ".editBtn" ).click(function() {
  $('.overlay').show();
  $('#editInfo').fadeIn('slow');
});

$( ".close" ).click(function() {
  $('.overlay').hide();
  $('.modal').hide();
});


});
