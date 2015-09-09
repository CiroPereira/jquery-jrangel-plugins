/**
 *
 * @name table
 * @version 0.1
 * @requires jQuery v1.7+
 * @author João Rangel
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, buy TopSundue:
 * 
 */
(function($){

 	$.fn.extend({ 
 		
		//pass the options variable to the function
 		table: function(options) {

			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				debug:false,
				params:{},
				url:"",
				listeners:{},
				tpl:'',
				success:function(){},
				failure:function(){},
				startAjax:function(){}
			};
			
			var o =  $.extend({}, defaults, options);

    		return this.each(function() {

    			var t = this;
				var 
					$table = $(t), 
					$tbody = $table.find('tbody'), 
					tplRow = Handlebars.compile($(o.tpl).html());

				if (typeof $table.data().opts === 'objects') {
					console.log('opts', $table.data().opts);
					o = table.data().opts;
				}

				t.load = function(){

					rest({
						url:o.url,
						params:o.params,
						success:function(r){

							t.render(r.data);

						}
					});

				};

				t.render = function(data){

					$tbody.html('');

					$.each(data, function(index, row){

						var $tr = $(tplRow(row));

						if (typeof o.listeners === 'object') {

							for (var name in o.listeners) {

								switch (name) {
									case 'rowclick':
									$tr.on('click', function(event){

										if(
											!$(event.target).hasClass('dropdown-toggle')
											&&
											!$(event.target).parents('.dropdown-toggle').length
											&&
											!$(event.target).parents('.dropdown-menu').length
										) {

											if(o.debug === true) console.log('rowclick', $tr);

											event.preventDefault();
											event.stopPropagation();
											o.listeners.rowclick($tr, event);
											return false;

										}

									});
									break;
									case 'btnclick':
									$tr.find('.btn, [role="menuitem"]').on('click', function(event){

										if(!$(this).hasClass('dropdown-toggle')){

											if(o.debug === true) console.log('btnclick', $tr);

											event.preventDefault();
											event.stopPropagation();
											o.listeners.btnclick($tr, $(event.delegateTarget).data(), event);
											return false;

										}

									});
									break;
								}

							}

						}

						$tbody.append($tr);

					});

					$table.unblock();

				}

				$table.data('opts', o);

				$table.block();

				if (typeof o.startAjax === 'function') o.startAjax();

				t.load();
				
				if ($(o.btnreload).length) {

					$(o.btnreload).btnrest({
						url:o.url,
						params:o.params,
						startAjax:o.startAjax,
						success:function(r){
							t.render(r.data);
						}
					});

				}				

				$(t).data('instance', t);
			
    		});

    	}

	});
	
})(jQuery);