$( document ).ready(function() {

  var base_url="http://image.tmdb.org/t/p/";
  var base_photo_size_list    = 'w92';
  var base_photo_size_display = 'w300';

  var list_photo_url = base_url + base_photo_size_list + '/';
  var display_photo_url = base_url + base_photo_size_display + '/';

  $('#scores_table').DataTable({
    "order": [[ 0, "desc" ]]
  });


  $('#btn_search').on('click', function() {
    var movie_name = encodeURI( $('#movie_name').val() );
    var movie_select = '<h4 style="color: #337ab7;">Multiple movies with a similar title found - select one:</h4>';
    var movie_display = '';
    var actor_display = '';

    console.log('Searching for movie: ' + movie_name);

    $.ajax({
      url: '/movies/find/'+movie_name,
      type: 'GET',
      success: function(res) {
        if (res.movies.length == 1) { 
          var m = res.movies[0];
          movie_display += "<h2>"+m.title+"</h2>";
          movie_display += "<div class='container'><div class='responsive'> <div class='poster_container'>  ";
          movie_display += "<img src='"+  display_photo_url + m.poster+"' alt='poster' ><br />";
          movie_display += "<span>ID: "+m.id+"</span><br />";
          movie_display += "<span>TITLE: "+m.title+"</span><br />";
          movie_display += "<span>RELEASE DATE: "+m.release_date+"</span>";
          movie_display += "</div></div></div>";
          $('#div_movie_list').html( movie_display );
        }
        else if (res.movies.length > 1) {  
          $('#div_movie_list').html("");
          $.each(res.movies, function( index, movie ) {
            var re = new RegExp( decodeURI(movie_name), 'i');
          
            if ( movie.title.match(re) && movie.poster != null ) {
              movie_select += '<div id="movie_id_'+movie.id+'" class="div_photo_select"> <img src="'+ list_photo_url + movie.poster+'" alt="poster" >'
              movie_select += '<span>'+movie.title+' </span><br />';
              movie_select += '<span> Released: '+movie.release_date.substring(0,4)+' </span></div>';
            }
          });
          $('#div_movie_list').append( movie_select );

          $('[id^=movie_id_]').on('click', function() {
            var tmp   =  $(this).attr('id');
            var match = /^movie_id_(\d+)$/.exec(tmp);
            var movie_id = RegExp.$1;
            console.log('selecting movie id:' + movie_id);

            $.ajax({
              url: '/movies/show/'+movie_id,
              type: 'GET',
              success: function(res) {
                var m = res;
                // if (res.movies.length == 1) { 
                  // var m = res.movies[0];
                  debugger;
                  $('#div_movie_list').html("");

                  movie_display += "<h2 style='padding-left: 15px;'>"+m.title+"</h2>";
                  movie_display += "<div class='container'><div class='responsive'> <div class='poster_container'>  ";
                  movie_display += "<img src='"+  display_photo_url + m.poster+"' alt='poster' ><br />";
                  movie_display += "<span>Released: "+m.release_date+"</span><br />";
                  movie_display += "<span>Overview: "+m.overview+"</span><br />";
                  movie_display += "</div></div></div>";
                  $('#movie_poster').html( movie_display );

                  $.each( m.cast, function(i, actor) {
                    actor_display += "<img src='"+  list_photo_url + actor.profile_path+"' alt='actor' >";
                  });
                  $('#movie_actors').html( actor_display );


 // <div id='movie_poster'>poster goes here</div>  
 //  <div id='movie_actors'>list of actor pics go here</div>  

                // } 
                // else {
                //   $('#div_movie_list').html('Movie not found...');
                // }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                alert("Can't display movie; error = " + errorThrown + ", " + textStatus);
                console.log("Can't display movie; error = " + errorThrown + ", " + textStatus);
              }
            });
          });
        }
        else {
          $('#div_movie_list').html('Movie not found...');
        }

      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('Error in movie search; error = ' + errorThrown + ', ' + textStatus);
        console.log('Error in movie search; error = ' + errorThrown + ', ' + textStatus);
      }
    });

  });


});