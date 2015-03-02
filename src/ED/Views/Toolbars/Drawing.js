/**
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2014
 * This file is part of OpenEyes.
 *
 * OpenEyes is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OpenEyes is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OpenEyes.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global $: false */

/**
 * This view class manages the main toolbar.
 */
ED.Views.Toolbar.Drawing = (function() {

	function DrawingToolbar(drawing, container) {
		ED.Views.Toolbar.apply(this, arguments);
		this.zoomIcon = this.container.find('[class^=ed-icon-zoom]');
	}

	DrawingToolbar.prototype = Object.create(ED.Views.Toolbar.prototype);
	DrawingToolbar.prototype.constructor = DrawingToolbar;

	DrawingToolbar.prototype.registerForNotifications = function() {

		ED.Views.Toolbar.prototype.registerForNotifications.apply(this, arguments);

		this.drawing.registerForNotifications(this, 'handleZoom', [
			'drawingZoomOut',
			'drawingZoomIn',
		]);
	};

	DrawingToolbar.prototype.handleZoom = function(notification) {
		switch(notification.eventName) {
			case 'drawingZoomIn':
				this.updateIcon('ed-icon-zoom-out');
			break;
			case 'drawingZoomOut':
				this.updateIcon('ed-icon-zoom-in');
			break;
		}
	};

	DrawingToolbar.prototype.updateIcon = function(className) {
		this.zoomIcon
			.removeClass('ed-icon-zoom-in ed-icon-zoom-out')
			.addClass(className);
	};

	return DrawingToolbar;
}());