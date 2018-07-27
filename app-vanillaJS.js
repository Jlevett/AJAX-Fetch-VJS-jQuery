(function () {
    const form = document.querySelector('#submit-btnvanillajs');
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

	function XHRRequestArticle(){//ea1720d1049348e4b321dea56dbdcba1
		const nytRequest = new XMLHttpRequest();
		nytRequest.onload = addArticle;
		nytRequest.onerror = function(err){
			requestError(err,'article');
		}
		nytRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=ea1720d1049348e4b321dea56dbdcba1`);
		//No setRequestHeader is needed for this request to NYT
		nytRequest.send();
	}

	function XHRrequestImages(){
		const unsplashRequest = new XMLHttpRequest();
		unsplashRequest.onload = addImage;
		unsplashRequest.onerror = function(err){
			requestError(err,'image');
		}
		unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
		unsplashRequest.setRequestHeader('Authorization', 'Client-ID 2ad71d3b436058ac74cc02d7d79970c3f725591f2d50fdade1d91fbd356c48c3');
		unsplashRequest.send();
	}

	function addImage(){
		// debugger;
		let htmlContent ='';
		const data = JSON.parse(this.responseText);// the .responseText property - holds the text of the async request's response

		if(data && data.results && data.results[0]){
			const firstImage = data.results[0];

			htmlContent =`<figure>
				<img src= "${firstImage.urls.regular}" alt ="${searchedForText}">
				<figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
			</figure>`;
		} else {
			htmlContent = '<div class="error-no-image">No images available</div>';
		}

		responseContainer.insertAdjacentHTML('afterbegin',htmlContent);
	}


	function addArticle(){
	 	// debugger;
			let htmlContent ='';
			const data = JSON.parse(this.responseText);
	 		if(data.response && data.response.docs && data.response.docs.length>1){
	 			htmlContent ='<ul>' + data.response.docs.map(
	 				function(article){
			 			return `<li class = "article">
			 			<h2><a href = "${article.web_url}">${article.headline.main}</a></h2>
			 			<p>${article.snippet}</p>
			 			</li>`;
			 			}
	 			).join('') + '</ul>';
	 		} else {
	 			htmlContent = '<div class="error-no-articles">No articles available</div>';
	 		}
			responseContainer.insertAdjacentHTML('beforeend', htmlContent);
	}

})();
