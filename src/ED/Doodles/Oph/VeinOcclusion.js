/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2013
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2013, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */

/**
 * Sector PRP
 *
 * @class VeinOcclusion
 * @property {String} className Name of doodle subclass
 * @param {Drawing} _drawing
 * @param {Object} _parameterJSON
 */
ED.VeinOcclusion = function(_drawing, _parameterJSON) {
	// Set classname
	this.className = "VeinOcclusion";
	
	// Saved parameters
	this.savedParameterArray = ['arc', 'rotation'];
	
	// Call super-class constructor
	ED.Doodle.call(this, _drawing, _parameterJSON);
}

/**
 * Sets superclass and constructor
 */
ED.VeinOcclusion.prototype = new ED.Doodle;
ED.VeinOcclusion.prototype.constructor = ED.VeinOcclusion;
ED.VeinOcclusion.superclass = ED.Doodle.prototype;

/**
 * Sets handle attributes
 */
ED.VeinOcclusion.prototype.setHandles = function() {
	this.handleArray[0] = new ED.Handle(null, true, ED.Mode.Arc, false);
	this.handleArray[3] = new ED.Handle(null, true, ED.Mode.Arc, false);
}

/**
 * Set default properties
 */
ED.VeinOcclusion.prototype.setPropertyDefaults = function() {
	this.isMoveable = false;
	//this.isRotatable = false;

	// Update component of validation array for simple parameters
	this.parameterValidationArray['arc']['range'].setMinAndMax(Math.PI / 6, Math.PI * 2);
	this.parameterValidationArray['apexX']['range'].setMinAndMax(-0, +0);
}

/**
 * Sets default parameters (Only called for new doodles)
 * Use the setParameter function for derived parameters, as this will also update dependent variables
 */
ED.VeinOcclusion.prototype.setParameterDefaults = function() {
	this.arc = 90 * Math.PI / 180;
	this.setRotationWithDisplacements(45, 120);
}

/**
 * Draws doodle or performs a hit test if a Point parameter is passed
 *
 * @param {Point} _point Optional point in canvas plane, passed if performing hit test
 */
ED.VeinOcclusion.prototype.draw = function(_point) {
	// Get context
	var ctx = this.drawing.context;

	// Call draw method in superclass
	ED.VeinOcclusion.superclass.draw.call(this, _point);

	// Radius of outer curve just inside ora on right and left fundus diagrams
	var ro = 420;
	var ri = 30;
	var r = ri + (ro - ri) / 2;

	// Calculate parameters for arcs
	var theta = this.arc / 2;
	var arcStart = -Math.PI / 2 + theta;
	var arcEnd = -Math.PI / 2 - theta;

	// Coordinates of 'corners' of VeinOcclusion
	var topRightX = r * Math.sin(theta);
	var topRightY = -r * Math.cos(theta);
	var topLeftX = -r * Math.sin(theta);
	var topLeftY = topRightY;

	// Boundary path
	ctx.beginPath();

	// Arc across to mirror image point on the other side
	ctx.arc(0, 0, ro, arcStart, arcEnd, true);

	// Arc back to mirror image point on the other side
	ctx.arc(0, 0, ri, arcEnd, arcStart, false);

	// Close path
	ctx.closePath();

	// Set line attributes
	ctx.lineWidth = 4;
	ctx.fillStyle = "rgba(255,255,0,0.5)";
	ctx.strokeStyle = "rgba(255,0,0,0.5)";

	// Draw boundary path (also hit testing)
	this.drawBoundary(_point);

	// Non boundary drawing
	if (this.drawFunctionMode == ED.drawFunctionMode.Draw) {
	
		this.haem(-100, -100, 0);
	
	/*
		// PRP spot data
		var si = 30;
		var sd = (30 + si);

		// Array of number of spots for each radius value
		var count = [47, 41, 35, 28, 22, 15];

		// Iterate through radius and angle to draw sector
		var i = 0;
		for (var r = ro - si; r > ri; r -= sd) {
			var j = 0;

			for (var a = -Math.PI / 2 - arcStart; a < this.arc - Math.PI / 2 - arcStart; a += sd / r) {
				a = -Math.PI / 2 - arcStart + j * 2 * Math.PI / count[i];

				var p = new ED.Point(0, 0);
				p.setWithPolars(r, a);
				this.drawLaserSpot(ctx, p.x, p.y);

				j++;
			}

			i++;
		}
		*/
	}

	// Coordinates of handles (in canvas plane)
	this.handleArray[0].location = this.transform.transformPoint(new ED.Point(topLeftX, topLeftY));
	this.handleArray[3].location = this.transform.transformPoint(new ED.Point(topRightX, topRightY));

	// Draw handles if selected
	if (this.isSelected && !this.isForDrawing) this.drawHandles(_point);

	// Return value indicating successful hit test
	return this.isClicked;
}

ED.VeinOcclusion.prototype.haem = function(_x, _y, _angle) {
	// Get context
	var ctx = this.drawing.context;
	
	var h = 40;

	ctx.beginPath();
	ctx.moveTo(_x, _y);
	ctx.lineTo(_x + 100, _y);
	//ctx.lineTo(_x + h * Math.sin(_angle), _y + h * Math.cos(_angle));
	
	ctx.lineWidth = 16;
	ctx.strokeStyle = "rgba(255,0,0,0.5)";
	
	ctx.stroke();	
}
