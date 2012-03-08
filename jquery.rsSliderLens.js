/**
* jQuery SliderLens - Slider with magnification
* ====================================================
*
* Licensed under The MIT License
* 
* @version   1
* @since     25.02.2012
* @author    Jose Rui Santos
*
* 
* Input parameter  Default value  Remarks
* ================ =============  ===============================================================================================
*
* 
* Usage with default values:
* ==========================
*
*/
(function ($) {
    var SliderLensClass = function ($origBar, opts) {
        var elemOrig = {
                pos: $origBar.position(),
                width: $origBar.width(),
                height: $origBar.height()
            },
            elemRange = {
                $elem: null,
                width: elemOrig.width * opts.handle.zoom,
                height: elemOrig.height * opts.handle.zoom,
                init: function () {
                    if (opts.highlightRange && util.isRangeDefined()) {
                        this.$elem = $("<div>").css({
                            'position': 'absolute',
                            'z-index': util.toInt($origBar.css('z-index')) + 1
                        }).addClass(opts.style.classHighlightRange);
                        if (info.isHoriz) {
                            this.$elem.css({
                                'left': (elemOrig.pos.left + info.fromPixel) + 'px',
                                'top': elemOrig.pos.top + 'px',
                                'width': (info.toPixel - info.fromPixel + 1) + 'px',
                                'height': elemOrig.height + 'px'
                            });
                        } else {
                            this.$elem.css({
                                'left': elemOrig.pos.left + 'px',
                                'top': (elemOrig.pos.top + info.fromPixel) + 'px',
                                'width': elemOrig.width + 'px',
                                'height': (info.toPixel - info.fromPixel + 1) + 'px'
                            });
                        }
                    }
                }
            },
            elemMagnif = {
                $elem: null,
                width: elemOrig.width * opts.handle.zoom,
                height: elemOrig.height * opts.handle.zoom,
                init: function () {
                    var scale = 'scale(' + opts.handle.zoom + ')',
                        paddingHandle = opts.handle.size / 2 / opts.handle.zoom;
                    this.$elem = $origBar.clone().removeAttr('id').css({
                        '-webkit-transform-origin': '0 0',
                        '-moz-transform-origin': '0 0',
                        '-o-transform-origin': '0 0',
                        'msTransformOrigin': '0 0',
                        'transform-origin': '0 0',
                        '-webkit-transform': scale,
                        '-moz-transform': scale,
                        '-o-transform': scale,
                        'msTransform': scale,
                        'transform': scale,
                        'filter': "progid:DXImageTransform.Microsoft.Matrix(M11=" + opts.handle.zoom + ", M12=0, M21=0, M22=" + opts.handle.zoom + ", DX=0, Dy=0, SizingMethod='auto expand');",
                        'z-index': util.toInt($origBar.css('z-index')) + 2
                    });
                    if (info.isHoriz) {
                        this.$elem.css({
                            'width': this.width + 'px',
                            'height': this.height + 'px',
                            'padding-left': paddingHandle + 'px',
                            'padding-right': paddingHandle + 'px'
                        });
                    } else {
                        this.$elem.css({
                            'width': this.width + 'px',
                            'height': this.height + 'px',
                            'padding-top': paddingHandle + 'px',
                            'padding-bottom': paddingHandle + 'px'
                        });
                    }
                }
            },
            elemHandler = {
                $elem: null,
                width: elemOrig.width * opts.handle.zoom,
                height: elemOrig.height * opts.handle.zoom,
                init: function () {
                    this.$elem = elemMagnif.$elem.wrap("<div>").parent().css({
                        'border': '1px black solid',
                        'overflow': 'hidden',
                        'position': 'absolute',
                        'z-index': util.toInt($origBar.css('z-index')) + 2
                    });
                    if (info.isHoriz) {
                        this.$elem.css({
                            'width': opts.handle.size + 'px',
                            'height': this.height + 'px',
                            'top': (elemOrig.pos.top - (elemMagnif.height - elemOrig.height) * opts.handle.relativePos) + 'px'
                        });
                    } else {
                        this.$elem.css({
                            'width': this.width + 'px',
                            'height': opts.handle.size + 'px',
                            'left': (elemOrig.pos.left - (elemMagnif.width - elemOrig.width) * opts.handle.relativePos) + 'px'
                        });
                    }
                }
            },
            
            info = {
                currValue: 0,
                ticksStep: Math.max(elemOrig.width, elemOrig.height) / (opts.max - opts.min),
                isHoriz: elemOrig.width >= elemOrig.height,
                from: 0,
                to: 0,
                fromPixel: 0,
                toPixel: 0,
                checkBounds: function () {
                    var checkValue = function(minBound, maxBound) {
                            if (opts.value < minBound) {
                                opts.value = minBound;
                            } else {
                                if (opts.value > maxBound) {
                                    opts.value = maxBound;
                                }
                            }
                        },
                        checkValueArray = function(values, minBound, maxBound) {
                            if (values[0] < minBound) {
                                values[0] = minBound;
                            } else {
                                if (values[1] > maxBound) {
                                    values[1] = maxBound;
                                }
                            }
                        },
                        sw;
                    if (opts.min > opts.max) {
                        sw = opts.min;
                        opts.min = opts.max;
                        opts.max = sw;
                    }
                    if (util.useDoubleHandlers()) {
                        if (opts.value[0] > opts.value[1]) {
                            sw = opts.value[0];
                            opts.value[0] = opts.value[1];
                            opts.value[1] = sw;
                        }
                    }
                    if (util.isRangeDefined()) {
                        if (opts.range[0] > opts.range[1]) {
                            sw = opts.range[0];
                            opts.range[0] = opts.range[1];
                            opts.range[1] = sw;
                        }
                        checkValueArray(opts.range, opts.min, opts.max); 
                        
                        if (util.useDoubleHandlers()) {
                            checkValueArray(opts.value, opts.range[0], opts.range[1]); 
                        } else {
                            checkValue(opts.range[0], opts.range[1]); 
                        }
                    } else {
                        if (util.useDoubleHandlers()) {
                            checkValueArray(opts.value, opts.min, opts.max); 
                        } else {
                            checkValue(opts.min, opts.max); 
                        }
                    }
                },
                init: function () {
                    this.checkBounds();
                    this.from = util.isRangeDefined() ? opts.range[0] : opts.min;
                    this.to = util.isRangeDefined() ? opts.range[1] : opts.max;
                    this.fromPixel = (this.from - opts.min) * this.ticksStep;
                    this.toPixel = (this.to - opts.min) * this.ticksStep;
                }
            },
            
            init = function () {
                info.init();
                elemRange.init();
                elemMagnif.init();
                elemHandler.init();
                $origBar.after(elemRange.$elem).after(elemHandler.$elem);

                // to prevent the default behaviour in IE when dragging an element
                $origBar[0].ondragstart = elemMagnif.$elem[0].ondragstart = elemHandler.$elem[0].ondragstart = 
                $origBar[0].onselectstart  = elemMagnif.$elem[0].onselectstart  = elemHandler.$elem[0].onselectstart  = function () { return false; };
                
                // disable user text selection
                $origBar.add(elemRange.$elem).add(elemMagnif.$elem).add(elemHandler.$elem).css({
                    '-webkit-touch-callout': 'none',
                    '-webkit-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-moz-user-select': 'none',
                    '-ms-user-select': 'none',
                    '-o-user-select': 'none',
                    'user-select': 'none'
                });
                
                $origBar.add(elemRange.$elem).mousedown(panUtil.startDrag).mouseup(panUtil.stopDrag);
                elemHandler.$elem.mousedown(panUtil.startDragFromHandle).mouseup(panUtil.stopDrag).mouseleave(panUtil.stopDrag);
            },
            getPosHandler = function (valueNoMin) {
                return (opts.step > 0.00005 ? Math.round(valueNoMin * info.ticksStep / opts.step) * opts.step : valueNoMin * info.ticksStep ) - opts.handle.size / 2;
            },
            setValuePixel = function (value) { // value is a zero based pixel value
                if (value >= info.fromPixel && value <= info.toPixel) {
                    setValueTicks(value/info.ticksStep);
                }
            },
            setValueTicks = function (value) {
                var valueNoMin = value - opts.min;
                if (info.isHoriz) {
                    elemHandler.$elem.css({
                        'left': (elemOrig.pos.left + getPosHandler(valueNoMin)) + 'px'
                    }).scrollLeft(valueNoMin * opts.handle.zoom * info.ticksStep);
                } else {
                    elemHandler.$elem.css({
                        'top': (elemOrig.pos.top + getPosHandler(valueNoMin)) + 'px'
                    }).scrollTop(valueNoMin * opts.handle.zoom * info.ticksStep);
                }
                info.currValue = value;
                if (opts.events.onChange) {
                    opts.events.onChange($origBar, info.currValue);
                }
            },
            util = {
                toInt: function (str) {
                    return !str || str == 'auto' || str == '' ? 0 : parseInt(str, 10);
                },
                toFloat: function (str) {
                    return !str || str == 'auto' || str == '' ? 0.0 : parseFloat(str);
                },
                isRangeDefined: function () {
                    return !!opts.range && (typeof opts.range === 'object') && opts.range.length === 2;
                },
                useDoubleHandlers: function () {
                    return !!opts.value && (typeof opts.value === 'object') && opts.value.length === 2;
                }
            },
            panUtil = {
                noDrag: false,
                dragDelta: 0,
                animDone: function (value) {
                    setValuePixel(value + dragDelta);
                    if (!noDrag) {
                        elemHandler.$elem.bind('mousemove.rsSliderLens', panUtil.drag);
                    }
                },
                startDrag: function (event) {
                    var from = (info.currValue - opts.min) * info.ticksStep,
                        to = info.isHoriz ? event.pageX - elemOrig.pos.left : event.pageY - elemOrig.pos.top;
                    noDrag = false;
                    
                    if (from !== to) {
                        $({ n: from }).animate({ n: to }, {
                            duration: opts.handle.animation,
                            step: function (now) {
                                setValuePixel(now);
                            },
                            complete: function () {
                                panUtil.animDone(to);
                            }
                        });
                    } else {
                        panUtil.animDone(to);
                    }
                },
                startDragFromHandle: function (event) {
                    var from = (info.currValue - opts.min) * info.ticksStep,
                        to = info.isHoriz ? event.pageX - elemOrig.pos.left : event.pageY - elemOrig.pos.top;
                    noDrag = false;
                    dragDelta = from - to;
                    panUtil.animDone(to);
                },
                drag: function (event) {
                    setValuePixel((info.isHoriz ? event.pageX - elemOrig.pos.left : event.pageY - elemOrig.pos.top) + dragDelta);
                },
                stopDrag: function (event) {
                    noDrag = true;
                    elemHandler.$elem.unbind('mousemove.rsSliderLens');
                    dragDelta = 0;
                }                
            };

        init();
        setValueTicks(opts.value);
    };

    $.fn.rsSliderLens = function (options) {
        var gotoPos = function (optionsGoto) {
            var optsGoto = $.extend({}, $.fn.rsSlidetLens.defaultsGoto, optionsGoto);

            return this.each(function () {
                $(this).trigger('gotoSingle.rsSliderLens', [optsGoto]);
            });
        };

        if (typeof options === 'string') {
            var otherArgs = Array.prototype.slice.call(arguments, 1);
            switch (options) {
            
            
                case 'gotoPos': return gotoPos.apply(this, otherArgs);
                default: return this;
            }
        }
        var opts = $.extend({}, $.fn.rsSliderLens.defaults, options);
        opts.handle = $.extend({}, $.fn.rsSliderLens.defaults.handle, options ? options.handle : options);
        opts.style = $.extend({}, $.fn.rsSliderLens.defaults.style, options ? options.style : options);
        opts.events = $.extend({}, $.fn.rsSliderLens.defaults.events, options ? options.events : options);

        return this.each(function () {
            new SliderLensClass($(this), opts);
        });
    };

    // public access to the default input parameters
    $.fn.rsSliderLens.defaults = {
        value: 16, // number or a two number array. When a single number is used, only a single handle is shown. When an array is used (e.g. [5, 20]) two handles are shown.
        min: 0,
        max: 16,
        step: 0,
        range: null, // Two number array that defines the range of values that the user can select. For example, if range=[20, 80] and min=0, max=100 the slider 
                     // renders all scale from 0 to 100, but only the 20-80 range is selectable.
                     // If you want everything to be selectable, then do not specify range, or use range=null or even use range=[0, 100].
                     
        highlightRange: true, // If true, a highlight bar shows up to indicate the range location. This parameter is ignored if range parameter is undefined or null.
                               // The style of this bar is defined by the classHighlightRange parameter
        style: {
            classHighlightRange: 'sliderlens-range'
        },        
        handle: {
            size: 50,
            zoom: 1.5,
            relativePos: 0.4, // float between 0 and 1 that indicates the relative (0% -- 100%) vertical position of the magnified scale on horizontal orientation.
                              // When is 0, the magnified scale is vertically aligned to the top, 1 for the bottom.
                              // For vertical oriented sliders, relativePos is the relative horizontal position: 0 for the left side, 1 for the right side
            animation: 200
        },
        events: {
            onChange: null
        }
    };

    /* TODO */
    $.fn.rsSliderLens.defaultsGoto = {
        animate: 1000
    };
    
})(jQuery);