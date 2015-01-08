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
			//var contentButtonElement = element[0].children[0].children[1];
			var resizeButtonElement = element[0].children[0].children[2];

			var moveState = null;
			var sizeState = null;

			var startMoving = function (e){

				moveState = calculatePos({
					x: e.pageX,
					y: e.pageY
				});

				element.addClass('moving');

				removeWindowAreaListeners();
				windowArea.addEventListener ('mousemove',dragWindow);
				windowArea.addEventListener ('mouseup',dragWindowEnds);

				e.preventDefault();
			};


			var startResizing = function (e){

				sizeState = calculateSize ({
					width:  e.pageX,
					height: e.pageY
				});

				element.addClass('resizing');

				removeWindowAreaListeners();
				windowArea.addEventListener ('mousemove',dragWindowCorner);
				windowArea.addEventListener ('mouseup',dragWindowCornerEnds);

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

			var dragWindowCorner = function (e){
				if (sizeState){
					resize (
						e.pageX + sizeState.width,
						e.pageY + sizeState.height
					);	
				}
			};

			var dragWindowEnds = function (){
				if (moveState) {
					element.removeClass('moving');
					moveState = null;
				}

				removeWindowAreaListeners();
			};

			var dragWindowCornerEnds = function (){
				if (sizeState){
					element.removeClass ('resizing');
					sizeState = null;
				}

				removeWindowAreaListeners();
			};

			var removeWindowAreaListeners = function (){
				windowArea.removeEventListener ('mousemove');
				windowArea.removeEventListener ('mouseup');
			};

			var calculatePos = function(ref) {
				var winX = parseInt(element.prop('offsetLeft'), 10);
				var winY = parseInt(element.prop('offsetTop'), 10); 	

				return {
					x: ref.x - winX,
					y: ref.y - winY
				};
			};

			var calculateSize = function (ref){
				var winWidth = parseInt(element.prop('offsetWidth'), 10);
				var winHeight = parseInt(element.prop('offsetHeight'), 10);

				return {
					width: winWidth - ref.width,
					height: winHeight - ref.height
				};
			};

			//set the element in the specified position
			var move = function(x, y) {
				element.css('left',x +'px');
				element.css('top',y + 'px');

			};

			//set the new size of the element
			var resize = function (width,height) {
				element.css ('width', width + 'px');
				element.css ('height', height + 'px');
			};

			//Set the listeners to the elements
			titleBarElement.addEventListener ('mousedown', startMoving);
			resizeButtonElement.addEventListener ('mousedown',startResizing);

		}
	};
});
