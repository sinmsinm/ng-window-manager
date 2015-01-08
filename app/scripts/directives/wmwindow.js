'use strict';

/**
 * @ngdoc directive
 * @name ngWindowManager.directive:wmwindow
 * @description
 * # wmWindow
 */
angular.module('ngWindowManager',[])
.directive('wmwindow', function () {
	return {
		template: '<div class="wmWindow active"><div class="wmWindowBox"><div class="wmTitleBar"><div class="wmTitle">{{title}}</div><div class="wmButtonBar"><button class="wmClose"/><button class="wmMaximize"/></div></div><div class="wmContent" data-ng-transclude /><button class="wmResize" />',
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			title: '@'  
		},

		link: function (scope, element) {
			var windowArea = element[0].parentElement;
			var titleBarElement = element[0].children[0].children[0];

			var moveState = null;
			var startMoving = function (e){


				moveState = toLocal({
					x: e.pageX,
					y: e.pageY
				});


				element.addClass('move');

				windowArea.addEventListener ('mousemove',dragWindow);
				windowArea.addEventListener ('mouseup',dragWindowEnds);

				e.preventDefault();

			};


			var dragWindow = function(e) {  

				if (moveState){
					move(
						e.pageX - moveState.x,
						e.pageY - moveState.y
					);
				}
			};

			var dragWindowEnds = function (){
				if (moveState) {
					element.removeClass('move');
					moveState = null;
				}

				windowArea.removeEventListener ('mousemove');
				windowArea.removeEventListener ('mouseup');

			};


			var toLocal = function(coord) {
				var winX = parseInt(element.prop('offsetLeft'), 10);
				var winY = parseInt(element.prop('offsetTop'), 10); 	

				return {
					x: coord.x - winX,
					y: coord.y - winY
				};
			};

			var move = function(x, y) {
				element.css('left',x +'px');
				element.css('top',y + 'px');

			};


			//Click the title bar
			titleBarElement.addEventListener ('mousedown', startMoving);

		}
	};
});
