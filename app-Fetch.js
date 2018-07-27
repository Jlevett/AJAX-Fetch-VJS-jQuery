/*Written using fetch*/

(function () {
    const form = document.querySelector('#submit-btnfetch');
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


	 function XHRrequestImages(){
		fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,{
			headers: {Authorization:'Client-ID 2ad71d3b436058ac74cc02d7d79970c3f725591f2d50fdade1d91fbd356c48c3'}
		}).then(response=>response.json()).then(addImage).catch(function(error){console.log(error);});
	}


	function addImage(data){
		let htmlContent ='';
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


	function XHRRequestArticle(){
		fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=ea1720d1049348e4b321dea56dbdcba1`)
		.then(response=>response.json()).then(addArticle).catch(function(error){console.log(error);});
	}

	function addArticle(data){
		let htmlContent ='';
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





