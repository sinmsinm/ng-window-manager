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
			var contentButtonElement = element[0].children[0].children[1];
			var resizeButtonElement = element[0].children[0].children[2];
			

			var moveState = null;
			var sizeState = null;

			var startMoving = function (e){
				var isTouch = (e.targetTouches && e.targetTouches.length == 1);
				var moveRef =  isTouch ?  e.targetTouches[0] : e;
				
				moveState = calculatePos({
					x: moveRef.pageX,
					y: moveRef.pageY
				});

				element.addClass('moving');

				windowArea.addEventListener (isTouch ? 'touchmove' : 'mousemove',dragWindow);
				windowArea.addEventListener (isTouch ? 'touchend' : 'mouseup',dragWindowEnds);

				e.preventDefault();
			};


			var startResizing = function (e){
				var isTouch = (e.targetTouches && e.targetTouches.length == 1);
				var moveRef =  isTouch ?  e.targetTouches[0] : e;
				
				
				sizeState = calculateSize ({
					width:  moveRef.pageX,
					height: moveRef.pageY
				});

				element.addClass('resizing');

				windowArea.addEventListener (isTouch ? 'touchmove' : 'mousemove',dragWindowCorner);
				windowArea.addEventListener (isTouch ? 'touchend' : 'mouseup', dragWindowCornerEnds);

				e.preventDefault();

			};

			var dragWindow = function(e) {  
				var moveRef = (e.targetTouches && e.targetTouches.length == 1) ?  e.targetTouches[0] : e;
				
				if (moveState){
					move(
						moveRef.pageX - moveState.x,
						moveRef.pageY - moveState.y
					);
				}
			};

			var dragWindowCorner = function (e){
				var moveRef = (e.targetTouches && e.targetTouches.length == 1) ?  e.targetTouches[0] : e;

				if (sizeState){
					resize (
						moveRef.pageX + sizeState.width,
						moveRef.pageY + sizeState.height
					);	
				}
			};

			var dragWindowEnds = function (e){
				var isTouch = (e.targetTouches && e.targetTouches.length == 1);
				
				if (moveState) {
					element.removeClass('moving');
					moveState = null;
				}

				windowArea.removeEventListener (isTouch ? 'touchmove' : 'mousemove',dragWindow);
				windowArea.removeEventListener (isTouch ? 'touchend' : 'mouseup',dragWindowEnds);
				titleBarElement.removeEventListener ('click', selectWindow);
			};

			var dragWindowCornerEnds = function (e){
				var isTouch = (e.targetTouches && e.targetTouches.length == 1);
				
				if (sizeState){
					element.removeClass ('resizing');
					sizeState = null;
				}
				
				windowArea.removeEventListener (isTouch ? 'touchmove' : 'mousemove',dragWindowCorner);
				windowArea.removeEventListener (isTouch ? 'touchend' : 'mouseup',dragWindowCornerEnds);
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

			var selectWindow = function (){
				console.log ('window');
			};
			
			//Set the listeners to the elements
			titleBarElement.addEventListener ('mousedown', startMoving);
			titleBarElement.addEventListener ('touchstart', startMoving);
			resizeButtonElement.addEventListener ('mousedown',startResizing);
			resizeButtonElement.addEventListener ('touchstart',startResizing);
			
			
			titleBarElement.addEventListener ('click', selectWindow);
			contentButtonElement.addEventListener ('click', selectWindow);
			
		}
	};
});
