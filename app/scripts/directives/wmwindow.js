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
		template: '<div class="wmWindow"><div class="wmWindowBox"><div class="wmTitleBar"><div class="wmTitle">{{title}}</div><div class="wmButtonBar"><button class="wmMaximize"/><button style="display:none" class="wmRestore"/><button class="wmClose"/></div></div><div class="wmContent" data-ng-transclude /><button class="wmResize" />',
		restrict: 'E',
		replace: true,
		transclude: true,
		scope: {
			title: '@',
			close: '&',
			maximize: '&',
			restore: '&',
			options: '@',
		},

		link: function (scope, element) {
			var windowArea = element[0].parentElement;
			var titleBarElement = element[0].children[0].children[0];
			var contentButtonElement = element[0].children[0].children[1];
			var resizeButtonElement = element[0].children[0].children[2];
			
			var buttonBar = titleBarElement.children[1];
		
			var maximizeButton = buttonBar.children[0];
			var closeButton = buttonBar.children[2];
			
			
			//State variables
			var positionState = null;
			var sizeState = null;
			var maximizeState = null;

			
			//Parse the options
			
			
			var options = scope.options ? JSON.parse(scope.options) :{};
			
			
			
			var startMoving = function (e){
				var isTouch = (e.targetTouches && e.targetTouches.length === 1);
				var moveRef =  isTouch ?  e.targetTouches[0] : e;
				
				positionState = calculatePos({
					x: moveRef.pageX,
					y: moveRef.pageY
				});

				element.addClass('moving');

				windowArea.addEventListener (isTouch ? 'touchmove' : 'mousemove',dragWindow);
				windowArea.addEventListener (isTouch ? 'touchend' : 'mouseup',dragWindowEnds);

				selectWindow();
				
				e.preventDefault();
			};


			var startResizing = function (e){
				var isTouch = (e.targetTouches && e.targetTouches.length === 1);
				var moveRef =  isTouch ?  e.targetTouches[0] : e;
				
				
				sizeState = calculateSize ({
					width:  moveRef.pageX,
					height: moveRef.pageY
				});

				element.addClass('resizing');

				windowArea.addEventListener (isTouch ? 'touchmove' : 'mousemove',dragWindowCorner);
				windowArea.addEventListener (isTouch ? 'touchend' : 'mouseup', dragWindowCornerEnds);
				selectWindow();
				
				e.preventDefault();

			};

			var dragWindow = function(e) {  
				var moveRef = (e.targetTouches && e.targetTouches.length === 1) ?  e.targetTouches[0] : e;
				
				if (positionState){
					move(
						moveRef.pageX - positionState.x,
						moveRef.pageY - positionState.y
					);
				}
			};

			var dragWindowCorner = function (e){
				var moveRef = (e.targetTouches && e.targetTouches.length === 1) ?  e.targetTouches[0] : e;

				if (sizeState){
					resize (
						moveRef.pageX + sizeState.width,
						moveRef.pageY + sizeState.height
					);	
				}
			};

			var dragWindowEnds = function (e){
				var isTouch = (e.targetTouches && e.targetTouches.length === 1);
				
				if (positionState) {
					element.removeClass('moving');
					positionState = null;
				}

				windowArea.removeEventListener (isTouch ? 'touchmove' : 'mousemove',dragWindow);
				windowArea.removeEventListener (isTouch ? 'touchend' : 'mouseup',dragWindowEnds);
				titleBarElement.removeEventListener ('click', selectWindow);
			};

			var dragWindowCornerEnds = function (e){
				var isTouch = (e.targetTouches && e.targetTouches.length === 1);
				
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
				windowArea.appendChild (element[0]);
			};
			
			
			//This function is executed when close button is pushed
			var close = function (){
				
				setTimeout (function (){
					element.addClass ('closing');
				
					setTimeout (function (){
						element.removeClass ('closing');
						element.detach();

					},400);
				},50);
				
				
				if (scope.close){
					scope.close();	
				}
			};
			
			//This functions is executed when maximize is executed
			var maximize = function (){
				
				//Store the position and the size state
				maximizeState = {
					x: parseInt(element.prop('offsetLeft'), 10),
					y: parseInt(element.prop('offsetTop'), 10),
					width: parseInt(element.prop('offsetWidth'), 10),
					height: parseInt(element.prop('offsetHeight'), 10)
				};
			
				//Select the element where to maximize
				var maximizeToElement = options.maximizeTo ? angular.element (options.maximizeTo) : windowArea;
				
				var maximizeCoords = {
					x: 0,
					y: 0,
					width: parseInt(maximizeToElement.offsetWidth, 10),
					height: parseInt(maximizeToElement.offsetHeight, 10)
				};
				
				//Set it to 
				selectWindow();
			
				//move and resize
				
				move (maximizeCoords.x + 10,maximizeCoords.y +10 );
				element.addClass ('maximizing');
				resize (maximizeCoords.width -20, maximizeCoords.height - 20);
				
				//Set the apropiate listeners
				maximizeButton.removeEventListener ('click',maximize);
				maximizeButton.addEventListener ('click',restore);
				titleBarElement.removeEventListener ('dblclick', maximize);
				titleBarElement.addEventListener ('dblclick', restore);
				
				stopWindowListeners();
			
				//Program the effect extraction
				setTimeout (function (){
					element.removeClass ('maximizing');
				},500);
				
				if (scope.maximize){
					scope.maximize();	
				}
				
			};
			
			var restore = function (){
				//move and resize to previus state
				element.addClass ('restoring');
				
				move (maximizeState.x,maximizeState.y);
				resize(maximizeState.width,maximizeState.height);
					  
				//Restore the listeners	   
				maximizeButton.removeEventListener ('click',restore);
				maximizeButton.addEventListener ('click',maximize);
				
				titleBarElement.removeEventListener ('dblclick', restore);
				titleBarElement.addEventListener ('dblclick', maximize);
				
				
				startWindowListeners();
				
				if (scope.restore){
					scope.restore();	
				}
				
				setTimeout (function (){
					element.removeClass ('restoring');
				},500);
				
			};
			
			
			var startWindowListeners =  function (){
				titleBarElement.addEventListener ('mousedown', startMoving);
				titleBarElement.addEventListener ('touchstart', startMoving);
				
				resizeButtonElement.addEventListener ('mousedown',startResizing);
				resizeButtonElement.addEventListener ('touchstart',startResizing);
				contentButtonElement.addEventListener ('click', selectWindow);
				
			};
			
			var stopWindowListeners = function (){
				titleBarElement.removeEventListener ('mousedown', startMoving);
				titleBarElement.removeEventListener ('touchstart', startMoving);
				
				resizeButtonElement.removeEventListener ('mousedown',startResizing);
				resizeButtonElement.removeEventListener ('touchstart',startResizing);
				contentButtonElement.removeEventListener ('click', selectWindow);
			};
			
		
			startWindowListeners ();
			
			closeButton.addEventListener ('click',close);
			maximizeButton.addEventListener ('click',maximize);
			titleBarElement.addEventListener ('dblclick', maximize);
			
			// apply the options for the window
			if (options.position){
				var position = options.position;
				move (position.x,position.y);	
			}
			if (options.size){
				var size = options.size;
				resize (size.width,size.height);
			}
			
			//To avoid adding transition listeners we remove tha clas after some time
			setTimeout (function (){
				element.addClass ('active');
				element.addClass ('opening');
				selectWindow();
			
				setTimeout (function (){
					element.removeClass ('opening');
				},400);
			},50);
			
			
		}
	};
});
