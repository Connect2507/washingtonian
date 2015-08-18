// When document is ready, start to do things

var database;

$(function() { 
    console.log('Entry Point');
    
    $.getJSON('assets/data/database.json', function(data) {
    	database = data;
    	
        buildHeader();

	    buildFooter();
	    
	    home();
    });   
});

/**
 * Build the home content
 */
function home() {
	$('#siteContentId').empty();
	
	$('#siteContentId').append($('<div id="carouselContentId">'	
        	+ '</div>'
        	+ '<div id="siteMiddleId" class="container">'
            + '</div>'));
	
	buildContent();

    buildMiddle();
}

function buildHeader() {
	$('#siteHeaderId').load('html/header.html', function() {
		// Perform operations after html is loaded
		$('#search-button-id').on('click', function() {
			console.log('Search function');
		});

        $('#searchWordId').keyup(function(event) {
            event.preventDefault();
		    var value = $('#searchWordId').val();
		    searchContent(value);
		});
		
		$.getJSON('assets/data/menu.json', function(data) {
			var index = 0;
			$.each(data, function() {
				//console.log(this);
				index++;
				var itemContent = $('<div class="btn-group">'
				                        + '<button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
                                            + this.item
                                            + '<span class="caret"></span>'
                                        + '</button>'
                                        + '<ul  id="menuItem' + index + '" class="dropdown-menu" aria-labelledby="dropdownMenu1"></ul></div>');

				$('#navbar-menu-id').append(itemContent);
				
				// Create the submenu
				var itemIndex = 0;
				for (var i in this.subitems) {
					itemIndex++;
					var label = this.subitems[i];
				    var listsubItem = $('<li id="' + index + '-' + itemIndex + '"><a href="#">' + label + '</a></li>');
				    $('#menuItem' + index).append(listsubItem);
				}
			});
			
			// Add the action listeners
			menuItemsHandler();
		});
	});
}

function menuItemsHandler() {
	$('#1-1').on('click', function(event) {
        event.preventDefault();
        
        $('#kitchenContainerId').remove();
        
        $('#siteContentId').append( $('<div id="kitchenContainerId">').load('html/kitchen.html', function() {
            // JS logic scroll to item id: kitchenContentId
            
            // Discrete Scroll, without animation: 
            // window.scrollTo(0, $("#kitchenContainerId").offset().top);
            
            // Animated scroll:
            $('html, body').animate({ scrollTop: $("#kitchenContainerId").offset().top }, 1500);
        }));
	});
	
	$('#1-2').on('click', function() {
        $('body').append($('<div id="contactFormId"><div>'));
	});
}

function buildFooter() {
	$('#siteFooterId').load('html/footer.html', function() {
		// Perform operations after html is loaded:
		
		// Set the current year
		var currentYear = new Date().getFullYear();
		$('#currentYear-Id').text(currentYear);
	});
}

function buildContent() {
	$('#carouselContentId').load('html/carousel.html', function() {
        $.getJSON('assets/data/carousel-data.json', function(data) {
        	var index = 0;
            $.each(data, function() {
            	 index++;
                 var slideContent = $('<div class="item">'
										+ '<img src="' + this.image + '" alt="' + this.caption + '"/>'
										+ '<div class="carousel-caption">'
										    + this.title
										+ '</div>'
									+ '</div>');
									
				 var slideIndecator = $('<li data-target="#carousel-example-generic" data-slide-to="' + index + ']"></li>');
									
				 if (index == 1) {   // Make active the first one
				     slideContent.addClass('active');
				     slideIndecator.addClass('active');
				 }
									
			     $('#slides-wrapper-id').append(slideContent);
			     $('#slides-indicator-id').append(slideIndecator);
            });
        });
	});
}

function buildMiddle() {
     $('#siteMiddleId').load('html/middle.html', function() {
     	
     	$('#contactusId').click(function(event) {
     		event.preventDefault();
     		
     		$('#formContainerId').remove();
     		
     		$('body').append( $('<div id="formContainerId">').load('html/contact-form.html', function() {
     			$('#form-content').removeClass('hide');
     			$('#form-content').addClass('form-container-style');
     			$('.modal').css('display', 'block');
     			
     			// Set up buttons controls
     			$('#sendContactFormId').click(function(event) {
     		        event.preventDefault();
     		        
     		        var formData = {
     		        	name : $('#nameId').val().trim(),
     		        	email : $('#emailId').val().trim(),
     		        	message : $('#messageId').val().trim()
     		        };
     		        
     		        $.ajax({
     		        	type: 'POST',
     		        	url: 'php/contactus.php',
     		        	data: JSON.stringify(formData),
     		        	
     		        	headers : { 'Content-type' : 'application/x-www-form-urlencoded' },
     		        	
     		        	success : function(result) {
     		        		console.log(JSON.parse(result));
     		        		
     		        		if (result.success) {
     		        			
     		        		}
     		        	}
     		        });
     		        
     		    });

     			$('#cancelContactFormId, #closeContactFormId').click(function(event) {
     		        event.preventDefault();
     		        $('#formContainerId').remove();
     		    });
     		}));
     	});
     	
     });
}

/**
 * Search the word within a database
 * @param {Object} word
 */
function searchContent(word) {
	// Remove any previous result
	$('#listResultId').remove();
	
	var listResult = $('<ul id="listResultId"></ul>');
	
	// Search for new result
	for (var i in database) {
		var obj = database[i];

		if (word && word.length && obj.title.indexOf(word) >= 0) {
			var images = obj.image;
			
			for (var i in images) {
				var url = images[i];
				var placeholder = $('<li style="display: inline"><img src="' + url + '"/></li>');
				listResult.append(placeholder);
			}
			
		}
	}
	
	$('#siteContentId').prepend(listResult);
}
