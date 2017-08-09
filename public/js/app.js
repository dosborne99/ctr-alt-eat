$(function() {

    // var baseURL = "https://radiant-sierra-92052.herokuapp.com/";
    var baseURL = "http://localhost:3000/";

    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: 'users/register',
            method: 'POST',
            data: ({
                fullName: $('#name').val(),
                email: $('#email').val(),
                password: $('#password').val(),
                confirmPassword: $('#confirmPassword').val()
            })
        }).done (function(user){
            window.location.replace(baseURL + "myrecipes");
        });
    });

    $('#demo-button').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            url: 'users/login',
            method: 'POST',
            data: ({email: 'demo@thinkful.com', password: 'thinkful-rocks'})
        }).done (function(user) {
            window.location.replace(baseURL + "myrecipes");
        });
    });

    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url: 'users/login',
            method: 'POST',
            data: ({email: $('.loginEmail').val(), password: $('.loginPassword').val()})
        }).done (function(user) {
            window.location.replace(baseURL + "myrecipes");
        });        
    });

    $('.btnRecipeDelete').on('click', function() {
        $.ajax({
            url: '/recipes/' + $(this).attr('data-id'),
            method: 'DELETE'
        }).done(function(result) {
            window.location.replace(baseURL + "myrecipes");
        });
    });

    $('#imageUploadInput').on('change', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/recipes/image/' + $(this).attr('data-id'),
            method: 'POST',
            contentType: false,
            processData: false,
            data: new FormData(document.getElementById('uploadForm'))
        }).done (function(recipePhoto) {
            $('#fullViewRecipePhoto').attr('src', recipePhoto + '?d=' + new Date().getTime());
        });        
    });

    $('.btnSaveNewRecipe').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/recipes/create',
            method: 'POST',
            data: ({
                title: $('#title').val(),
                description: $('#description').val(),
                ingredients: $('#ingredients').val(),
                directions: $('#directions').val()
            })
        }).done (function (recipe) {
            window.location.replace(baseURL + "fullview/" + recipe._id);
        });
    });

    $('#btnSaveEditedRecipe').on('click', function(e) {
        e.preventDefault();
        $.ajax({
            url: '/recipes/' + $(this).data('id'),
            method: 'PUT',
            data: ({
                title: $('#title').val(),
                description: $('#description').val(),
                ingredients: $('#ingredients').val(),
                directions: $('#directions').val()
            })
        }).done (function (recipe) {
            window.location.replace(baseURL + "fullview/" + recipe._id);
        });
    })

});