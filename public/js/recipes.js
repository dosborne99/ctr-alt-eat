$(function() {

    function getRecipes() {
        $.ajax({
            url: '/recipes/myrecipes'
        }).done (function(recipes) {
            displayList(recipes);
        });
    };

    function displayList(recipes) {
        var template = "",
            imageSRC = "";
        $.each(recipes, function (i, recipe) {
            imageSRC = recipe.photo ? recipe.photo : '/img/noPhoto.svg';
            template += (
                '<a class="recipeList" href="/fullview/' + recipe._id + '">' +
                    '<div class="recImage">' +
                        '<img src="' + imageSRC + '"/>' +
                    '</div>' +
                    '<h2 class="recTitle">' + recipe.title + '</h2>' +
                    '<p class="recDescription">' + recipe.description + '</p>' +
                '</a>'
            );
        });

        $('.mainContent').append(template);
    };

    getRecipes();

});