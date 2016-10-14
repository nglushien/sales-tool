function getBrowserInfo()
{
	var ua = navigator.userAgent, tem,
	M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if(/trident/i.test(M[1]))
	{
		tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE '+(tem[1] || '');
	}
	if(M[1]=== 'Chrome')
	{
		tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
		if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}
	M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	if((tem= ua.match(/version\/(\d+)/i))!= null)
		M.splice(1, 1, tem[1]);
	return M.join(' ');
}

var browserInfo = getBrowserInfo();

var apiBaseURL = 'https://edge.api.brightcove.com/playback/v1',
    account_id = '1660622130',
    policy_key = 'BCpkADawqM1O1SkJta2TNQzuPn2IvBXqzmiFZM7sHspVvArV5XSZMxMf5XJnkekrb50jdYOS9XDPYiywP9KarnzddUIPvZ_IQx36Frr8VEeaSUSdeUVyM5qm7hA';

function videoResources(container, listID){
  $.ajax({
    headers:{
      Accept:'application/json;pk=' + policy_key
    },
    type:'GET',
    url: apiBaseURL + '/accounts/' + account_id + '/playlists/' + listID,
    dataType:'json',
    crossDomain: true,
    error: function () {
			browserInfo;
			if(browserInfo == "MSIE 9") {
				$('.placeholder').remove();
			}
    }
  }).done(function(data) {
    var i,
        iMax,
        playerWrapper = document.createElement('div'),
        playlistWrapper = document.createElement('ul'),
        playlistItem,
        playlistItemThumbnailWrapper,
        playlistItemThumbnailWrapperImage,
        playlistItemDuration,
        playlistItemTitle,
        playlistItemDescription,
        videoItem,
        myPlayer,
        iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
        myPlayerProps = {'id':'video-1','account':'1660622130','player':'SJJxTCbc','embed':'default','class':'video-js'},
        desktopTouch = false,
        modalPlaylistWrapper = $('ol.vjs-playlist'),
        modalPlaylistItem,
        modalPlaylistItemThumbnailWrapper,
        modalPlaylistItemThumbnailImage,
        modalPlaylistItemDuration,
        modalPlaylistItemTitle,
        playlistInfoContainer = $('#videoModalPlaylistInfoContainer'),
        videoInfo = $('.videoInfo');

    function loadModalVideo() {
      myPlayer.catalog.getVideo(this.getAttribute('data-video-id'), function(error, video) {
        myPlayer.catalog.load(video);
        myPlayer.play();
      });
      $(this).addClass('vjs-selected');
      $('.vjs-playlist-item').not(this).removeClass('vjs-selected');
    }

    function loadVideo() {

      $('#videoModal').addClass('showModal');
      $('body').addClass('noScroll')

      for (j = 0; j < iMax; j++) {
        modalVideoItem = data.videos[j];

        modalPlaylistItem = document.createElement('li');
        modalPlaylistItem.setAttribute('class', 'vjs-playlist-item');
        modalPlaylistItem.setAttribute('data-video-id', modalVideoItem.id);

        modalPlaylistItemThumbnailWrapper = document.createElement('picture');
        modalPlaylistItemThumbnailWrapper.setAttribute('class', 'vjs-playlist-thumbnail');

        modalPlaylistItemThumbnailImage = document.createElement('img');
        modalPlaylistItemThumbnailImage.src = modalVideoItem.poster;

        var w = modalVideoItem.duration;
        var x = w.toString();
        var y = x.replace(/\./g, '');
        var z = parseInt(y,10);

        function msToTime(duration) {
          var milliseconds = parseInt((duration%1000)/100),
              seconds = parseInt((duration/1000)%60),
              minutes = parseInt((duration/(1000*60))%60),
              hours = parseInt((duration/(1000*60*60))%24);

          hours = (hours < 10) ? "0" + hours : hours;
          minutes = (minutes < 10) ? "0" + minutes : minutes;
          seconds = (seconds < 10) ? "0" + seconds : seconds;

          if(hours < 1){
            return minutes + ":" + seconds;
          } else {
            return hours + ":" + minutes + ":" + seconds;
          }
        }

        modalPlaylistItemDuration = document.createElement('time');
        modalPlaylistItemDuration.setAttribute('class', 'vjs-playlist-duration');
        modalPlaylistItemDuration.appendChild(document.createTextNode(msToTime(z)));

        modalPlaylistItemTitle = document.createElement('cite');
        modalPlaylistItemTitle.setAttribute('class', 'vjs-playlist-name');
        modalPlaylistItemTitle.appendChild(document.createTextNode(modalVideoItem.name));

        modalPlaylistItemThumbnailWrapper.appendChild(modalPlaylistItemThumbnailImage);
        modalPlaylistItem.appendChild(modalPlaylistItemThumbnailWrapper);
        modalPlaylistItem.appendChild(modalPlaylistItemDuration);
        modalPlaylistItem.appendChild(modalPlaylistItemTitle);

        modalPlaylistWrapper.append(modalPlaylistItem);
        modalPlaylistItem.addEventListener('click', loadModalVideo);
        modalPlaylistItem.addEventListener('tapone', loadModalVideo);
      }

      $('#videoModal #videoModalPlayerContainer').prepend('<video controls id="'+myPlayerProps.id+'"></video>');
      $('#'+myPlayerProps.id).attr('data-account',myPlayerProps.account).attr('data-player',myPlayerProps.player).attr('data-embed',myPlayerProps.embed).addClass(myPlayerProps.class);
      bc(document.getElementById(myPlayerProps.id));
      myPlayer=videojs(myPlayerProps.id);

      myPlayer.catalog.getVideo(this.getAttribute('data-video-id'), function(error, video) {
        $('.vjs-poster').remove();
        myPlayer.catalog.load(video);
        myPlayer.play();
      });

			// $(document).on('custom', function() {
			// 	myPlayer.play();
			// });
			//
			// $(document).trigger('custom');

      var toMatch = $(this).data('video-id');
      $('.vjs-playlist-item[data-video-id*='+toMatch+']').addClass('vjs-selected');

      if ($('.vjs-playlist-item').length == 2){
        // exactly 2
        $(playlistInfoContainer).remove();
        $('#videoPlayerContainer').addClass('twoItems');
      } else if ($('.vjs-playlist-item').length == 3){
        $('#videoPlayerContainer').addClass('threeItems');
        $(videoInfo).text($('.vjs-playlist-item').length + ' Videos');
      } else if ($('.vjs-playlist-item').length == 4){
        $('#videoPlayerContainer').addClass('fourItems');
        $(videoInfo).text($('.vjs-playlist-item').length + ' Videos');
      } else if ($('.vjs-playlist-item').length > 4){
        $('#videoPlayerContainer').addClass('manyItems');
        $(videoInfo).text($('.vjs-playlist-item').length + ' Videos');
      } else {
        $('#videoModalPlaylistContainer').remove();
        $('#videoModalPlaylistInfoContainer').remove();
      }

			myPlayer.ready(function(){this.ga();});

      myPlayer.one('loadstart', function(){

				$('.vjs-big-play-button').remove();
        $('.vjs-playlist-ad-overlay').remove();

        modalPlaylistWrapper.bxSlider({
          minSlides:1,
          maxSlides: 4,
          infiniteLoop: false,
          slideMargin: 10,
          slideWidth: 260,
          moveSlides: 1,
          nextSelector: '#slider-next',
          prevSelector: '#slider-prev',
          hideControlOnEnd: true
        });

        var thumbnail = $('.vjs-playlist-thumbnail'),
            selectedThumbnail = $('.vjs-playlist .vjs-playlist-item.vjs-selected .vjs-playlist-thumbnail'),
            playlistItem = $('.vjs-playlist-item'),
            nextButton = $('.bx-next'),
            prevButton = $('.bx-prev');

        nextButton.html('<i class="icon-play"></i>');
        prevButton.html('<i class="icon-play"></i>');
      });
    }

    playerWrapper.setAttribute('class', 'player-wrapper');
    playerWrapper.appendChild(playlistWrapper);

    // build the playlist items
    iMax = data.videos.length;
    for (i = 0; i < iMax; i++) {
      videoItem = data.videos[i];

      playlistItem = document.createElement('li');
      playlistItem.setAttribute('class', 'playlist-item');
      playlistItem.setAttribute('data-video-id', videoItem.id);

      playlistItemThumbnailWrapper = document.createElement('picture');
      playlistItemThumbnailWrapper.setAttribute('class', 'playlist-thumbnail');

      playlistItemThumbnailImage = document.createElement('img');
      playlistItemThumbnailImage.src = videoItem.poster;

      var w = videoItem.duration;
      var x = w.toString();
      var y = x.replace(/\./g, '');
      var z = parseInt(y,10);

      function msToTime(duration) {
        var milliseconds = parseInt((duration%1000)/100),
            seconds = parseInt((duration/1000)%60),
            minutes = parseInt((duration/(1000*60))%60),
            hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        if(hours < 1){
          return minutes + ":" + seconds;
        } else {
          return hours + ":" + minutes + ":" + seconds;
        }
      }

      playlistItemDuration = document.createElement('time');
      playlistItemDuration.setAttribute('class', 'playlist-duration');
      playlistItemDuration.appendChild(document.createTextNode(msToTime(z)));

      playlistItemTitle = document.createElement('cite');
      playlistItemTitle.setAttribute('class', 'playlist-name');
      playlistItemTitle.appendChild(document.createTextNode(videoItem.name));

      playlistItemDescription = document.createElement('p');
      playlistItemDescription.setAttribute('class', 'playlist-description');
      playlistItemDescription.appendChild(document.createTextNode(videoItem.description));

      playlistItemThumbnailWrapper.appendChild(playlistItemThumbnailImage);
      playlistItem.appendChild(playlistItemThumbnailWrapper);
      playlistItem.appendChild(playlistItemDuration);
      playlistItem.appendChild(playlistItemTitle);

      playlistWrapper.appendChild(playlistItem);

      playlistItem.addEventListener('click', loadVideo);
      playlistItem.addEventListener('tapone', loadVideo);
    }
    function loadMore() {

      var c = playerWrapper.getElementsByTagName('ul')[0].children;
      var l;
      for (l = 2; l < c.length; l++) {
        c[l].style.display = 'block';
      }
      $(this).remove();
    }
    if (iMax > 3) {
      var loadMoreButton = document.createElement('a');
      loadMoreButton.setAttribute('class', 'loadMore');
      loadMoreButton.appendChild(document.createTextNode('Load More'));
      loadMoreButton.addEventListener('click', loadMore);
      playerWrapper.appendChild(loadMoreButton);
    }
    // append playlist to the container
    $(container).append(playerWrapper);
    $(playerWrapper).css({'position':'relative'}).fadeIn('slow');
    $(container).find('.placeholder').fadeOut('fast');
  });
}

function getTopicVideos(listID){
  $.ajax({
    headers:{
      Accept:'application/json;pk=' + policy_key
    },
    type:'GET',
    url: apiBaseURL + '/accounts/' + account_id + '/playlists/' + listID,
    dataType:'json',
    crossDomain: true,
    error: function () {
			browserInfo;
			if(browserInfo == "MSIE 9") {
				$('#topicVideoComponent a#launchModal').remove();
				$('<p class="upgrade">Please upgrade your browser for a better experience.</p>').insertAfter('#topicVideoComponent h6');
				$('<a class="upgradeCTA" href="http://windows.microsoft.com/en-US/internet-explorer/download-ie" target="_blank">Upgrade Now</a>').insertAfter('#topicVideoComponent .upgrade');
			}
    }
  }).done(function(data) {
    var i,
        iMax,
        topicPlaylistItem,
        topicPlaylistItemThumbnailWrapper = $('a#launchModal').find('picture'),
        topicPlaylistItemThumbnailWrapperImage,
        topicModalButton = $('a#launchModal'),
        topicPlaylistItemTitle = topicModalButton.find('cite'),
        topicPlaylistItemDuration = topicModalButton.find('time'),
        topicVideoItem,
        spinner = $('.spinner'),
        myPlayer,
        iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
        myPlayerProps = {'id':'video-1','account':'1660622130','player':'SJJxTCbc','embed':'default','class':'video-js'},
        desktopTouch = false,
        modalPlaylistWrapper = $('ol.vjs-playlist'),
        modalPlaylistItem,
        modalPlaylistItemThumbnailWrapper,
        modalPlaylistItemThumbnailImage,
        modalPlaylistItemDuration,
        modalPlaylistItemTitle,
        playlistInfoContainer = $('#videoModalPlaylistInfoContainer'),
        videoInfo = $('.videoInfo');

    function loadModalVideo() {
      myPlayer.catalog.getVideo(this.getAttribute('data-video-id'), function(error, video) {
        myPlayer.catalog.load(video);
        myPlayer.play();
      });
      $(this).addClass('vjs-selected');
      $('.vjs-playlist-item').not(this).removeClass('vjs-selected');
    }

    function loadVideo() {

      $('#videoModal').addClass('showModal');
      $('body').addClass('noScroll')

      iMax = data.videos.length;
      for (j = 0; j < iMax; j++) {
        modalVideoItem = data.videos[j];

        modalPlaylistItem = document.createElement('li');
        modalPlaylistItem.setAttribute('class', 'vjs-playlist-item');
        modalPlaylistItem.setAttribute('data-video-id', modalVideoItem.id);

        modalPlaylistItemThumbnailWrapper = document.createElement('picture');
        modalPlaylistItemThumbnailWrapper.setAttribute('class', 'vjs-playlist-thumbnail');

        modalPlaylistItemThumbnailImage = document.createElement('img');
        modalPlaylistItemThumbnailImage.src = modalVideoItem.poster;

        var w = modalVideoItem.duration;
        var x = w.toString();
        var y = x.replace(/\./g, '');
        var z = parseInt(y,10);

        function msToTime(duration) {
          var milliseconds = parseInt((duration%1000)/100),
              seconds = parseInt((duration/1000)%60),
              minutes = parseInt((duration/(1000*60))%60),
              hours = parseInt((duration/(1000*60*60))%24);

          hours = (hours < 10) ? "0" + hours : hours;
          minutes = (minutes < 10) ? "0" + minutes : minutes;
          seconds = (seconds < 10) ? "0" + seconds : seconds;

          if(hours < 1){
            return minutes + ":" + seconds;
          } else {
            return hours + ":" + minutes + ":" + seconds;
          }
        }

        modalPlaylistItemDuration = document.createElement('time');
        modalPlaylistItemDuration.setAttribute('class', 'vjs-playlist-duration');
        modalPlaylistItemDuration.appendChild(document.createTextNode(msToTime(z)));

        modalPlaylistItemTitle = document.createElement('cite');
        modalPlaylistItemTitle.setAttribute('class', 'vjs-playlist-name');
        modalPlaylistItemTitle.appendChild(document.createTextNode(modalVideoItem.name));

        modalPlaylistItemThumbnailWrapper.appendChild(modalPlaylistItemThumbnailImage);
        modalPlaylistItem.appendChild(modalPlaylistItemThumbnailWrapper);
        modalPlaylistItem.appendChild(modalPlaylistItemDuration);
        modalPlaylistItem.appendChild(modalPlaylistItemTitle);

        modalPlaylistWrapper.append(modalPlaylistItem);
        modalPlaylistItem.addEventListener('click', loadModalVideo);
      }

      $('#videoModal #videoModalPlayerContainer').prepend('<video controls id="'+myPlayerProps.id+'"></video>');
      $('#'+myPlayerProps.id).attr('data-account',myPlayerProps.account).attr('data-player',myPlayerProps.player).attr('data-embed',myPlayerProps.embed).addClass(myPlayerProps.class);
      bc(document.getElementById(myPlayerProps.id));
      myPlayer=videojs(myPlayerProps.id);

      myPlayer.catalog.getVideo(this.getAttribute('data-video-id'), function(error, video) {
        $('.vjs-poster').remove();
        myPlayer.catalog.load(video);
        myPlayer.play();
      });

			$(document).on('custom', function() {
				myPlayer.play();
			});

			$(document).trigger('custom');

      var toMatch = $(this).data('video-id');
      $('.vjs-playlist-item[data-video-id*='+toMatch+']').addClass('vjs-selected');

      if (data.videos.length == 2){
        // exactly 2
        $(playlistInfoContainer).remove();
        $('#videoPlayerContainer').addClass('twoItems');
      } else if (data.videos.length == 3){
        $('#videoPlayerContainer').addClass('threeItems');
        $(videoInfo).text($('.vjs-playlist-item').length + ' Videos');
      } else if (data.videos.length == 4){
        $('#videoPlayerContainer').addClass('fourItems');
        $(videoInfo).text($('.vjs-playlist-item').length + ' Videos');
      } else if (data.videos.length > 4){
        $('#videoPlayerContainer').addClass('manyItems');
        $(videoInfo).text($('.vjs-playlist-item').length + ' Videos');
      } else {
        $('#videoModalPlaylistContainer').remove();
        $('#videoModalPlaylistInfoContainer').remove();
      }

			myPlayer.ready(function(){this.ga();});

      myPlayer.one('loadstart', function(){

        $('.vjs-playlist-ad-overlay, .vjs-big-play-button').remove();

        modalPlaylistWrapper.bxSlider({
          minSlides:1,
          maxSlides: 4,
          infiniteLoop: false,
          slideMargin: 10,
          slideWidth: 260,
          moveSlides: 1,
          nextSelector: '#slider-next',
          prevSelector: '#slider-prev',
          hideControlOnEnd: true
        });

        var thumbnail = $('.vjs-playlist-thumbnail'),
            selectedThumbnail = $('.vjs-playlist .vjs-playlist-item.vjs-selected .vjs-playlist-thumbnail'),
            playlistItem = $('.vjs-playlist-item'),
            nextButton = $('.bx-next'),
            prevButton = $('.bx-prev');

        nextButton.html('<i class="icon-play"></i>');
        prevButton.html('<i class="icon-play"></i>');
      });
    }

    // Get the first video item
    topicVideoItem = data.videos[0];

    // Build the playlist image html structure and use the poster as the image source
    topicPlaylistItemThumbnailImage = document.createElement('img');
    topicPlaylistItemThumbnailImage.src = topicVideoItem.poster;
    topicPlaylistItemThumbnailWrapper.append(topicPlaylistItemThumbnailImage);

    // Insert the video name into the pre-existing cite tag
    topicPlaylistItemTitle.append(document.createTextNode(topicVideoItem.name));

    // Add Video ID
    topicModalButton.attr('data-video-id', topicVideoItem.id);

    // Convert milliseconds to a readable format 00:00
    var w = topicVideoItem.duration;
    var x = w.toString();
    var y = x.replace(/\./g, '');
    var z = parseInt(y,10);

    function msToTime(duration) {
      var milliseconds = parseInt((duration%1000)/100),
          seconds = parseInt((duration/1000)%60),
          minutes = parseInt((duration/(1000*60))%60),
          hours = parseInt((duration/(1000*60*60))%24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      if(hours < 1){
        return minutes + ":" + seconds;
      } else {
        return hours + ":" + minutes + ":" + seconds;
      }
    }

    // Insert the converted duration into the pre-existing time tag
    topicPlaylistItemDuration.append(document.createTextNode(msToTime(z)));

    $('a#launchModal').on('click', loadVideo);

    // Remove the spinner
    spinner.remove();
  });
}

function singleFeaturedVideo(vidID){
  $.ajax({
    headers:{
      Accept:'application/json;pk=' + policy_key
    },
    type:'GET',
    url: apiBaseURL + '/accounts/' + account_id + '/videos/' + vidID,
    dataType:'json',
    crossDomain: true,
    error: function () {
			browserInfo;
			if(browserInfo == "MSIE 9") {
				$('#featuredItems ul li a#launchModal').remove();
				$('<a href="http://windows.microsoft.com/en-US/internet-explorer/download-ie" target="_blank"><div class="thumbnail"><img src="images/featuredItem2.jpg"><i class="icon-upgrade"></i></div><p>Please upgrade your browser for a better experience</p><span class="cta">Upgrade Now</span></a>').appendTo('#featuredItems ul li:nth-child(3)');
			}
    }
  }).done(function(data) {
    var videoItem,
        videoItemContainer = $('#featuredItems a#launchModal'),
        videoItemThumbnailWrapper = $('#featuredItems a#launchModal .thumbnail'),
        videoItemDuration = $('#featuredItems a#launchModal span.time'),
        videoItemTitle = $('#featuredItems a#launchModal p'),
        myPlayer,
        iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
        myPlayerProps = {'id':'video-1','account':'1660622130','player':'SJJxTCbc','embed':'default','class':'video-js'},
        desktopTouch = false,
        videoInfo = $('.videoInfo');

    function loadVideo() {

      $('#videoModal').addClass('showModal');
      $('body').addClass('noScroll')

      $('#videoModal #videoModalPlayerContainer').prepend('<video controls id="'+myPlayerProps.id+'"></video>');
      $('#'+myPlayerProps.id).attr('data-account',myPlayerProps.account).attr('data-player',myPlayerProps.player).attr('data-embed',myPlayerProps.embed).addClass(myPlayerProps.class);
      bc(document.getElementById(myPlayerProps.id));
      myPlayer=videojs(myPlayerProps.id);

      myPlayer.catalog.getVideo(vidID, function(error, video) {
        $('.vjs-poster').remove();
        myPlayer.catalog.load(video);
        myPlayer.play();
      });

			$(document).on('custom', function() {
				myPlayer.play();
			});

			$(document).trigger('custom');

			myPlayer.ready(function(){this.ga();});

      myPlayer.one('loadstart', function(){
        $('.vjs-playlist-ad-overlay, .vjs-big-play-button').remove();
      });
    }

    videoItem = data;
    videoItemTitle.prepend(document.createTextNode(videoItem.name));

    var w = videoItem.duration;
    var x = w.toString();
    var y = x.replace(/\./g, '');
    var z = parseInt(y,10);

    function msToTime(duration) {
      var milliseconds = parseInt((duration%1000)/100),
          seconds = parseInt((duration/1000)%60),
          minutes = parseInt((duration/(1000*60))%60),
          hours = parseInt((duration/(1000*60*60))%24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      if(hours < 1){
        return minutes + ":" + seconds;
      } else {
        return hours + ":" + minutes + ":" + seconds;
      }
    }

    videoItemDuration.append(document.createTextNode(msToTime(z))).css('display','block');
    videoItemContainer.on('click', loadVideo);
  });
}

function singleLatestVideo(vidID){
  $.ajax({
    headers:{
      Accept:'application/json;pk=' + policy_key
    },
    type:'GET',
    url: apiBaseURL + '/accounts/' + account_id + '/videos/' + vidID,
    dataType:'json',
    crossDomain: true,
    error: function () {
			browserInfo;
			if(browserInfo == "MSIE 9") {
				$('#latestVideo a#launchModal').remove();
				$('<p class="upgrade">Please upgrade your browser for a better experience.</p>').insertAfter('#latestVideo h6');
				$('<a class="upgradeCTA" href="http://windows.microsoft.com/en-US/internet-explorer/download-ie" target="_blank">Upgrade Now</a>').insertAfter('#latestVideo .upgrade');
			}
    }
  }).done(function(data) {
    var videoItem,
        videoItemContainer = $('#latestVideo a#launchModal'),
        videoItemThumbnailWrapper = $('#latestVideo a#launchModal picture'),
        videoItemThumbnailWrapperImage,
        videoItemDuration = $('#latestVideo a#launchModal time'),
        videoItemTitle = $('#latestVideo a#launchModal cite'),
        myPlayer,
        iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
        myPlayerProps = {'id':'video-1','account':'1660622130','player':'SJJxTCbc','embed':'default','class':'video-js'},
        desktopTouch = false,
        videoInfo = $('.videoInfo');

    function loadVideo() {

      $('#videoModal').addClass('showModal');
      $('body').addClass('noScroll')

      $('#videoModal #videoModalPlayerContainer').prepend('<video controls id="'+myPlayerProps.id+'"></video>');
      $('#'+myPlayerProps.id).attr('data-account',myPlayerProps.account).attr('data-player',myPlayerProps.player).attr('data-embed',myPlayerProps.embed).addClass(myPlayerProps.class);
      bc(document.getElementById(myPlayerProps.id));
      myPlayer=videojs(myPlayerProps.id);

      myPlayer.catalog.getVideo(vidID, function(error, video) {
        $('.vjs-poster').remove();
        myPlayer.catalog.load(video);
        myPlayer.play();
      });

			$(document).on('custom', function() {
				myPlayer.play();
			});

			$(document).trigger('custom');

			myPlayer.ready(function(){this.ga();});

      myPlayer.one('loadstart', function(){
        $('.vjs-playlist-ad-overlay, .vjs-big-play-button').remove();
      });
    }

    videoItem = data;
    videoItemTitle.prepend(document.createTextNode(videoItem.name));

    videoItemThumbnailWrapperImage = document.createElement('img');
    videoItemThumbnailWrapperImage.src = videoItem.poster;

    videoItemThumbnailWrapper.append(videoItemThumbnailWrapperImage);

    var w = videoItem.duration;
    var x = w.toString();
    var y = x.replace(/\./g, '');
    var z = parseInt(y,10);

    function msToTime(duration) {
      var milliseconds = parseInt((duration%1000)/100),
          seconds = parseInt((duration/1000)%60),
          minutes = parseInt((duration/(1000*60))%60),
          hours = parseInt((duration/(1000*60*60))%24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      if(hours < 1){
        return minutes + ":" + seconds;
      } else {
        return hours + ":" + minutes + ":" + seconds;
      }
    }

    videoItemDuration.append(document.createTextNode(msToTime(z)));
    videoItemContainer.on('click', loadVideo);
  });
}

function featuredHeroVideo(vidID){
  $.ajax({
    headers:{
      Accept:'application/json;pk=' + policy_key
    },
    type:'GET',
    url: apiBaseURL + '/accounts/' + account_id + '/videos/' + vidID,
    dataType:'json',
    crossDomain: true,
    error: function () {
			browserInfo;
			if(browserInfo == "MSIE 9") {
				$('.heroPrimaryContainer h1').text('We have detected that you are using ' + getBrowserInfo() + '. Please upgrade your browser for a better experience.');
				$('.heroPrimaryCTA').text('Upgrade Now');
				$('.heroPrimaryTarget').attr({ href:"http://windows.microsoft.com/en-US/internet-explorer/download-ie", target:"_blank" });
			}
    }
  }).done(function(data){
    var videoItem,
        videoItemContainer = $('.heroPrimaryTarget'),
        videoItemDuration = $('.heroPrimaryTarget time'),
        videoItemTitle = $('.heroPrimaryTarget h1'),
        myPlayer,
        iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
        myPlayerProps = {'id':'video-1','account':'1660622130','player':'SJJxTCbc','embed':'default','class':'video-js'},
        desktopTouch = false,
        videoInfo = $('.videoInfo');

    function loadVideo() {
      $('#videoModal').addClass('showModal');
      $('body').addClass('noScroll');

      $('#videoModal #videoModalPlayerContainer').prepend('<video controls id="'+myPlayerProps.id+'"></video>');
      $('#'+myPlayerProps.id).attr('data-account',myPlayerProps.account).attr('data-player',myPlayerProps.player).attr('data-embed',myPlayerProps.embed).addClass(myPlayerProps.class);
      bc(document.getElementById(myPlayerProps.id));
      myPlayer=videojs(myPlayerProps.id);

      myPlayer.catalog.getVideo(vidID, function(error, video) {
        $('.vjs-poster').remove();
        myPlayer.catalog.load(video);
        myPlayer.play();
      });

			$(document).on('custom', function() {
				myPlayer.play();
			});

			$(document).trigger('custom');

			myPlayer.ready(function(){this.ga();});

      myPlayer.one('loadstart', function(){
        $('.vjs-playlist-ad-overlay, .vjs-big-play-button').remove();
      });
    }

    videoItem = data;
    videoItemTitle.prepend(document.createTextNode(videoItem.name));
    $('.heroPrimaryTarget h1').css('background','none');

    var w = videoItem.duration;
    var x = w.toString();
    var y = x.replace(/\./g, '');
    var z = parseInt(y,10);

    function msToTime(duration) {
      var milliseconds = parseInt((duration%1000)/100),
          seconds = parseInt((duration/1000)%60),
          minutes = parseInt((duration/(1000*60))%60),
          hours = parseInt((duration/(1000*60*60))%24);

      hours = (hours < 10) ? "0" + hours : hours;
      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;

      if(hours < 1){
        return minutes + ":" + seconds;
      } else {
        return hours + ":" + minutes + ":" + seconds;
      }
    }

    videoItemDuration.append(document.createTextNode(msToTime(z))).css('display','block');
    $('.heroPrimaryTarget time').css('background','none');
    videoItemContainer.on('click', loadVideo);
  });
}

/**
 * BxSlider v4.1.2 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2014, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the MIT license - http://opensource.org/licenses/MIT
 */
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,slideZIndex:50,touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){},onSliderResize:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),f(),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:p()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({"float":"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:o.settings.slideZIndex,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0==s)return i(),void 0;var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(v()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",Z),o.settings.auto&&o.settings.autoStart&&H(),o.settings.ticker&&L(),o.settings.pager&&q(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&O()},v=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),e},p=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width();t=Math.floor(o.viewport.width()/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=o.children.length/m();else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.width())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{var e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),N()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),N()})}},w=function(){for(var e="",i=x(),s=0;i>s;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.on("click","a",I)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",y),o.controls.prev.bind("click",z),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.on("click",".bx-start",k),o.controls.autoEl.on("click",".bx-stop",M),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(){var e=t(this).find("img:first").attr("title");void 0!=e&&(""+e).length&&t(this).append('<div class="bx-caption"><span>'+e+"</span></div>")})},y=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},z=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},k=function(t){r.startAuto(),t.preventDefault()},M=function(t){r.stopAuto(),t.preventDefault()},I=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget),s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()},q=function(e){var i=o.children.length;return"short"==o.settings.pagerType?(o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i),void 0):(o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")}),void 0)},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),t&&("horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0))}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){o.settings.autoDelay>0?setTimeout(r.startAuto,o.settings.autoDelay):r.startAuto(),o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));N(n)}),N()},N=function(t){speed=t?t:o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n="horizontal"==o.settings.mode?-i.left:-i.top,a={resetValue:n};b(s,"ticker",speed,a)},O=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",X)},X=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",Y),o.viewport.bind("touchend",V)}},Y=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){var r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},V=function(t){o.viewport.unbind("touchmove",Y);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode){var s=Math.abs(o.touch.start.x-o.touch.end.x);s>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto())}else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&0>s)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(0>s?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",V)},Z=function(){var e=t(window).width(),i=t(window).height();(a!=e||l!=i)&&(a=e,l=i,r.redrawSlider(),o.settings.onSliderResize.call(r,o.active.index))};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,o.active.index=0>e?x()-1:e>=x()?0:e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&q(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=v()&&o.viewport.animate({height:v()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",o.settings.slideZIndex+1).fadeIn(o.settings.speed,function(){t(this).css("zIndex",o.settings.slideZIndex),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=v()&&o.viewport.animate({height:v()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode){var a=o.children.eq(o.children.length-1);n=a.position(),s=o.viewport.width()-a.outerWidth()}else{var l=o.children.length-o.settings.minSlides;n=o.children.eq(l).position()}else if(o.carousel&&o.active.last&&"prev"==i){var d=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),a=r.children(".bx-clone").eq(d);n=a.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if("undefined"!=typeof n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getCurrentSlideElement=function(){return o.children.eq(o.active.index)},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).outerWidth(u()),o.viewport.css("height",v()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),q(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.settings.controls&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",Z))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);