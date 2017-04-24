$(document).ready(function () {
	$.fn.readerImg = function (option) {
		var $$ = $(this);
		var upFile = option.src;
		var width = option.width != undefined ? option.width : '640px';

		if (upFile == undefined) {
			return false;
		}

		if ($$.hasClass('none')) {
			$$.removeClass('none');
		} else {
			$$.show();
		}
		
		if ($$[0].tagName != 'IMG') {
			var imgOjb = document.createElement('img');
			imgOjb.src = "";
			imgOjb.alt = "";
			$$.append(imgOjb);

			$$ = $(imgOjb);
		}

		$$.css({width: width});

		if (typeof (FileReader) != "undefined") {
		    var reader = new FileReader();
		    reader.onload = function (e) {
		       var result = e.target.result;
		       $$.attr('src', result);
		   }
		   reader.readAsDataURL(upFile);
		}
	};

	/**
	 * datepicker
	 */
	function datepicker() {
	    $('input.datepicker').each(function() {
	        var options = $(this).data('options') || {};
	        options.show_icon = false;
	        if (typeof options.pair == 'string') {
	            options.pair = $(options.pair);
	        }
	        $(this).Zebra_DatePicker(options);
	    });
	}
	datepicker();
});

