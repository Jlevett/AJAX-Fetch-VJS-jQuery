(function () {
    const form = document.querySelector('#submit-btnvanillajsp');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('click', function (e) {
    	if(searchField.value.length>0){
	        e.preventDefault();
	        responseContainer.innerHTML = '';
	        searchedForText = searchField.value;

			XHRrequestImages().then(addImage).catch(function(error){console.log(error);});
			XHRRequestArticle().then(addArticle).catch(function(error){console.log(error);});
	}});

	function XHRRequestArticle(){
		return new Promise(function(resolve, reject ){
			const nytRequest = new XMLHttpRequest();
			nytRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=ea1720d1049348e4b321dea56dbdcba1`);
			nytRequest.onload = function() {
				if (nytRequest.status==200) {
					resolve(nytRequest.response);
				 } else {
					reject(Error(nytRequest.statusText));
				 }
			};
			nytRequest.onerror = function(){
				reject(Error('Articles Network Error'));
			};
			nytRequest.send();
		});
	}

	function addArticle(stringdata){
			let htmlContent ='';
			const data = JSON.parse(stringdata);
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

	function XHRrequestImages(){
		return new Promise(function(resolve,reject){
			const unsplashRequest = new XMLHttpRequest();
			unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
			unsplashRequest.setRequestHeader('Authorization', 'Client-ID 2ad71d3b436058ac74cc02d7d79970c3f725591f2d50fdade1d91fbd356c48c3');
			unsplashRequest.onload = function() {
				if (unsplashRequest.status==200) {
					resolve(unsplashRequest.response);
				 } else {
					reject(Error(unsplashRequest.statusText));
				 }
			};
			unsplashRequest.onerror = function(){
				reject(Error('Images Network Error'));
			};
			unsplashRequest.send();
		});
	}

	function addImage(stringdata){
		// debugger;
		let htmlContent ='';
		const data = JSON.parse(stringdata);

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

})();
