'use strict';
var core_1 = require('@angular/core');
;
var SignaturePad = (function () {
    function SignaturePad(elementRef) {
        // no op
        this.elementRef = elementRef;
        this.options = this.options || {};
        this.onBeginEvent = new core_1.EventEmitter();
        this.onEndEvent = new core_1.EventEmitter();
    }
    SignaturePad.prototype.ngAfterContentInit = function () {
        var sp = require('signature_pad')['default'];
        var canvas = this.elementRef.nativeElement.querySelector('canvas');
        if (this.options['canvasHeight']) {
            canvas.height = this.options['canvasHeight'];
        }
        if (this.options['canvasWidth']) {
            canvas.width = this.options['canvasWidth'];
        }
        this.signaturePad = new sp(canvas, this.options);
        this.signaturePad.onBegin = this.onBegin.bind(this);
        this.signaturePad.onEnd = this.onEnd.bind(this);
    };
    SignaturePad.prototype.resizeCanvas = function () {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        var canvas = this.signaturePad._canvas;
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    };
    // Returns signature image as an array of point groups
    SignaturePad.prototype.toData = function () {
        return this.signaturePad.toData();
    };
    // Draws signature image from an array of point groups
    SignaturePad.prototype.fromData = function (points) {
        this.signaturePad.fromData(points);
    };
    // Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible paramters)
    SignaturePad.prototype.toDataURL = function (imageType, quality) {
        return this.signaturePad.toDataURL(imageType, quality); // save image as data URL
    };
    // Draws signature image from data URL
    SignaturePad.prototype.fromDataURL = function (dataURL, options) {
        if (options === void 0) { options = {}; }
        // set default height and width on read data from URL
        if (!options.hasOwnProperty('height') && this.options['canvasHeight']) {
            options['height'] = this.options['canvasHeight'];
        }
        if (!options.hasOwnProperty('width') && this.options['canvasWidth']) {
            options['width'] = this.options['canvasWidth'];
        }
        this.signaturePad.fromDataURL(dataURL, options);
    };
    // Clears the canvas
    SignaturePad.prototype.clear = function () {
        this.signaturePad.clear();
    };
    // Returns true if canvas is empty, otherwise returns false
    SignaturePad.prototype.isEmpty = function () {
        return this.signaturePad.isEmpty();
    };
    // Unbinds all event handlers
    SignaturePad.prototype.off = function () {
        this.signaturePad.off();
    };
    // Rebinds all event handlers
    SignaturePad.prototype.on = function () {
        this.signaturePad.on();
    };
    // set an option on the signaturePad - e.g. set('minWidth', 50);
    SignaturePad.prototype.set = function (option, value) {
        switch (option) {
            case 'canvasHeight':
                this.signaturePad._canvas.height = value;
                break;
            case 'canvasWidth':
                this.signaturePad._canvas.width = value;
                break;
            default:
                this.signaturePad[option] = value;
        }
    };
    // notify subscribers on signature begin
    SignaturePad.prototype.onBegin = function () {
        this.onBeginEvent.emit(true);
    };
    // notify subscribers on signature end
    SignaturePad.prototype.onEnd = function () {
        this.onEndEvent.emit(true);
    };
    SignaturePad.prototype.queryPad = function () {
        return this.signaturePad;
    };
    SignaturePad.decorators = [
        { type: core_1.Component, args: [{
                    template: '<canvas></canvas>',
                    selector: 'signature-pad',
                },] },
    ];
    /** @nocollapse */
    SignaturePad.ctorParameters = [
        { type: core_1.ElementRef, },
    ];
    SignaturePad.propDecorators = {
        'options': [{ type: core_1.Input },],
        'onBeginEvent': [{ type: core_1.Output },],
        'onEndEvent': [{ type: core_1.Output },],
    };
    return SignaturePad;
}());
exports.SignaturePad = SignaturePad;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmF0dXJlLXBhZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpZ25hdHVyZS1wYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBRWIscUJBQW1FLGVBQWUsQ0FBQyxDQUFBO0FBUWxGLENBQUM7QUFNRjtJQVNFLHNCQUFZLFVBQXNCO1FBQ2hDLFFBQVE7UUFDUixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxtQkFBWSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRU0seUNBQWtCLEdBQXpCO1FBQ0UsSUFBSSxFQUFFLEdBQVEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xELElBQUksTUFBTSxHQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV4RSxFQUFFLENBQUMsQ0FBTyxJQUFJLENBQUMsT0FBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsTUFBTSxHQUFTLElBQUksQ0FBQyxPQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFPLElBQUksQ0FBQyxPQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxLQUFLLEdBQVMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2pE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QUFJLEVBQUUsYUFBTSxFQUFFLEVBQUU7UUFDbkMsWUFBWSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsYUFBTSxFQUFFLEVBQUU7S0FDaEMsQ0FBQztJQUNGLG1CQUFDO0FBQUQsQ0FBQyxBQXhJRCxJQXdJQztBQXhJWSxvQkFBWSxlQXdJeEIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZGVjbGFyZSB2YXIgcmVxdWlyZTogYW55O1xuXG5leHBvcnQgaW50ZXJmYWNlIFBvaW50IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHRpbWU6IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFBvaW50R3JvdXAgPSBBcnJheTxQb2ludD47XG5cblxuXG5leHBvcnQgY2xhc3MgU2lnbmF0dXJlUGFkIHtcblxuICAgcHVibGljIG9wdGlvbnM6IE9iamVjdDtcbiAgIHB1YmxpYyBvbkJlZ2luRXZlbnQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcbiAgIHB1YmxpYyBvbkVuZEV2ZW50OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XG5cbiAgcHJpdmF0ZSBzaWduYXR1cmVQYWQ6IGFueTtcbiAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICAvLyBubyBvcFxuICAgIHRoaXMuZWxlbWVudFJlZiA9IGVsZW1lbnRSZWY7XG4gICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMub25CZWdpbkV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMub25FbmRFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgbGV0IHNwOiBhbnkgPSByZXF1aXJlKCdzaWduYXR1cmVfcGFkJylbJ2RlZmF1bHQnXTtcbiAgICBsZXQgY2FudmFzOiBhbnkgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblxuICAgIGlmICgoPGFueT50aGlzLm9wdGlvbnMpWydjYW52YXNIZWlnaHQnXSkge1xuICAgICAgY2FudmFzLmhlaWdodCA9ICg8YW55PnRoaXMub3B0aW9ucylbJ2NhbnZhc0hlaWdodCddO1xuICAgIH1cblxuICAgIGlmICgoPGFueT50aGlzLm9wdGlvbnMpWydjYW52YXNXaWR0aCddKSB7XG4gICAgICBjYW52YXMud2lkdGggPSAoPGFueT50aGlzLm9wdGlvbnMpWydjYW52YXNXaWR0aCddO1xuICAgIH1cblxuICAgIHRoaXMuc2lnbmF0dXJlUGFkID0gbmV3IHNwKGNhbnZhcywgdGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLnNpZ25hdHVyZVBhZC5vbkJlZ2luID0gdGhpcy5vbkJlZ2luLmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaWduYXR1cmVQYWQub25FbmQgPSB0aGlzLm9uRW5kLmJpbmQodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgcmVzaXplQ2FudmFzKCk6IHZvaWQge1xuICAgIC8vIFdoZW4gem9vbWVkIG91dCB0byBsZXNzIHRoYW4gMTAwJSwgZm9yIHNvbWUgdmVyeSBzdHJhbmdlIHJlYXNvbixcbiAgICAvLyBzb21lIGJyb3dzZXJzIHJlcG9ydCBkZXZpY2VQaXhlbFJhdGlvIGFzIGxlc3MgdGhhbiAxXG4gICAgLy8gYW5kIG9ubHkgcGFydCBvZiB0aGUgY2FudmFzIGlzIGNsZWFyZWQgdGhlbi5cbiAgICBjb25zdCByYXRpbzogbnVtYmVyID0gTWF0aC5tYXgod2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSwgMSk7XG4gICAgY29uc3QgY2FudmFzOiBhbnkgPSB0aGlzLnNpZ25hdHVyZVBhZC5fY2FudmFzO1xuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhcy5vZmZzZXRXaWR0aCAqIHJhdGlvO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBjYW52YXMub2Zmc2V0SGVpZ2h0ICogcmF0aW87XG4gICAgY2FudmFzLmdldENvbnRleHQoJzJkJykuc2NhbGUocmF0aW8sIHJhdGlvKTtcbiAgICB0aGlzLnNpZ25hdHVyZVBhZC5jbGVhcigpOyAvLyBvdGhlcndpc2UgaXNFbXB0eSgpIG1pZ2h0IHJldHVybiBpbmNvcnJlY3QgdmFsdWVcbiAgfVxuXG4gICAvLyBSZXR1cm5zIHNpZ25hdHVyZSBpbWFnZSBhcyBhbiBhcnJheSBvZiBwb2ludCBncm91cHNcbiAgcHVibGljIHRvRGF0YSgpOiBBcnJheTxQb2ludEdyb3VwPiB7XG4gICAgcmV0dXJuIHRoaXMuc2lnbmF0dXJlUGFkLnRvRGF0YSgpO1xuICB9XG5cbiAgLy8gRHJhd3Mgc2lnbmF0dXJlIGltYWdlIGZyb20gYW4gYXJyYXkgb2YgcG9pbnQgZ3JvdXBzXG4gIHB1YmxpYyBmcm9tRGF0YShwb2ludHM6IEFycmF5PFBvaW50R3JvdXA+KTogdm9pZCB7XG4gICAgdGhpcy5zaWduYXR1cmVQYWQuZnJvbURhdGEocG9pbnRzKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgc2lnbmF0dXJlIGltYWdlIGFzIGRhdGEgVVJMIChzZWUgaHR0cHM6Ly9tZG4uaW8vdG9kYXRhdXJsIGZvciB0aGUgbGlzdCBvZiBwb3NzaWJsZSBwYXJhbXRlcnMpXG4gIHB1YmxpYyB0b0RhdGFVUkwoaW1hZ2VUeXBlPzogc3RyaW5nLCBxdWFsaXR5PzogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5zaWduYXR1cmVQYWQudG9EYXRhVVJMKGltYWdlVHlwZSwgcXVhbGl0eSk7IC8vIHNhdmUgaW1hZ2UgYXMgZGF0YSBVUkxcbiAgfVxuXG4gIC8vIERyYXdzIHNpZ25hdHVyZSBpbWFnZSBmcm9tIGRhdGEgVVJMXG4gIHB1YmxpYyBmcm9tRGF0YVVSTChkYXRhVVJMOiBzdHJpbmcsIG9wdGlvbnM6IE9iamVjdCA9IHt9KTogdm9pZCB7XG4gICAgLy8gc2V0IGRlZmF1bHQgaGVpZ2h0IGFuZCB3aWR0aCBvbiByZWFkIGRhdGEgZnJvbSBVUkxcbiAgICBpZiAoIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2hlaWdodCcpICYmICg8YW55PnRoaXMub3B0aW9ucylbJ2NhbnZhc0hlaWdodCddKSB7XG4gICAgICBvcHRpb25zWydoZWlnaHQnXSA9ICg8YW55PnRoaXMub3B0aW9ucylbJ2NhbnZhc0hlaWdodCddO1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3dpZHRoJykgJiYgKDxhbnk+dGhpcy5vcHRpb25zKVsnY2FudmFzV2lkdGgnXSkge1xuICAgICAgb3B0aW9uc1snd2lkdGgnXSA9ICg8YW55PnRoaXMub3B0aW9ucylbJ2NhbnZhc1dpZHRoJ107XG4gICAgfVxuICAgIHRoaXMuc2lnbmF0dXJlUGFkLmZyb21EYXRhVVJMKGRhdGFVUkwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLy8gQ2xlYXJzIHRoZSBjYW52YXNcbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuc2lnbmF0dXJlUGFkLmNsZWFyKCk7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgY2FudmFzIGlzIGVtcHR5LCBvdGhlcndpc2UgcmV0dXJucyBmYWxzZVxuICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaWduYXR1cmVQYWQuaXNFbXB0eSgpO1xuICB9XG5cbiAgLy8gVW5iaW5kcyBhbGwgZXZlbnQgaGFuZGxlcnNcbiAgcHVibGljIG9mZigpOiB2b2lkIHtcbiAgICB0aGlzLnNpZ25hdHVyZVBhZC5vZmYoKTtcbiAgfVxuXG4gIC8vIFJlYmluZHMgYWxsIGV2ZW50IGhhbmRsZXJzXG4gIHB1YmxpYyBvbigpOiB2b2lkIHtcbiAgICB0aGlzLnNpZ25hdHVyZVBhZC5vbigpO1xuICB9XG5cbiAgLy8gc2V0IGFuIG9wdGlvbiBvbiB0aGUgc2lnbmF0dXJlUGFkIC0gZS5nLiBzZXQoJ21pbldpZHRoJywgNTApO1xuICBwdWJsaWMgc2V0KG9wdGlvbjogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG5cbiAgICBzd2l0Y2ggKG9wdGlvbikge1xuICAgICAgY2FzZSAnY2FudmFzSGVpZ2h0JzpcbiAgICAgICAgdGhpcy5zaWduYXR1cmVQYWQuX2NhbnZhcy5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjYW52YXNXaWR0aCc6XG4gICAgICAgIHRoaXMuc2lnbmF0dXJlUGFkLl9jYW52YXMud2lkdGggPSB2YWx1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnNpZ25hdHVyZVBhZFtvcHRpb25dID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLy8gbm90aWZ5IHN1YnNjcmliZXJzIG9uIHNpZ25hdHVyZSBiZWdpblxuICBwdWJsaWMgb25CZWdpbigpOiB2b2lkIHtcbiAgICB0aGlzLm9uQmVnaW5FdmVudC5lbWl0KHRydWUpO1xuICB9XG5cbiAgLy8gbm90aWZ5IHN1YnNjcmliZXJzIG9uIHNpZ25hdHVyZSBlbmRcbiAgcHVibGljIG9uRW5kKCk6IHZvaWQge1xuICAgIHRoaXMub25FbmRFdmVudC5lbWl0KHRydWUpO1xuICB9XG5cblx0cHVibGljIHF1ZXJ5UGFkKCk6IGFueSB7XG5cdFx0cmV0dXJuIHRoaXMuc2lnbmF0dXJlUGFkO1xuXHR9XG5zdGF0aWMgZGVjb3JhdG9yczogRGVjb3JhdG9ySW52b2NhdGlvbltdID0gW1xueyB0eXBlOiBDb21wb25lbnQsIGFyZ3M6IFt7XG4gIHRlbXBsYXRlOiAnPGNhbnZhcz48L2NhbnZhcz4nLFxuICBzZWxlY3RvcjogJ3NpZ25hdHVyZS1wYWQnLFxufSwgXSB9LFxuXTtcbi8qKiBAbm9jb2xsYXBzZSAqL1xuc3RhdGljIGN0b3JQYXJhbWV0ZXJzOiAoe3R5cGU6IGFueSwgZGVjb3JhdG9ycz86IERlY29yYXRvckludm9jYXRpb25bXX18bnVsbClbXSA9IFtcbnt0eXBlOiBFbGVtZW50UmVmLCB9LFxuXTtcbnN0YXRpYyBwcm9wRGVjb3JhdG9yczoge1trZXk6IHN0cmluZ106IERlY29yYXRvckludm9jYXRpb25bXX0gPSB7XG4nb3B0aW9ucyc6IFt7IHR5cGU6IElucHV0IH0sXSxcbidvbkJlZ2luRXZlbnQnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxuJ29uRW5kRXZlbnQnOiBbeyB0eXBlOiBPdXRwdXQgfSxdLFxufTtcbn1cblxuaW50ZXJmYWNlIERlY29yYXRvckludm9jYXRpb24ge1xuICB0eXBlOiBGdW5jdGlvbjtcbiAgYXJncz86IGFueVtdO1xufVxuIl19