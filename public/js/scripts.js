$(document).ready(function () {


    $(".viewBtn").click(function () {
        $('.overlay').show();
        $('#viewDoc').fadeIn('slow');
    });
    $(".uploadBtn").click(function () {
        $('.overlay').show();
        $('#uploadDoc').fadeIn('slow');
    });
    $(".balanceBtn").click(function () {
        $('.overlay').show();
        $('#balance').fadeIn('slow');
    });
    /*
     $( ".payBtn" ).click(function() {
     $('.overlay').show();
     $('#pay').fadeIn('slow');
     });
     */
    $(".editBtn").click(function () {
        $('.overlay').show();
        $('#editInfo').fadeIn('slow');
    });

    $(".close").click(function () {
        $('.overlay').hide();
        $('.modal').hide();
    });

    $("#submit_login").on("click", function(){
        $("#form_login").submit();
    });

    $("#submit_signup").on("click", function(){
        $("#form_signup").submit();
    });

    $("#submit_reset").on("click", function(){
        $("#form_reset").submit();
    });

    $("#save-contact-info").on("click", function(){
        $.ajax({
            url: "/",
            type: "post",
            data: {
                action              : "save_contact_info",

                contact_full_name   : $("#contact_full_name").val(),
                contact_SSN         : $("#contact_SSN").val(),
                contact_birth_date  : $("#contact_birth_date").val(),
                contact_phone       : $("#contact_phone").val(),
                contact_email       : $("#contact_email").val(),
                contact_address     : $("#contact_address").val(),
                contact_apartment   : $("#contact_apartment").val(),
                contact_city        : $("#contact_city").val(),
                contact_state       : $("#contact_state").val(),
                contact_zip         : $("#contact_zip").val()
            },
            success: function(data){
                console.log(data);
                location.reload();
            }
        });
    });

    $("#sf-connect").on("click", function(){
        if($(this).data("status") == "connected"){
            $.ajax({
                url: "/",
                type: "post",
                data: {
                    action: "salesforce_disconnect",

                    id: $(this).data("id")

                },
                success: function(data){
                    console.log(data);
                    location.reload();
                }
            })
        }
    });


});
