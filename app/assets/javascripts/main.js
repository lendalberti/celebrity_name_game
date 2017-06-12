$( document ).ready(function() {

  var base_url="http://image.tmdb.org/t/p/";
  var base_photo_size_list    = 'w92';
  var base_photo_size_display = 'w300';

  var list_photo_url = base_url + base_photo_size_list + '/';
  var display_photo_url = base_url + base_photo_size_display + '/';

  var MAX_CAST = 5;

  $('#scores_table').DataTable({
    "order": [[ 0, "desc" ]]
  });



  $('#btn_search').on('click', function() {
    var movie_name = encodeURI( $('#movie_name').val() );
    if ( !movie_name ) {
      alert("Enter movie name...");
      return false;
    }
    var movie_list_html = '';
    var movie_display = '';
    var actor_display = '';
    var actor_names = [];
    var name_buttons = "<div><h4>Use drag/drop to match actors names to photos; when done, click 'Get Score' to see how you did...</h4></div>";

    console.log('Searching for movie: ' + movie_name);
    $('#div_movie_poster').html('');
    $('#div_cast_photos').html('');
    $('#div_cast_names').html('');

    $.ajax({
      url: '/movies/find/'+movie_name,
      type: 'GET',
      success: function(res) {
        if (res.movies.length > 0) {  
          $('#div_movie_list').html("");
          movie_list_html += '<h4 style="color: #337ab7;">Found the following movie(s) - select one:</h4>';

          $.each(res.movies, function( index, movie ) {
            var re = new RegExp( decodeURI(movie_name), 'i');
          
            if ( movie.title.match(re) && movie.poster != null ) {
              movie_list_html += '<div id="movie_id_'+movie.id+'" class="div_photo_select"> <img src="'+ list_photo_url + movie.poster+'" alt="poster" >'
              movie_list_html += '<span>'+movie.title+' </span><br />';
              movie_list_html += '<span> Released: '+movie.release_date.substring(0,4)+' </span></div>';
            }
          });
          $('#div_movie_list').html( movie_list_html );

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
                var cast = [];
                var cast_count = 0;
                $('#div_movie_list').html("");

                movie_display += "<h2 style='padding-left: 25px;'>"+m.title+"</h2>";
                movie_display += "<div class='poster_container'>  ";
                movie_display += "<img src='"+  display_photo_url + m.poster+"' alt='poster' ><br />";
                movie_display += "<span>Released: "+m.release_date+"</span><br />";
                movie_display += "<span>Overview: "+m.overview+"</span><br />";
                movie_display += "</div>";
                $('#div_movie_poster').html( movie_display );

                // ----------------------------- Cast photos
                fullCast = shuffle(m.cast);
                $.each( fullCast, function(i,cast) {
                  if ( cast_count == MAX_CAST ) {
                    return false;
                  }
                  if (cast.profile_path != null)  {
                    actor_display += "<div>";
                    actor_display += "<img id='actor_id_"+cast.id+"' src='"+  list_photo_url + cast.profile_path+"' alt='actor'  width='120' height='170' >";
                    actor_display += "<br /><label class='droptarget photo_caption' ondrop='drop(event)' ondragover='allowDrop(event)'  droppable='true' >↳ </label>";
                    actor_display += "</div>";
                    actor_names[i] = { id: cast.id,  name: cast.name};
                    cast_count++;
                  }
                });
                $('#div_cast_photos').html( actor_display + "<button id='button_get_score' class='btn btn-primary'>Get Score</button>");

                // ----------------------------- Cast names
                actor_names.sort(compare);
                $.each( actor_names, function(i,actor) {
                  if ( actor  !== undefined ) {
                    name_buttons += "<div class='droptarget' ondrop='drop(event)' ondragover='allowDrop(event)' >"
                    name_buttons += "<label ondragstart='dragStart(event)' draggable='true' id='actor_name_id_"+actor.id+"' >"+actor.name+"</label>";
                    name_buttons += "</div>";
                  }
                });                
                $('#div_cast_names').html( name_buttons );

                $('#button_get_score').on('click', function() {
                  alert("You got 2 out of 5 correct; score = 40");
                  window.location = '/scores';
                });
               
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

  // Fisher-Yates (aka Knuth) Shuffle: unabashedly pilfered from
  //        https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle(array) {
    if ( array ) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
    return null;
  }

  function compare(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  function dragStart(event) {
      event.dataTransfer.setData("Text", event.target.id);
  }

  function allowDrop(event) {
      event.preventDefault();
  }

  function drop(event) {
      event.preventDefault();
      debugger;
      var data = event.dataTransfer.getData("Text");
      event.target.appendChild(document.getElementById(data));
      var old_name = $('#'+data).html();
      var new_name = old_name.substring(0,17);
      $('#'+data).html(new_name)
      $('#'+data).attr('draggable', false)
  }


