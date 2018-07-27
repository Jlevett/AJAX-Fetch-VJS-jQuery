(function () {
    const form = document.querySelector('#submit-btnjquery');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('click', function (e) {
    	if(searchField.value.length>0){
	        e.preventDefault();
	        responseContainer.innerHTML = '';
	        searchedForText = searchField.value;

			XHRrequestImages();
			XHRRequestArticle();
	}});

	function XHRRequestArticle(){
		$.ajax({
			url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=ea1720d1049348e4b321dea56dbdcba1`
		}).done(addArticle);
		//but no error handling.
	}

	function addArticle(articles){
			if(articles.response && articles.response.docs && articles.response.docs.length>1){
				responseContainer.insertAdjacentHTML('beforeend',
					articles.response.docs.map(function(article){
						 return `<li class = "article"><h2><a href = "${article.web_url}">${article.headline.main}</a></h2><p>${article.snippet}</p></li>`;
					}).join('') + '</ul>');
			}else{
				responseContainer.insertAdjacentHTML('afterbegin','<div class="error-no-articles">No articles available</div>');
			}
	}

	function XHRrequestImages(){
		$.ajax({
    		url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
    		headers: {
    			Authorization: 'Client-ID 2ad71d3b436058ac74cc02d7d79970c3f725591f2d50fdade1d91fbd356c48c3'
    		}
		}).done(addImage);
		//but no error handling.
	}

	function addImage(images){
		const firstImage = images.results[0];
		if(images && images.results && images.results[0]){
		    responseContainer.insertAdjacentHTML('afterbegin', `<figure>
		            <img src="${firstImage.urls.small}" alt="${searchedForText}">
		            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
		        </figure>`
		    );
		 } else {
		 responseContainer.insertAdjacentHTML('afterbegin','<div class="error-no-image">No images available</div>');
		}
	}

	function requestError(e,part){
		console.log(e);
		responseContainer.insertAdjacentHTML('beforeend', '<div class="network error">Network issue</div>')
	}
})();
