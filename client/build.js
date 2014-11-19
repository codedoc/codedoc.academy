/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

  // Establish scope.
  window.WebComponents = window.WebComponents || {flags:{}};

  // loading script
  var file = 'webcomponents.js';
  var script = document.querySelector('script[src*="' + file + '"]');

  // Flags. Convert url arguments to flags
  var flags = {};
  if (!flags.noOpts) {
    // from url
    location.search.slice(1).split('&').forEach(function(o) {
      o = o.split('=');
      o[0] && (flags[o[0]] = o[1] || true);
    });
    // from script
    if (script) {
      for (var i=0, a; (a=script.attributes[i]); i++) {
        if (a.name !== 'src') {
          flags[a.name] = a.value || true;
        }
      }
    }
    // log flags
    if (flags.log) {
      var parts = flags.log.split(',');
      flags.log = {};
      parts.forEach(function(f) {
        flags.log[f] = true;
      });
    } else {
      flags.log = {};
    }
  }

  // Determine default settings.
  // If any of these flags match 'native', then force native ShadowDOM; any
  // other truthy value, or failure to detect native
  // ShadowDOM, results in polyfill
  flags.shadow = (flags.shadow || flags.shadowdom || flags.polyfill);
  if (flags.shadow === 'native') {
    flags.shadow = false;
  } else {
    flags.shadow = flags.shadow || !HTMLElement.prototype.createShadowRoot;
  }

  // Load.
  var ShadowDOMNative = [
    'WebComponents/shadowdom.js'
  ];

  var ShadowDOMPolyfill = [
    'ShadowDOM/ShadowDOM.js',
    'WebComponents/shadowdom.js',
    'ShadowCSS/ShadowCSS.js'
  ];

  // select ShadowDOM impl
  var ShadowDOM = flags.shadow ? ShadowDOMPolyfill : ShadowDOMNative;

  // construct full dependency list
  var modules = [].concat(
    ShadowDOM,
    [
      'HTMLImports/HTMLImports.js',
      'CustomElements/CustomElements.js',
      'WebComponents/lang.js',
      // these scripts are loaded here due to polyfill timing issues
      'WebComponents/dom.js',
      'WebComponents/unresolved.js',
      // back compat.
      'WebComponents/bc.js'
    ]
  );

  // var src = script.getAttribute('src');
  // var path = src.slice(0, src.lastIndexOf(file));

  // modules.forEach(function(f) {
  //   document.write('<script src="' + path + 'src/' + f + '"><\/script>');
  // });

  // exports
  WebComponents.flags = flags;

})();
;
/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version: 0.4.2
window.PolymerGestures={},function(a){var b=!1,c=document.createElement("meta");if(c.createShadowRoot){var d=c.createShadowRoot(),e=document.createElement("span");d.appendChild(e),c.addEventListener("testpath",function(a){a.path&&(b=a.path[0]===e),a.stopPropagation()});var f=new CustomEvent("testpath",{bubbles:!0});document.head.appendChild(c),e.dispatchEvent(f),c.parentNode.removeChild(c),d=e=null}c=null;var g={shadow:function(a){return a?a.shadowRoot||a.webkitShadowRoot:void 0},canTarget:function(a){return a&&Boolean(a.elementFromPoint)},targetingShadow:function(a){var b=this.shadow(a);return this.canTarget(b)?b:void 0},olderShadow:function(a){var b=a.olderShadowRoot;if(!b){var c=a.querySelector("shadow");c&&(b=c.olderShadowRoot)}return b},allShadows:function(a){for(var b=[],c=this.shadow(a);c;)b.push(c),c=this.olderShadow(c);return b},searchRoot:function(a,b,c){var d,e;return a?(d=a.elementFromPoint(b,c),d?e=this.targetingShadow(d):a!==document&&(e=this.olderShadow(a)),this.searchRoot(e,b,c)||d):void 0},owner:function(a){if(!a)return document;for(var b=a;b.parentNode;)b=b.parentNode;return b.nodeType!=Node.DOCUMENT_NODE&&b.nodeType!=Node.DOCUMENT_FRAGMENT_NODE&&(b=document),b},findTarget:function(a){if(b&&a.path&&a.path.length)return a.path[0];var c=a.clientX,d=a.clientY,e=this.owner(a.target);return e.elementFromPoint(c,d)||(e=document),this.searchRoot(e,c,d)},findTouchAction:function(a){var c;if(b&&a.path&&a.path.length){for(var d=a.path,e=0;e<d.length;e++)if(c=d[e],c.nodeType===Node.ELEMENT_NODE&&c.hasAttribute("touch-action"))return c.getAttribute("touch-action")}else for(c=a.target;c;){if(c.nodeType===Node.ELEMENT_NODE&&c.hasAttribute("touch-action"))return c.getAttribute("touch-action");c=c.parentNode||c.host}return"auto"},LCA:function(a,b){if(a===b)return a;if(a&&!b)return a;if(b&&!a)return b;if(!b&&!a)return document;if(a.contains&&a.contains(b))return a;if(b.contains&&b.contains(a))return b;var c=this.depth(a),d=this.depth(b),e=c-d;for(e>=0?a=this.walk(a,e):b=this.walk(b,-e);a&&b&&a!==b;)a=a.parentNode||a.host,b=b.parentNode||b.host;return a},walk:function(a,b){for(var c=0;a&&b>c;c++)a=a.parentNode||a.host;return a},depth:function(a){for(var b=0;a;)b++,a=a.parentNode||a.host;return b},deepContains:function(a,b){var c=this.LCA(a,b);return c===a},insideNode:function(a,b,c){var d=a.getBoundingClientRect();return d.left<=b&&b<=d.right&&d.top<=c&&c<=d.bottom},path:function(a){var c;if(b&&a.path&&a.path.length)c=a.path;else{c=[];for(var d=this.findTarget(a);d;)c.push(d),d=d.parentNode||d.host}return c}};a.targetFinding=g,a.findTarget=g.findTarget.bind(g),a.deepContains=g.deepContains.bind(g),a.insideNode=g.insideNode}(window.PolymerGestures),function(){function a(a){return"html /deep/ "+b(a)}function b(a){return'[touch-action="'+a+'"]'}function c(a){return"{ -ms-touch-action: "+a+"; touch-action: "+a+";}"}var d=["none","auto","pan-x","pan-y",{rule:"pan-x pan-y",selectors:["pan-x pan-y","pan-y pan-x"]},"manipulation"],e="",f="string"==typeof document.head.style.touchAction,g=!window.ShadowDOMPolyfill&&document.head.createShadowRoot;if(f){d.forEach(function(d){String(d)===d?(e+=b(d)+c(d)+"\n",g&&(e+=a(d)+c(d)+"\n")):(e+=d.selectors.map(b)+c(d.rule)+"\n",g&&(e+=d.selectors.map(a)+c(d.rule)+"\n"))});var h=document.createElement("style");h.textContent=e,document.head.appendChild(h)}}(),function(a){var b=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","pageX","pageY"],c=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0],d=function(){return function(){}},e={preventTap:d,makeBaseEvent:function(a,b){var c=document.createEvent("Event");return c.initEvent(a,b.bubbles||!1,b.cancelable||!1),c.preventTap=e.preventTap(c),c},makeGestureEvent:function(a,b){b=b||Object.create(null);for(var c,d=this.makeBaseEvent(a,b),e=0,f=Object.keys(b);e<f.length;e++)c=f[e],d[c]=b[c];return d},makePointerEvent:function(a,d){d=d||Object.create(null);for(var e,f=this.makeBaseEvent(a,d),g=0;g<b.length;g++)e=b[g],f[e]=d[e]||c[g];f.buttons=d.buttons||0;var h=0;return h=d.pressure?d.pressure:f.buttons?.5:0,f.x=f.clientX,f.y=f.clientY,f.pointerId=d.pointerId||0,f.width=d.width||0,f.height=d.height||0,f.pressure=h,f.tiltX=d.tiltX||0,f.tiltY=d.tiltY||0,f.pointerType=d.pointerType||"",f.hwTimestamp=d.hwTimestamp||0,f.isPrimary=d.isPrimary||!1,f._source=d._source||"",f}};a.eventFactory=e}(window.PolymerGestures),function(a){function b(){if(c){var a=new Map;return a.pointers=d,a}this.keys=[],this.values=[]}var c=window.Map&&window.Map.prototype.forEach,d=function(){return this.size};b.prototype={set:function(a,b){var c=this.keys.indexOf(a);c>-1?this.values[c]=b:(this.keys.push(a),this.values.push(b))},has:function(a){return this.keys.indexOf(a)>-1},"delete":function(a){var b=this.keys.indexOf(a);b>-1&&(this.keys.splice(b,1),this.values.splice(b,1))},get:function(a){var b=this.keys.indexOf(a);return this.values[b]},clear:function(){this.keys.length=0,this.values.length=0},forEach:function(a,b){this.values.forEach(function(c,d){a.call(b,c,this.keys[d],this)},this)},pointers:function(){return this.keys.length}},a.PointerMap=b}(window.PolymerGestures),function(a){var b,c=["bubbles","cancelable","view","detail","screenX","screenY","clientX","clientY","ctrlKey","altKey","shiftKey","metaKey","button","relatedTarget","buttons","pointerId","width","height","pressure","tiltX","tiltY","pointerType","hwTimestamp","isPrimary","type","target","currentTarget","which","pageX","pageY","timeStamp","preventTap","tapPrevented","_source"],d=[!1,!1,null,null,0,0,0,0,!1,!1,!1,!1,0,null,0,0,0,0,0,0,0,"",0,!1,"",null,null,0,0,0,0,function(){},!1],e="undefined"!=typeof SVGElementInstance,f=a.eventFactory,g={IS_IOS:!1,pointermap:new a.PointerMap,requiredGestures:new a.PointerMap,eventMap:Object.create(null),eventSources:Object.create(null),eventSourceList:[],gestures:[],dependencyMap:{down:{listeners:0,index:-1},up:{listeners:0,index:-1}},gestureQueue:[],registerSource:function(a,b){var c=b,d=c.events;d&&(d.forEach(function(a){c[a]&&(this.eventMap[a]=c[a].bind(c))},this),this.eventSources[a]=c,this.eventSourceList.push(c))},registerGesture:function(a,b){var c=Object.create(null);c.listeners=0,c.index=this.gestures.length;for(var d,e=0;e<b.exposes.length;e++)d=b.exposes[e].toLowerCase(),this.dependencyMap[d]=c;this.gestures.push(b)},register:function(a,b){for(var c,d=this.eventSourceList.length,e=0;d>e&&(c=this.eventSourceList[e]);e++)c.register.call(c,a,b)},unregister:function(a){for(var b,c=this.eventSourceList.length,d=0;c>d&&(b=this.eventSourceList[d]);d++)b.unregister.call(b,a)},down:function(a){this.requiredGestures.set(a.pointerId,b),this.fireEvent("down",a)},move:function(a){a.type="move",this.fillGestureQueue(a)},up:function(a){this.fireEvent("up",a),this.requiredGestures.delete(a.pointerId)},cancel:function(a){a.tapPrevented=!0,this.fireEvent("up",a),this.requiredGestures.delete(a.pointerId)},addGestureDependency:function(a,b){var c=a._pgEvents;if(c)for(var d,e,f,g=Object.keys(c),h=0;h<g.length;h++)f=g[h],c[f]>0&&(d=this.dependencyMap[f],e=d?d.index:-1,b[e]=!0)},eventHandler:function(c){var d=c.type;if("touchstart"===d||"mousedown"===d||"pointerdown"===d||"MSPointerDown"===d)if(c._handledByPG||(b={}),this.IS_IOS)for(var e,f=a.targetFinding.path(c),g=0;g<f.length;g++)e=f[g],this.addGestureDependency(e,b);else this.addGestureDependency(c.currentTarget,b);if(!c._handledByPG){var h=this.eventMap&&this.eventMap[d];h&&h(c),c._handledByPG=!0}},listen:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.addEvent(a,c)},unlisten:function(a,b){for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.removeEvent(a,c)},addEvent:function(a,b){a.addEventListener(b,this.boundHandler)},removeEvent:function(a,b){a.removeEventListener(b,this.boundHandler)},makeEvent:function(a,b){var c=f.makePointerEvent(a,b);return c.preventDefault=b.preventDefault,c.tapPrevented=b.tapPrevented,c._target=c._target||b.target,c},fireEvent:function(a,b){var c=this.makeEvent(a,b);return this.dispatchEvent(c)},cloneEvent:function(a){for(var b,f=Object.create(null),g=0;g<c.length;g++)b=c[g],f[b]=a[b]||d[g],("target"===b||"relatedTarget"===b)&&e&&f[b]instanceof SVGElementInstance&&(f[b]=f[b].correspondingUseElement);return f.preventDefault=function(){a.preventDefault()},f},dispatchEvent:function(a){var b=a._target;if(b){b.dispatchEvent(a);var c=this.cloneEvent(a);c.target=b,this.fillGestureQueue(c)}},gestureTrigger:function(){for(var a,b,c=0;c<this.gestureQueue.length;c++){a=this.gestureQueue[c],b=a._requiredGestures;for(var d,e,f=0;f<this.gestures.length;f++)b[f]&&(d=this.gestures[f],e=d[a.type],e&&e.call(d,a))}this.gestureQueue.length=0},fillGestureQueue:function(a){this.gestureQueue.length||requestAnimationFrame(this.boundGestureTrigger),a._requiredGestures=this.requiredGestures.get(a.pointerId),this.gestureQueue.push(a)}};g.boundHandler=g.eventHandler.bind(g),g.boundGestureTrigger=g.gestureTrigger.bind(g),a.dispatcher=g,a.activateGesture=function(a,b){var c=b.toLowerCase(),d=g.dependencyMap[c];if(d){var e=g.gestures[d.index];if(a._pgListeners||(g.register(a),a._pgListeners=0),e){var f,h=e.defaultActions&&e.defaultActions[c];switch(a.nodeType){case Node.ELEMENT_NODE:f=a;break;case Node.DOCUMENT_FRAGMENT_NODE:f=a.host;break;default:f=null}h&&f&&!f.hasAttribute("touch-action")&&f.setAttribute("touch-action",h)}a._pgEvents||(a._pgEvents={}),a._pgEvents[c]=(a._pgEvents[c]||0)+1,a._pgListeners++}return Boolean(d)},a.addEventListener=function(b,c,d,e){d&&(a.activateGesture(b,c),b.addEventListener(c,d,e))},a.deactivateGesture=function(a,b){var c=b.toLowerCase(),d=g.dependencyMap[c];return d&&(a._pgListeners>0&&a._pgListeners--,0===a._pgListeners&&g.unregister(a),a._pgEvents&&(a._pgEvents[c]>0?a._pgEvents[c]--:a._pgEvents[c]=0)),Boolean(d)},a.removeEventListener=function(b,c,d,e){d&&(a.deactivateGesture(b,c),b.removeEventListener(c,d,e))}}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d=25,e=[0,1,4,2],f=!1;try{f=1===new MouseEvent("test",{buttons:1}).buttons}catch(g){}var h={POINTER_ID:1,POINTER_TYPE:"mouse",events:["mousedown","mousemove","mouseup"],exposes:["down","up","move"],register:function(a){b.listen(a,this.events)},unregister:function(a){a!==document&&b.unlisten(a,this.events)},lastTouches:[],isEventSimulatedFromTouch:function(a){for(var b,c=this.lastTouches,e=a.clientX,f=a.clientY,g=0,h=c.length;h>g&&(b=c[g]);g++){var i=Math.abs(e-b.x),j=Math.abs(f-b.y);if(d>=i&&d>=j)return!0}},prepareEvent:function(a){var c=b.cloneEvent(a);return c.pointerId=this.POINTER_ID,c.isPrimary=!0,c.pointerType=this.POINTER_TYPE,c._source="mouse",f||(c.buttons=e[c.which]||0),c},mousedown:function(d){if(!this.isEventSimulatedFromTouch(d)){var e=c.has(this.POINTER_ID);e&&this.mouseup(d);var f=this.prepareEvent(d);f.target=a.findTarget(d),c.set(this.POINTER_ID,f.target),b.down(f)}},mousemove:function(a){if(!this.isEventSimulatedFromTouch(a)){var d=c.get(this.POINTER_ID);if(d){var e=this.prepareEvent(a);e.target=d,0===e.buttons?(b.cancel(e),this.cleanupMouse()):b.move(e)}}},mouseup:function(d){if(!this.isEventSimulatedFromTouch(d)){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(this.POINTER_ID),b.up(e),this.cleanupMouse()}},cleanupMouse:function(){c["delete"](this.POINTER_ID)}};a.mouseEvents=h}(window.PolymerGestures),function(a){var b=a.dispatcher,c=(a.targetFinding.allShadows.bind(a.targetFinding),b.pointermap),d=(Array.prototype.map.call.bind(Array.prototype.map),2500),e=200,f=20,g=!1,h={IS_IOS:!1,events:["touchstart","touchmove","touchend","touchcancel"],exposes:["down","up","move"],register:function(a,c){(this.IS_IOS?c:!c)&&b.listen(a,this.events)},unregister:function(a){this.IS_IOS||b.unlisten(a,this.events)},scrollTypes:{EMITTER:"none",XSCROLLER:"pan-x",YSCROLLER:"pan-y"},touchActionToScrollType:function(a){var b=a,c=this.scrollTypes;return b===c.EMITTER?"none":b===c.XSCROLLER?"X":b===c.YSCROLLER?"Y":"XY"},POINTER_TYPE:"touch",firstTouch:null,isPrimaryTouch:function(a){return this.firstTouch===a.identifier},setPrimaryTouch:function(a){(0===c.pointers()||1===c.pointers()&&c.has(1))&&(this.firstTouch=a.identifier,this.firstXY={X:a.clientX,Y:a.clientY},this.scrolling=null,this.cancelResetClickCount())},removePrimaryPointer:function(a){a.isPrimary&&(this.firstTouch=null,this.firstXY=null,this.resetClickCount())},clickCount:0,resetId:null,resetClickCount:function(){var a=function(){this.clickCount=0,this.resetId=null}.bind(this);this.resetId=setTimeout(a,e)},cancelResetClickCount:function(){this.resetId&&clearTimeout(this.resetId)},typeToButtons:function(a){var b=0;return("touchstart"===a||"touchmove"===a)&&(b=1),b},findTarget:function(b,d){if("touchstart"===this.currentTouchEvent.type){if(this.isPrimaryTouch(b)){var e={clientX:b.clientX,clientY:b.clientY,path:this.currentTouchEvent.path,target:this.currentTouchEvent.target};return a.findTarget(e)}return a.findTarget(b)}return c.get(d)},touchToPointer:function(a){var c=this.currentTouchEvent,d=b.cloneEvent(a),e=d.pointerId=a.identifier+2;d.target=this.findTarget(a,e),d.bubbles=!0,d.cancelable=!0,d.detail=this.clickCount,d.buttons=this.typeToButtons(c.type),d.width=a.webkitRadiusX||a.radiusX||0,d.height=a.webkitRadiusY||a.radiusY||0,d.pressure=a.webkitForce||a.force||.5,d.isPrimary=this.isPrimaryTouch(a),d.pointerType=this.POINTER_TYPE,d._source="touch";var f=this;return d.preventDefault=function(){f.scrolling=!1,f.firstXY=null,c.preventDefault()},d},processTouches:function(a,b){var d=a.changedTouches;this.currentTouchEvent=a;for(var e,f,g=0;g<d.length;g++)e=d[g],f=this.touchToPointer(e),"touchstart"===a.type&&c.set(f.pointerId,f.target),c.has(f.pointerId)&&b.call(this,f),("touchend"===a.type||a._cancel)&&this.cleanUpPointer(f)},shouldScroll:function(b){if(this.firstXY){var c,d=a.targetFinding.findTouchAction(b),e=this.touchActionToScrollType(d);if("none"===e)c=!1;else if("XY"===e)c=!0;else{var f=b.changedTouches[0],g=e,h="Y"===e?"X":"Y",i=Math.abs(f["client"+g]-this.firstXY[g]),j=Math.abs(f["client"+h]-this.firstXY[h]);c=i>=j}return c}},findTouch:function(a,b){for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)if(c.identifier===b)return!0},vacuumTouches:function(a){var b=a.touches;if(c.pointers()>=b.length){var d=[];c.forEach(function(a,c){if(1!==c&&!this.findTouch(b,c-2)){var e=a;d.push(e)}},this),d.forEach(function(a){this.cancel(a),c.delete(a.pointerId)})}},touchstart:function(a){this.vacuumTouches(a),this.setPrimaryTouch(a.changedTouches[0]),this.dedupSynthMouse(a),this.scrolling||(this.clickCount++,this.processTouches(a,this.down))},down:function(a){b.down(a)},touchmove:function(a){if(g)a.cancelable&&this.processTouches(a,this.move);else if(this.scrolling){if(this.firstXY){var b=a.changedTouches[0],c=b.clientX-this.firstXY.X,d=b.clientY-this.firstXY.Y,e=Math.sqrt(c*c+d*d);e>=f&&(this.touchcancel(a),this.scrolling=!0,this.firstXY=null)}}else null===this.scrolling&&this.shouldScroll(a)?this.scrolling=!0:(this.scrolling=!1,a.preventDefault(),this.processTouches(a,this.move))},move:function(a){b.move(a)},touchend:function(a){this.dedupSynthMouse(a),this.processTouches(a,this.up)},up:function(c){c.relatedTarget=a.findTarget(c),b.up(c)},cancel:function(a){b.cancel(a)},touchcancel:function(a){a._cancel=!0,this.processTouches(a,this.cancel)},cleanUpPointer:function(a){c["delete"](a.pointerId),this.removePrimaryPointer(a)},dedupSynthMouse:function(b){var c=a.mouseEvents.lastTouches,e=b.changedTouches[0];if(this.isPrimaryTouch(e)){var f={x:e.clientX,y:e.clientY};c.push(f);var g=function(a,b){var c=a.indexOf(b);c>-1&&a.splice(c,1)}.bind(null,c,f);setTimeout(g,d)}}};a.touchEvents=h}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d=window.MSPointerEvent&&"number"==typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE,e={events:["MSPointerDown","MSPointerMove","MSPointerUp","MSPointerCancel"],register:function(a){b.listen(a,this.events)},unregister:function(a){a!==document&&b.unlisten(a,this.events)},POINTER_TYPES:["","unavailable","touch","pen","mouse"],prepareEvent:function(a){var c=a;return c=b.cloneEvent(a),d&&(c.pointerType=this.POINTER_TYPES[a.pointerType]),c._source="ms",c},cleanup:function(a){c["delete"](a)},MSPointerDown:function(d){var e=this.prepareEvent(d);e.target=a.findTarget(d),c.set(d.pointerId,e.target),b.down(e)},MSPointerMove:function(a){var d=c.get(a.pointerId);if(d){var e=this.prepareEvent(a);e.target=d,b.move(e)}},MSPointerUp:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.up(e),this.cleanup(d.pointerId)},MSPointerCancel:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.cancel(e),this.cleanup(d.pointerId)}};a.msEvents=e}(window.PolymerGestures),function(a){var b=a.dispatcher,c=b.pointermap,d={events:["pointerdown","pointermove","pointerup","pointercancel"],prepareEvent:function(a){var c=b.cloneEvent(a);return c._source="pointer",c},register:function(a){b.listen(a,this.events)},unregister:function(a){a!==document&&b.unlisten(a,this.events)},cleanup:function(a){c["delete"](a)},pointerdown:function(d){var e=this.prepareEvent(d);e.target=a.findTarget(d),c.set(e.pointerId,e.target),b.down(e)},pointermove:function(a){var d=c.get(a.pointerId);if(d){var e=this.prepareEvent(a);e.target=d,b.move(e)}},pointerup:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.up(e),this.cleanup(d.pointerId)},pointercancel:function(d){var e=this.prepareEvent(d);e.relatedTarget=a.findTarget(d),e.target=c.get(e.pointerId),b.cancel(e),this.cleanup(d.pointerId)}};a.pointerEvents=d}(window.PolymerGestures),function(a){var b=a.dispatcher,c=window.navigator;window.PointerEvent?b.registerSource("pointer",a.pointerEvents):c.msPointerEnabled?b.registerSource("ms",a.msEvents):(b.registerSource("mouse",a.mouseEvents),void 0!==window.ontouchstart&&b.registerSource("touch",a.touchEvents));var d=navigator.userAgent,e=d.match(/iPad|iPhone|iPod/)&&"ontouchstart"in window;b.IS_IOS=e,a.touchEvents.IS_IOS=e,b.register(document,!0)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e={events:["down","move","up"],exposes:["trackstart","track","trackx","tracky","trackend"],defaultActions:{track:"none",trackx:"pan-y",tracky:"pan-x"},WIGGLE_THRESHOLD:4,clampDir:function(a){return a>0?1:-1},calcPositionDelta:function(a,b){var c=0,d=0;return a&&b&&(c=b.pageX-a.pageX,d=b.pageY-a.pageY),{x:c,y:d}},fireTrack:function(a,b,d){var e=d,f=this.calcPositionDelta(e.downEvent,b),g=this.calcPositionDelta(e.lastMoveEvent,b);if(g.x)e.xDirection=this.clampDir(g.x);else if("trackx"===a)return;if(g.y)e.yDirection=this.clampDir(g.y);else if("tracky"===a)return;var h={bubbles:!0,cancelable:!0,trackInfo:e.trackInfo,relatedTarget:b.relatedTarget,pointerType:b.pointerType,pointerId:b.pointerId,_source:"track"};"tracky"!==a&&(h.x=b.x,h.dx=f.x,h.ddx=g.x,h.clientX=b.clientX,h.pageX=b.pageX,h.screenX=b.screenX,h.xDirection=e.xDirection),"trackx"!==a&&(h.dy=f.y,h.ddy=g.y,h.y=b.y,h.clientY=b.clientY,h.pageY=b.pageY,h.screenY=b.screenY,h.yDirection=e.yDirection);var i=c.makeGestureEvent(a,h);e.downTarget.dispatchEvent(i)},down:function(a){if(a.isPrimary&&("mouse"===a.pointerType?1===a.buttons:!0)){var b={downEvent:a,downTarget:a.target,trackInfo:{},lastMoveEvent:null,xDirection:0,yDirection:0,tracking:!1};d.set(a.pointerId,b)}},move:function(a){var b=d.get(a.pointerId);if(b){if(!b.tracking){var c=this.calcPositionDelta(b.downEvent,a),e=c.x*c.x+c.y*c.y;e>this.WIGGLE_THRESHOLD&&(b.tracking=!0,b.lastMoveEvent=b.downEvent,this.fireTrack("trackstart",a,b))}b.tracking&&(this.fireTrack("track",a,b),this.fireTrack("trackx",a,b),this.fireTrack("tracky",a,b)),b.lastMoveEvent=a}},up:function(a){var b=d.get(a.pointerId);b&&(b.tracking&&this.fireTrack("trackend",a,b),d.delete(a.pointerId))}};b.registerGesture("track",e)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d={HOLD_DELAY:200,WIGGLE_THRESHOLD:16,events:["down","move","up"],exposes:["hold","holdpulse","release"],heldPointer:null,holdJob:null,pulse:function(){var a=Date.now()-this.heldPointer.timeStamp,b=this.held?"holdpulse":"hold";this.fireHold(b,a),this.held=!0},cancel:function(){clearInterval(this.holdJob),this.held&&this.fireHold("release"),this.held=!1,this.heldPointer=null,this.target=null,this.holdJob=null},down:function(a){a.isPrimary&&!this.heldPointer&&(this.heldPointer=a,this.target=a.target,this.holdJob=setInterval(this.pulse.bind(this),this.HOLD_DELAY))},up:function(a){this.heldPointer&&this.heldPointer.pointerId===a.pointerId&&this.cancel()},move:function(a){if(this.heldPointer&&this.heldPointer.pointerId===a.pointerId){var b=a.clientX-this.heldPointer.clientX,c=a.clientY-this.heldPointer.clientY;b*b+c*c>this.WIGGLE_THRESHOLD&&this.cancel()}},fireHold:function(a,b){var d={bubbles:!0,cancelable:!0,pointerType:this.heldPointer.pointerType,pointerId:this.heldPointer.pointerId,x:this.heldPointer.clientX,y:this.heldPointer.clientY,_source:"hold"};b&&(d.holdTime=b);var e=c.makeGestureEvent(a,d);this.target.dispatchEvent(e)}};b.registerGesture("hold",d)}(window.PolymerGestures),function(a){var b=a.dispatcher,c=a.eventFactory,d=new a.PointerMap,e={events:["down","up"],exposes:["tap"],down:function(a){a.isPrimary&&!a.tapPrevented&&d.set(a.pointerId,{target:a.target,buttons:a.buttons,x:a.clientX,y:a.clientY})},shouldTap:function(a,b){return"mouse"===a.pointerType?1===b.buttons:!a.tapPrevented},up:function(b){var e=d.get(b.pointerId);if(e&&this.shouldTap(b,e)){var f=a.targetFinding.LCA(e.target,b.relatedTarget);if(f){var g=c.makeGestureEvent("tap",{bubbles:!0,cancelable:!0,x:b.clientX,y:b.clientY,detail:b.detail,pointerType:b.pointerType,pointerId:b.pointerId,altKey:b.altKey,ctrlKey:b.ctrlKey,metaKey:b.metaKey,shiftKey:b.shiftKey,_source:"tap"});f.dispatchEvent(g)}}d.delete(b.pointerId)}};c.preventTap=function(a){return function(){a.tapPrevented=!0,d.delete(a.pointerId)}},b.registerGesture("tap",e)}(window.PolymerGestures),function(a){"use strict";function b(a,b){if(!a)throw new Error("ASSERT: "+b)}function c(a){return a>=48&&57>=a}function d(a){return 32===a||9===a||11===a||12===a||160===a||a>=5760&&"\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\ufeff".indexOf(String.fromCharCode(a))>0}function e(a){return 10===a||13===a||8232===a||8233===a}function f(a){return 36===a||95===a||a>=65&&90>=a||a>=97&&122>=a}function g(a){return 36===a||95===a||a>=65&&90>=a||a>=97&&122>=a||a>=48&&57>=a}function h(a){return"this"===a}function i(){for(;Y>X&&d(W.charCodeAt(X));)++X}function j(){var a,b;for(a=X++;Y>X&&(b=W.charCodeAt(X),g(b));)++X;return W.slice(a,X)}function k(){var a,b,c;return a=X,b=j(),c=1===b.length?S.Identifier:h(b)?S.Keyword:"null"===b?S.NullLiteral:"true"===b||"false"===b?S.BooleanLiteral:S.Identifier,{type:c,value:b,range:[a,X]}}function l(){var a,b,c=X,d=W.charCodeAt(X),e=W[X];switch(d){case 46:case 40:case 41:case 59:case 44:case 123:case 125:case 91:case 93:case 58:case 63:return++X,{type:S.Punctuator,value:String.fromCharCode(d),range:[c,X]};default:if(a=W.charCodeAt(X+1),61===a)switch(d){case 37:case 38:case 42:case 43:case 45:case 47:case 60:case 62:case 124:return X+=2,{type:S.Punctuator,value:String.fromCharCode(d)+String.fromCharCode(a),range:[c,X]};case 33:case 61:return X+=2,61===W.charCodeAt(X)&&++X,{type:S.Punctuator,value:W.slice(c,X),range:[c,X]}}}return b=W[X+1],e===b&&"&|".indexOf(e)>=0?(X+=2,{type:S.Punctuator,value:e+b,range:[c,X]}):"<>=!+-*%&|^/".indexOf(e)>=0?(++X,{type:S.Punctuator,value:e,range:[c,X]}):void s({},V.UnexpectedToken,"ILLEGAL")}function m(){var a,d,e;if(e=W[X],b(c(e.charCodeAt(0))||"."===e,"Numeric literal must start with a decimal digit or a decimal point"),d=X,a="","."!==e){for(a=W[X++],e=W[X],"0"===a&&e&&c(e.charCodeAt(0))&&s({},V.UnexpectedToken,"ILLEGAL");c(W.charCodeAt(X));)a+=W[X++];e=W[X]}if("."===e){for(a+=W[X++];c(W.charCodeAt(X));)a+=W[X++];e=W[X]}if("e"===e||"E"===e)if(a+=W[X++],e=W[X],("+"===e||"-"===e)&&(a+=W[X++]),c(W.charCodeAt(X)))for(;c(W.charCodeAt(X));)a+=W[X++];else s({},V.UnexpectedToken,"ILLEGAL");return f(W.charCodeAt(X))&&s({},V.UnexpectedToken,"ILLEGAL"),{type:S.NumericLiteral,value:parseFloat(a),range:[d,X]}}function n(){var a,c,d,f="",g=!1;for(a=W[X],b("'"===a||'"'===a,"String literal must starts with a quote"),c=X,++X;Y>X;){if(d=W[X++],d===a){a="";break}if("\\"===d)if(d=W[X++],d&&e(d.charCodeAt(0)))"\r"===d&&"\n"===W[X]&&++X;else switch(d){case"n":f+="\n";break;case"r":f+="\r";break;case"t":f+="	";break;case"b":f+="\b";break;case"f":f+="\f";break;case"v":f+="";break;default:f+=d}else{if(e(d.charCodeAt(0)))break;f+=d}}return""!==a&&s({},V.UnexpectedToken,"ILLEGAL"),{type:S.StringLiteral,value:f,octal:g,range:[c,X]}}function o(a){return a.type===S.Identifier||a.type===S.Keyword||a.type===S.BooleanLiteral||a.type===S.NullLiteral}function p(){var a;return i(),X>=Y?{type:S.EOF,range:[X,X]}:(a=W.charCodeAt(X),40===a||41===a||58===a?l():39===a||34===a?n():f(a)?k():46===a?c(W.charCodeAt(X+1))?m():l():c(a)?m():l())}function q(){var a;return a=$,X=a.range[1],$=p(),X=a.range[1],a}function r(){var a;a=X,$=p(),X=a}function s(a,c){var d,e=Array.prototype.slice.call(arguments,2),f=c.replace(/%(\d)/g,function(a,c){return b(c<e.length,"Message reference must be in range"),e[c]});throw d=new Error(f),d.index=X,d.description=f,d}function t(a){s(a,V.UnexpectedToken,a.value)}function u(a){var b=q();(b.type!==S.Punctuator||b.value!==a)&&t(b)}function v(a){return $.type===S.Punctuator&&$.value===a}function w(a){return $.type===S.Keyword&&$.value===a}function x(){var a=[];for(u("[");!v("]");)v(",")?(q(),a.push(null)):(a.push(bb()),v("]")||u(","));return u("]"),Z.createArrayExpression(a)}function y(){var a;return i(),a=q(),a.type===S.StringLiteral||a.type===S.NumericLiteral?Z.createLiteral(a):Z.createIdentifier(a.value)}function z(){var a,b;return a=$,i(),(a.type===S.EOF||a.type===S.Punctuator)&&t(a),b=y(),u(":"),Z.createProperty("init",b,bb())}function A(){var a=[];for(u("{");!v("}");)a.push(z()),v("}")||u(",");return u("}"),Z.createObjectExpression(a)}function B(){var a;return u("("),a=bb(),u(")"),a}function C(){var a,b,c;return v("(")?B():(a=$.type,a===S.Identifier?c=Z.createIdentifier(q().value):a===S.StringLiteral||a===S.NumericLiteral?c=Z.createLiteral(q()):a===S.Keyword?w("this")&&(q(),c=Z.createThisExpression()):a===S.BooleanLiteral?(b=q(),b.value="true"===b.value,c=Z.createLiteral(b)):a===S.NullLiteral?(b=q(),b.value=null,c=Z.createLiteral(b)):v("[")?c=x():v("{")&&(c=A()),c?c:void t(q()))}function D(){var a=[];if(u("("),!v(")"))for(;Y>X&&(a.push(bb()),!v(")"));)u(",");return u(")"),a}function E(){var a;return a=q(),o(a)||t(a),Z.createIdentifier(a.value)}function F(){return u("."),E()}function G(){var a;return u("["),a=bb(),u("]"),a}function H(){var a,b,c;for(a=C();;)if(v("["))c=G(),a=Z.createMemberExpression("[",a,c);else if(v("."))c=F(),a=Z.createMemberExpression(".",a,c);else{if(!v("("))break;b=D(),a=Z.createCallExpression(a,b)}return a}function I(){var a,b;return $.type!==S.Punctuator&&$.type!==S.Keyword?b=ab():v("+")||v("-")||v("!")?(a=q(),b=I(),b=Z.createUnaryExpression(a.value,b)):w("delete")||w("void")||w("typeof")?s({},V.UnexpectedToken):b=ab(),b}function J(a){var b=0;if(a.type!==S.Punctuator&&a.type!==S.Keyword)return 0;switch(a.value){case"||":b=1;break;case"&&":b=2;break;case"==":case"!=":case"===":case"!==":b=6;break;case"<":case">":case"<=":case">=":case"instanceof":b=7;break;case"in":b=7;break;case"+":case"-":b=9;break;case"*":case"/":case"%":b=11}return b}function K(){var a,b,c,d,e,f,g,h;if(g=I(),b=$,c=J(b),0===c)return g;for(b.prec=c,q(),e=I(),d=[g,b,e];(c=J($))>0;){for(;d.length>2&&c<=d[d.length-2].prec;)e=d.pop(),f=d.pop().value,g=d.pop(),a=Z.createBinaryExpression(f,g,e),d.push(a);b=q(),b.prec=c,d.push(b),a=I(),d.push(a)}for(h=d.length-1,a=d[h];h>1;)a=Z.createBinaryExpression(d[h-1].value,d[h-2],a),h-=2;return a}function L(){var a,b,c;return a=K(),v("?")&&(q(),b=L(),u(":"),c=L(),a=Z.createConditionalExpression(a,b,c)),a}function M(){var a,b;return a=q(),a.type!==S.Identifier&&t(a),b=v("(")?D():[],Z.createFilter(a.value,b)}function N(){for(;v("|");)q(),M()}function O(){i(),r();var a=bb();a&&(","===$.value||"in"==$.value&&a.type===U.Identifier?Q(a):(N(),"as"===$.value?P(a):Z.createTopLevel(a))),$.type!==S.EOF&&t($)}function P(a){q();var b=q().value;Z.createAsExpression(a,b)}function Q(a){var b;","===$.value&&(q(),$.type!==S.Identifier&&t($),b=q().value),q();var c=bb();N(),Z.createInExpression(a.name,b,c)}function R(a,b){return Z=b,W=a,X=0,Y=W.length,$=null,_={labelSet:{}},O()}var S,T,U,V,W,X,Y,Z,$,_;S={BooleanLiteral:1,EOF:2,Identifier:3,Keyword:4,NullLiteral:5,NumericLiteral:6,Punctuator:7,StringLiteral:8},T={},T[S.BooleanLiteral]="Boolean",T[S.EOF]="<end>",T[S.Identifier]="Identifier",T[S.Keyword]="Keyword",T[S.NullLiteral]="Null",T[S.NumericLiteral]="Numeric",T[S.Punctuator]="Punctuator",T[S.StringLiteral]="String",U={ArrayExpression:"ArrayExpression",BinaryExpression:"BinaryExpression",CallExpression:"CallExpression",ConditionalExpression:"ConditionalExpression",EmptyStatement:"EmptyStatement",ExpressionStatement:"ExpressionStatement",Identifier:"Identifier",Literal:"Literal",LabeledStatement:"LabeledStatement",LogicalExpression:"LogicalExpression",MemberExpression:"MemberExpression",ObjectExpression:"ObjectExpression",Program:"Program",Property:"Property",ThisExpression:"ThisExpression",UnaryExpression:"UnaryExpression"},V={UnexpectedToken:"Unexpected token %0",UnknownLabel:"Undefined label '%0'",Redeclaration:"%0 '%1' has already been declared"};var ab=H,bb=L;a.esprima={parse:R}}(this),function(a){"use strict";function b(a,b,d,e){var f;try{if(f=c(a),f.scopeIdent&&(d.nodeType!==Node.ELEMENT_NODE||"TEMPLATE"!==d.tagName||"bind"!==b&&"repeat"!==b))throw Error("as and in can only be used within <template bind/repeat>")}catch(g){return void console.error("Invalid expression syntax: "+a,g)}return function(a,b,c){var d=f.getBinding(a,e,c);return f.scopeIdent&&d&&(b.polymerExpressionScopeIdent_=f.scopeIdent,f.indexIdent&&(b.polymerExpressionIndexIdent_=f.indexIdent)),d}}function c(a){var b=q[a];if(!b){var c=new j;esprima.parse(a,c),b=new l(c),q[a]=b}return b}function d(a){this.value=a,this.valueFn_=void 0}function e(a){this.name=a,this.path=Path.get(a)}function f(a,b,c){this.computed="["==c,this.dynamicDeps="function"==typeof a||a.dynamicDeps||this.computed&&!(b instanceof d),this.simplePath=!this.dynamicDeps&&(b instanceof e||b instanceof d)&&(a instanceof f||a instanceof e),this.object=this.simplePath?a:i(a),this.property=!this.computed||this.simplePath?b:i(b)}function g(a,b){this.name=a,this.args=[];for(var c=0;c<b.length;c++)this.args[c]=i(b[c])}function h(){throw Error("Not Implemented")}function i(a){return"function"==typeof a?a:a.valueFn()}function j(){this.expression=null,this.filters=[],this.deps={},this.currentPath=void 0,this.scopeIdent=void 0,this.indexIdent=void 0,this.dynamicDeps=!1}function k(a){this.value_=a}function l(a){if(this.scopeIdent=a.scopeIdent,this.indexIdent=a.indexIdent,!a.expression)throw Error("No expression found.");this.expression=a.expression,i(this.expression),this.filters=a.filters,this.dynamicDeps=a.dynamicDeps}function m(a){return String(a).replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()})}function n(a,b){for(;a[t]&&!Object.prototype.hasOwnProperty.call(a,b);)a=a[t];return a}function o(a){switch(a){case"":return!1;case"false":case"null":case"true":return!0}return isNaN(Number(a))?!1:!0}function p(){}var q=Object.create(null);d.prototype={valueFn:function(){if(!this.valueFn_){var a=this.value;this.valueFn_=function(){return a}}return this.valueFn_}},e.prototype={valueFn:function(){if(!this.valueFn_){var a=(this.name,this.path);this.valueFn_=function(b,c){return c&&c.addPath(b,a),a.getValueFrom(b)}}return this.valueFn_},setValue:function(a,b){return 1==this.path.length,a=n(a,this.path[0]),this.path.setValueFrom(a,b)}},f.prototype={get fullPath(){if(!this.fullPath_){var a=this.object instanceof f?this.object.fullPath.slice():[this.object.name];
a.push(this.property instanceof e?this.property.name:this.property.value),this.fullPath_=Path.get(a)}return this.fullPath_},valueFn:function(){if(!this.valueFn_){var a=this.object;if(this.simplePath){var b=this.fullPath;this.valueFn_=function(a,c){return c&&c.addPath(a,b),b.getValueFrom(a)}}else if(this.computed){var c=this.property;this.valueFn_=function(b,d,e){var f=a(b,d,e),g=c(b,d,e);return d&&d.addPath(f,[g]),f?f[g]:void 0}}else{var b=Path.get(this.property.name);this.valueFn_=function(c,d,e){var f=a(c,d,e);return d&&d.addPath(f,b),b.getValueFrom(f)}}}return this.valueFn_},setValue:function(a,b){if(this.simplePath)return this.fullPath.setValueFrom(a,b),b;var c=this.object(a),d=this.property instanceof e?this.property.name:this.property(a);return c[d]=b}},g.prototype={transform:function(a,b,c,d,e){var f=c[this.name],g=a;if(f)g=void 0;else if(f=g[this.name],!f)return void console.error("Cannot find function or filter: "+this.name);if(d?f=f.toModel:"function"==typeof f.toDOM&&(f=f.toDOM),"function"!=typeof f)return void console.error("Cannot find function or filter: "+this.name);for(var h=e||[],j=0;j<this.args.length;j++)h.push(i(this.args[j])(a,b,c));return f.apply(g,h)}};var r={"+":function(a){return+a},"-":function(a){return-a},"!":function(a){return!a}},s={"+":function(a,b){return a+b},"-":function(a,b){return a-b},"*":function(a,b){return a*b},"/":function(a,b){return a/b},"%":function(a,b){return a%b},"<":function(a,b){return b>a},">":function(a,b){return a>b},"<=":function(a,b){return b>=a},">=":function(a,b){return a>=b},"==":function(a,b){return a==b},"!=":function(a,b){return a!=b},"===":function(a,b){return a===b},"!==":function(a,b){return a!==b},"&&":function(a,b){return a&&b},"||":function(a,b){return a||b}};j.prototype={createUnaryExpression:function(a,b){if(!r[a])throw Error("Disallowed operator: "+a);return b=i(b),function(c,d,e){return r[a](b(c,d,e))}},createBinaryExpression:function(a,b,c){if(!s[a])throw Error("Disallowed operator: "+a);switch(b=i(b),c=i(c),a){case"||":return this.dynamicDeps=!0,function(a,d,e){return b(a,d,e)||c(a,d,e)};case"&&":return this.dynamicDeps=!0,function(a,d,e){return b(a,d,e)&&c(a,d,e)}}return function(d,e,f){return s[a](b(d,e,f),c(d,e,f))}},createConditionalExpression:function(a,b,c){return a=i(a),b=i(b),c=i(c),this.dynamicDeps=!0,function(d,e,f){return a(d,e,f)?b(d,e,f):c(d,e,f)}},createIdentifier:function(a){var b=new e(a);return b.type="Identifier",b},createMemberExpression:function(a,b,c){var d=new f(b,c,a);return d.dynamicDeps&&(this.dynamicDeps=!0),d},createCallExpression:function(a,b){if(!(a instanceof e))throw Error("Only identifier function invocations are allowed");var c=new g(a.name,b);return function(a,b,d){return c.transform(a,b,d,!1)}},createLiteral:function(a){return new d(a.value)},createArrayExpression:function(a){for(var b=0;b<a.length;b++)a[b]=i(a[b]);return function(b,c,d){for(var e=[],f=0;f<a.length;f++)e.push(a[f](b,c,d));return e}},createProperty:function(a,b,c){return{key:b instanceof e?b.name:b.value,value:c}},createObjectExpression:function(a){for(var b=0;b<a.length;b++)a[b].value=i(a[b].value);return function(b,c,d){for(var e={},f=0;f<a.length;f++)e[a[f].key]=a[f].value(b,c,d);return e}},createFilter:function(a,b){this.filters.push(new g(a,b))},createAsExpression:function(a,b){this.expression=a,this.scopeIdent=b},createInExpression:function(a,b,c){this.expression=c,this.scopeIdent=a,this.indexIdent=b},createTopLevel:function(a){this.expression=a},createThisExpression:h},k.prototype={open:function(){return this.value_},discardChanges:function(){return this.value_},deliver:function(){},close:function(){}},l.prototype={getBinding:function(a,b,c){function d(){if(h)return h=!1,g;i.dynamicDeps&&f.startReset();var c=i.getValue(a,i.dynamicDeps?f:void 0,b);return i.dynamicDeps&&f.finishReset(),c}function e(c){return i.setValue(a,c,b),c}if(c)return this.getValue(a,void 0,b);var f=new CompoundObserver,g=this.getValue(a,f,b),h=!0,i=this;return new ObserverTransform(f,d,e,!0)},getValue:function(a,b,c){for(var d=i(this.expression)(a,b,c),e=0;e<this.filters.length;e++)d=this.filters[e].transform(a,b,c,!1,[d]);return d},setValue:function(a,b,c){for(var d=this.filters?this.filters.length:0;d-->0;)b=this.filters[d].transform(a,void 0,c,!0,[b]);return this.expression.setValue?this.expression.setValue(a,b):void 0}};var t="@"+Math.random().toString(36).slice(2);p.prototype={styleObject:function(a){var b=[];for(var c in a)b.push(m(c)+": "+a[c]);return b.join("; ")},tokenList:function(a){var b=[];for(var c in a)a[c]&&b.push(c);return b.join(" ")},prepareInstancePositionChanged:function(a){var b=a.polymerExpressionIndexIdent_;if(b)return function(a,c){a.model[b]=c}},prepareBinding:function(a,c,d){var e=Path.get(a);{if(o(a)||!e.valid)return b(a,c,d,this);if(1==e.length)return function(a,b,c){if(c)return e.getValueFrom(a);var d=n(a,e[0]);return new PathObserver(d,e)}}},prepareInstanceModel:function(a){var b=a.polymerExpressionScopeIdent_;if(b){var c=a.templateInstance?a.templateInstance.model:a.model,d=a.polymerExpressionIndexIdent_;return function(a){return u(c,a,b,d)}}}};var u="__proto__"in{}?function(a,b,c,d){var e={};return e[c]=b,e[d]=void 0,e[t]=a,e.__proto__=a,e}:function(a,b,c,d){var e=Object.create(a);return Object.defineProperty(e,c,{value:b,configurable:!0,writable:!0}),Object.defineProperty(e,d,{value:void 0,configurable:!0,writable:!0}),Object.defineProperty(e,t,{value:a,configurable:!0,writable:!0}),e};a.PolymerExpressions=p,p.getExpression=c}(this),Polymer={version:"0.4.2"},"function"==typeof window.Polymer&&(Polymer={}),window.Platform||(logFlags=window.logFlags||{},Platform={flush:function(){}},CustomElements={useNative:!0,ready:!0,takeRecords:function(){},"instanceof":function(a,b){return a instanceof b}},HTMLImports={useNative:!0},addEventListener("HTMLImportsLoaded",function(){document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}))}),ShadowDOMPolyfill=null,wrap=unwrap=function(a){return a}),function(a){function b(a,b){b=b||q,d(function(){f(a,b)},b)}function c(a){return"complete"===a.readyState||a.readyState===s}function d(a,b){if(c(b))a&&a();else{var e=function(){("complete"===b.readyState||b.readyState===s)&&(b.removeEventListener(t,e),d(a,b))};b.addEventListener(t,e)}}function e(a){a.target.__loaded=!0}function f(a,b){function c(){h==i&&a&&a()}function d(a){e(a),h++,c()}var f=b.querySelectorAll("link[rel=import]"),h=0,i=f.length;if(i)for(var j,k=0;i>k&&(j=f[k]);k++)g(j)?d.call(j,{target:j}):(j.addEventListener("load",d),j.addEventListener("error",d));else c()}function g(a){return m?a.__loaded||a.import&&"loading"!==a.import.readyState:a.__importParsed}function h(a){for(var b,c=0,d=a.length;d>c&&(b=a[c]);c++)i(b)&&j(b)}function i(a){return"link"===a.localName&&"import"===a.rel}function j(a){var b=a.import;b?e({target:a}):(a.addEventListener("load",e),a.addEventListener("error",e))}var k="import",l=k in document.createElement("link"),m=l,n=/Trident/.test(navigator.userAgent),o=Boolean(window.ShadowDOMPolyfill),p=function(a){return o?ShadowDOMPolyfill.wrapIfNeeded(a):a},q=p(document),r={get:function(){var a=HTMLImports.currentScript||document.currentScript||("complete"!==document.readyState?document.scripts[document.scripts.length-1]:null);return p(a)},configurable:!0};Object.defineProperty(document,"_currentScript",r),Object.defineProperty(q,"_currentScript",r);var s=n?"complete":"interactive",t="readystatechange";m&&(new MutationObserver(function(a){for(var b,c=0,d=a.length;d>c&&(b=a[c]);c++)b.addedNodes&&h(b.addedNodes)}).observe(document.head,{childList:!0}),function(){if("loading"===document.readyState)for(var a,b=document.querySelectorAll("link[rel=import]"),c=0,d=b.length;d>c&&(a=b[c]);c++)j(a)}()),b(function(){HTMLImports.ready=!0,HTMLImports.readyTime=(new Date).getTime(),q.dispatchEvent(new CustomEvent("HTMLImportsLoaded",{bubbles:!0}))}),a.useNative=m,a.isImportLoaded=g,a.whenReady=b,a.rootDocument=q,a.IMPORT_LINK_TYPE=k,a.isIE=n}(window.HTMLImports),function(a){function b(a,b){return b=b||[],b.map||(b=[b]),a.apply(this,b.map(d))}function c(a,c,d){var e;switch(arguments.length){case 0:return;case 1:e=null;break;case 2:e=c.apply(this);break;default:e=b(d,c)}f[a]=e}function d(a){return f[a]}function e(a,c){HTMLImports.whenImportsReady(function(){b(c,a)})}var f={};a.marshal=d,a.modularize=c,a.using=e}(window),function(){var a=document.createElement("style");a.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; } \n";var b=document.querySelector("head");b.insertBefore(a,b.firstChild)}(Platform),function(a){"use strict";function b(){function a(a){b=a}if("function"!=typeof Object.observe||"function"!=typeof Array.observe)return!1;var b=[],c={},d=[];return Object.observe(c,a),Array.observe(d,a),c.id=1,c.id=2,delete c.id,d.push(1,2),d.length=0,Object.deliverChangeRecords(a),5!==b.length?!1:"add"!=b[0].type||"update"!=b[1].type||"delete"!=b[2].type||"splice"!=b[3].type||"splice"!=b[4].type?!1:(Object.unobserve(c,a),Array.unobserve(d,a),!0)}function c(){if("undefined"!=typeof chrome&&chrome.app&&chrome.app.runtime)return!1;if("undefined"!=typeof navigator&&navigator.getDeviceStorage)return!1;try{var a=new Function("","return true;");return a()}catch(b){return!1}}function d(a){return+a===a>>>0&&""!==a}function e(a){return+a}function f(a){return a===Object(a)}function g(a,b){return a===b?0!==a||1/a===1/b:R(a)&&R(b)?!0:a!==a&&b!==b}function h(a){if(void 0===a)return"eof";var b=a.charCodeAt(0);switch(b){case 91:case 93:case 46:case 34:case 39:case 48:return a;case 95:case 36:return"ident";case 32:case 9:case 10:case 13:case 160:case 65279:case 8232:case 8233:return"ws"}return b>=97&&122>=b||b>=65&&90>=b?"ident":b>=49&&57>=b?"number":"else"}function i(){}function j(a){function b(){if(!(m>=a.length)){var b=a[m+1];return"inSingleQuote"==n&&"'"==b||"inDoubleQuote"==n&&'"'==b?(m++,d=b,o.append(),!0):void 0}}for(var c,d,e,f,g,j,k,l=[],m=-1,n="beforePath",o={push:function(){void 0!==e&&(l.push(e),e=void 0)},append:function(){void 0===e?e=d:e+=d}};n;)if(m++,c=a[m],"\\"!=c||!b(n)){if(f=h(c),k=W[n],g=k[f]||k["else"]||"error","error"==g)return;if(n=g[0],j=o[g[1]]||i,d=void 0===g[2]?c:g[2],j(),"afterPath"===n)return l}}function k(a){return V.test(a)}function l(a,b){if(b!==X)throw Error("Use Path.get to retrieve path objects");for(var c=0;c<a.length;c++)this.push(String(a[c]));Q&&this.length&&(this.getValueFrom=this.compiledGetValueFromFn())}function m(a){if(a instanceof l)return a;if((null==a||0==a.length)&&(a=""),"string"!=typeof a){if(d(a.length))return new l(a,X);a=String(a)}var b=Y[a];if(b)return b;var c=j(a);if(!c)return Z;var b=new l(c,X);return Y[a]=b,b}function n(a){return d(a)?"["+a+"]":'["'+a.replace(/"/g,'\\"')+'"]'}function o(b){for(var c=0;_>c&&b.check_();)c++;return O&&(a.dirtyCheckCycleCount=c),c>0}function p(a){for(var b in a)return!1;return!0}function q(a){return p(a.added)&&p(a.removed)&&p(a.changed)}function r(a,b){var c={},d={},e={};for(var f in b){var g=a[f];(void 0===g||g!==b[f])&&(f in a?g!==b[f]&&(e[f]=g):d[f]=void 0)}for(var f in a)f in b||(c[f]=a[f]);return Array.isArray(a)&&a.length!==b.length&&(e.length=a.length),{added:c,removed:d,changed:e}}function s(){if(!ab.length)return!1;for(var a=0;a<ab.length;a++)ab[a]();return ab.length=0,!0}function t(){function a(a){b&&b.state_===fb&&!d&&b.check_(a)}var b,c,d=!1,e=!0;return{open:function(c){if(b)throw Error("ObservedObject in use");e||Object.deliverChangeRecords(a),b=c,e=!1},observe:function(b,d){c=b,d?Array.observe(c,a):Object.observe(c,a)},deliver:function(b){d=b,Object.deliverChangeRecords(a),d=!1},close:function(){b=void 0,Object.unobserve(c,a),cb.push(this)}}}function u(a,b,c){var d=cb.pop()||t();return d.open(a),d.observe(b,c),d}function v(){function a(b,f){b&&(b===d&&(e[f]=!0),h.indexOf(b)<0&&(h.push(b),Object.observe(b,c)),a(Object.getPrototypeOf(b),f))}function b(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.object!==d||e[c.name]||"setPrototype"===c.type)return!1}return!0}function c(c){if(!b(c)){for(var d,e=0;e<g.length;e++)d=g[e],d.state_==fb&&d.iterateObjects_(a);for(var e=0;e<g.length;e++)d=g[e],d.state_==fb&&d.check_()}}var d,e,f=0,g=[],h=[],i={object:void 0,objects:h,open:function(b,c){d||(d=c,e={}),g.push(b),f++,b.iterateObjects_(a)},close:function(){if(f--,!(f>0)){for(var a=0;a<h.length;a++)Object.unobserve(h[a],c),x.unobservedCount++;g.length=0,h.length=0,d=void 0,e=void 0,db.push(this)}}};return i}function w(a,b){return $&&$.object===b||($=db.pop()||v(),$.object=b),$.open(a,b),$}function x(){this.state_=eb,this.callback_=void 0,this.target_=void 0,this.directObserver_=void 0,this.value_=void 0,this.id_=ib++}function y(a){x._allObserversCount++,kb&&jb.push(a)}function z(){x._allObserversCount--}function A(a){x.call(this),this.value_=a,this.oldObject_=void 0}function B(a){if(!Array.isArray(a))throw Error("Provided object is not an Array");A.call(this,a)}function C(a,b){x.call(this),this.object_=a,this.path_=m(b),this.directObserver_=void 0}function D(a){x.call(this),this.reportChangesOnOpen_=a,this.value_=[],this.directObserver_=void 0,this.observed_=[]}function E(a){return a}function F(a,b,c,d){this.callback_=void 0,this.target_=void 0,this.value_=void 0,this.observable_=a,this.getValueFn_=b||E,this.setValueFn_=c||E,this.dontPassThroughSet_=d}function G(a,b,c){for(var d={},e={},f=0;f<b.length;f++){var g=b[f];nb[g.type]?(g.name in c||(c[g.name]=g.oldValue),"update"!=g.type&&("add"!=g.type?g.name in d?(delete d[g.name],delete c[g.name]):e[g.name]=!0:g.name in e?delete e[g.name]:d[g.name]=!0)):(console.error("Unknown changeRecord type: "+g.type),console.error(g))}for(var h in d)d[h]=a[h];for(var h in e)e[h]=void 0;var i={};for(var h in c)if(!(h in d||h in e)){var j=a[h];c[h]!==j&&(i[h]=j)}return{added:d,removed:e,changed:i}}function H(a,b,c){return{index:a,removed:b,addedCount:c}}function I(){}function J(a,b,c,d,e,f){return sb.calcSplices(a,b,c,d,e,f)}function K(a,b,c,d){return c>b||a>d?-1:b==c||d==a?0:c>a?d>b?b-c:d-c:b>d?d-a:b-a}function L(a,b,c,d){for(var e=H(b,c,d),f=!1,g=0,h=0;h<a.length;h++){var i=a[h];if(i.index+=g,!f){var j=K(e.index,e.index+e.removed.length,i.index,i.index+i.addedCount);if(j>=0){a.splice(h,1),h--,g-=i.addedCount-i.removed.length,e.addedCount+=i.addedCount-j;var k=e.removed.length+i.removed.length-j;if(e.addedCount||k){var c=i.removed;if(e.index<i.index){var l=e.removed.slice(0,i.index-e.index);Array.prototype.push.apply(l,c),c=l}if(e.index+e.removed.length>i.index+i.addedCount){var m=e.removed.slice(i.index+i.addedCount-e.index);Array.prototype.push.apply(c,m)}e.removed=c,i.index<e.index&&(e.index=i.index)}else f=!0}else if(e.index<i.index){f=!0,a.splice(h,0,e),h++;var n=e.addedCount-e.removed.length;i.index+=n,g+=n}}}f||a.push(e)}function M(a,b){for(var c=[],f=0;f<b.length;f++){var g=b[f];switch(g.type){case"splice":L(c,g.index,g.removed.slice(),g.addedCount);break;case"add":case"update":case"delete":if(!d(g.name))continue;var h=e(g.name);if(0>h)continue;L(c,h,[g.oldValue],1);break;default:console.error("Unexpected record type: "+JSON.stringify(g))}}return c}function N(a,b){var c=[];return M(a,b).forEach(function(b){return 1==b.addedCount&&1==b.removed.length?void(b.removed[0]!==a[b.index]&&c.push(b)):void(c=c.concat(J(a,b.index,b.index+b.addedCount,b.removed,0,b.removed.length)))}),c}var O=a.testingExposeCycleCount,P=b(),Q=c(),R=a.Number.isNaN||function(b){return"number"==typeof b&&a.isNaN(b)},S="__proto__"in{}?function(a){return a}:function(a){var b=a.__proto__;if(!b)return a;var c=Object.create(b);return Object.getOwnPropertyNames(a).forEach(function(b){Object.defineProperty(c,b,Object.getOwnPropertyDescriptor(a,b))}),c},T="[$_a-zA-Z]",U="[$_a-zA-Z0-9]",V=new RegExp("^"+T+"+"+U+"*$"),W={beforePath:{ws:["beforePath"],ident:["inIdent","append"],"[":["beforeElement"],eof:["afterPath"]},inPath:{ws:["inPath"],".":["beforeIdent"],"[":["beforeElement"],eof:["afterPath"]},beforeIdent:{ws:["beforeIdent"],ident:["inIdent","append"]},inIdent:{ident:["inIdent","append"],0:["inIdent","append"],number:["inIdent","append"],ws:["inPath","push"],".":["beforeIdent","push"],"[":["beforeElement","push"],eof:["afterPath","push"]},beforeElement:{ws:["beforeElement"],0:["afterZero","append"],number:["inIndex","append"],"'":["inSingleQuote","append",""],'"':["inDoubleQuote","append",""]},afterZero:{ws:["afterElement","push"],"]":["inPath","push"]},inIndex:{0:["inIndex","append"],number:["inIndex","append"],ws:["afterElement"],"]":["inPath","push"]},inSingleQuote:{"'":["afterElement"],eof:["error"],"else":["inSingleQuote","append"]},inDoubleQuote:{'"':["afterElement"],eof:["error"],"else":["inDoubleQuote","append"]},afterElement:{ws:["afterElement"],"]":["inPath","push"]}},X={},Y={};l.get=m,l.prototype=S({__proto__:[],valid:!0,toString:function(){for(var a="",b=0;b<this.length;b++){var c=this[b];a+=k(c)?b?"."+c:c:n(c)}return a},getValueFrom:function(a){for(var b=0;b<this.length;b++){if(null==a)return;a=a[this[b]]}return a},iterateObjects:function(a,b){for(var c=0;c<this.length;c++){if(c&&(a=a[this[c-1]]),!f(a))return;b(a,this[0])}},compiledGetValueFromFn:function(){var a="",b="obj";a+="if (obj != null";for(var c,d=0;d<this.length-1;d++)c=this[d],b+=k(c)?"."+c:n(c),a+=" &&\n     "+b+" != null";a+=")\n";var c=this[d];return b+=k(c)?"."+c:n(c),a+="  return "+b+";\nelse\n  return undefined;",new Function("obj",a)},setValueFrom:function(a,b){if(!this.length)return!1;for(var c=0;c<this.length-1;c++){if(!f(a))return!1;a=a[this[c]]}return f(a)?(a[this[c]]=b,!0):!1}});var Z=new l("",X);Z.valid=!1,Z.getValueFrom=Z.setValueFrom=function(){};var $,_=1e3,ab=[],bb=P?function(){var a={pingPong:!0},b=!1;return Object.observe(a,function(){s(),b=!1}),function(c){ab.push(c),b||(b=!0,a.pingPong=!a.pingPong)}}():function(){return function(a){ab.push(a)}}(),cb=[],db=[],eb=0,fb=1,gb=2,hb=3,ib=1;x.prototype={open:function(a,b){if(this.state_!=eb)throw Error("Observer has already been opened.");return y(this),this.callback_=a,this.target_=b,this.connect_(),this.state_=fb,this.value_},close:function(){this.state_==fb&&(z(this),this.disconnect_(),this.value_=void 0,this.callback_=void 0,this.target_=void 0,this.state_=gb)},deliver:function(){this.state_==fb&&o(this)},report_:function(a){try{this.callback_.apply(this.target_,a)}catch(b){x._errorThrownDuringCallback=!0,console.error("Exception caught during observer callback: "+(b.stack||b))}},discardChanges:function(){return this.check_(void 0,!0),this.value_}};var jb,kb=!P;x._allObserversCount=0,kb&&(jb=[]);var lb=!1;a.Platform=a.Platform||{},a.Platform.performMicrotaskCheckpoint=function(){if(!lb&&kb){lb=!0;var b,c,d=0;do{d++,c=jb,jb=[],b=!1;for(var e=0;e<c.length;e++){var f=c[e];f.state_==fb&&(f.check_()&&(b=!0),jb.push(f))}s()&&(b=!0)}while(_>d&&b);O&&(a.dirtyCheckCycleCount=d),lb=!1}},kb&&(a.Platform.clearObservers=function(){jb=[]}),A.prototype=S({__proto__:x.prototype,arrayObserve:!1,connect_:function(){P?this.directObserver_=u(this,this.value_,this.arrayObserve):this.oldObject_=this.copyObject(this.value_)},copyObject:function(a){var b=Array.isArray(a)?[]:{};for(var c in a)b[c]=a[c];return Array.isArray(a)&&(b.length=a.length),b},check_:function(a){var b,c;if(P){if(!a)return!1;c={},b=G(this.value_,a,c)}else c=this.oldObject_,b=r(this.value_,this.oldObject_);return q(b)?!1:(P||(this.oldObject_=this.copyObject(this.value_)),this.report_([b.added||{},b.removed||{},b.changed||{},function(a){return c[a]}]),!0)},disconnect_:function(){P?(this.directObserver_.close(),this.directObserver_=void 0):this.oldObject_=void 0},deliver:function(){this.state_==fb&&(P?this.directObserver_.deliver(!1):o(this))},discardChanges:function(){return this.directObserver_?this.directObserver_.deliver(!0):this.oldObject_=this.copyObject(this.value_),this.value_}}),B.prototype=S({__proto__:A.prototype,arrayObserve:!0,copyObject:function(a){return a.slice()},check_:function(a){var b;if(P){if(!a)return!1;b=N(this.value_,a)}else b=J(this.value_,0,this.value_.length,this.oldObject_,0,this.oldObject_.length);return b&&b.length?(P||(this.oldObject_=this.copyObject(this.value_)),this.report_([b]),!0):!1}}),B.applySplices=function(a,b,c){c.forEach(function(c){for(var d=[c.index,c.removed.length],e=c.index;e<c.index+c.addedCount;)d.push(b[e]),e++;Array.prototype.splice.apply(a,d)})},C.prototype=S({__proto__:x.prototype,get path(){return this.path_},connect_:function(){P&&(this.directObserver_=w(this,this.object_)),this.check_(void 0,!0)},disconnect_:function(){this.value_=void 0,this.directObserver_&&(this.directObserver_.close(this),this.directObserver_=void 0)},iterateObjects_:function(a){this.path_.iterateObjects(this.object_,a)},check_:function(a,b){var c=this.value_;return this.value_=this.path_.getValueFrom(this.object_),b||g(this.value_,c)?!1:(this.report_([this.value_,c,this]),!0)},setValue:function(a){this.path_&&this.path_.setValueFrom(this.object_,a)}});var mb={};D.prototype=S({__proto__:x.prototype,connect_:function(){if(P){for(var a,b=!1,c=0;c<this.observed_.length;c+=2)if(a=this.observed_[c],a!==mb){b=!0;break}b&&(this.directObserver_=w(this,a))}this.check_(void 0,!this.reportChangesOnOpen_)},disconnect_:function(){for(var a=0;a<this.observed_.length;a+=2)this.observed_[a]===mb&&this.observed_[a+1].close();this.observed_.length=0,this.value_.length=0,this.directObserver_&&(this.directObserver_.close(this),this.directObserver_=void 0)},addPath:function(a,b){if(this.state_!=eb&&this.state_!=hb)throw Error("Cannot add paths once started.");var b=m(b);if(this.observed_.push(a,b),this.reportChangesOnOpen_){var c=this.observed_.length/2-1;this.value_[c]=b.getValueFrom(a)}},addObserver:function(a){if(this.state_!=eb&&this.state_!=hb)throw Error("Cannot add observers once started.");if(this.observed_.push(mb,a),this.reportChangesOnOpen_){var b=this.observed_.length/2-1;this.value_[b]=a.open(this.deliver,this)}},startReset:function(){if(this.state_!=fb)throw Error("Can only reset while open");this.state_=hb,this.disconnect_()},finishReset:function(){if(this.state_!=hb)throw Error("Can only finishReset after startReset");return this.state_=fb,this.connect_(),this.value_},iterateObjects_:function(a){for(var b,c=0;c<this.observed_.length;c+=2)b=this.observed_[c],b!==mb&&this.observed_[c+1].iterateObjects(b,a)},check_:function(a,b){for(var c,d=0;d<this.observed_.length;d+=2){var e,f=this.observed_[d],h=this.observed_[d+1];if(f===mb){var i=h;e=this.state_===eb?i.open(this.deliver,this):i.discardChanges()}else e=h.getValueFrom(f);b?this.value_[d/2]=e:g(e,this.value_[d/2])||(c=c||[],c[d/2]=this.value_[d/2],this.value_[d/2]=e)}return c?(this.report_([this.value_,c,this.observed_]),!0):!1}}),F.prototype={open:function(a,b){return this.callback_=a,this.target_=b,this.value_=this.getValueFn_(this.observable_.open(this.observedCallback_,this)),this.value_},observedCallback_:function(a){if(a=this.getValueFn_(a),!g(a,this.value_)){var b=this.value_;this.value_=a,this.callback_.call(this.target_,this.value_,b)}},discardChanges:function(){return this.value_=this.getValueFn_(this.observable_.discardChanges()),this.value_},deliver:function(){return this.observable_.deliver()},setValue:function(a){return a=this.setValueFn_(a),!this.dontPassThroughSet_&&this.observable_.setValue?this.observable_.setValue(a):void 0},close:function(){this.observable_&&this.observable_.close(),this.callback_=void 0,this.target_=void 0,this.observable_=void 0,this.value_=void 0,this.getValueFn_=void 0,this.setValueFn_=void 0}};var nb={add:!0,update:!0,"delete":!0},ob=0,pb=1,qb=2,rb=3;I.prototype={calcEditDistances:function(a,b,c,d,e,f){for(var g=f-e+1,h=c-b+1,i=new Array(g),j=0;g>j;j++)i[j]=new Array(h),i[j][0]=j;for(var k=0;h>k;k++)i[0][k]=k;for(var j=1;g>j;j++)for(var k=1;h>k;k++)if(this.equals(a[b+k-1],d[e+j-1]))i[j][k]=i[j-1][k-1];else{var l=i[j-1][k]+1,m=i[j][k-1]+1;i[j][k]=m>l?l:m}return i},spliceOperationsFromEditDistances:function(a){for(var b=a.length-1,c=a[0].length-1,d=a[b][c],e=[];b>0||c>0;)if(0!=b)if(0!=c){var f,g=a[b-1][c-1],h=a[b-1][c],i=a[b][c-1];f=i>h?g>h?h:g:g>i?i:g,f==g?(g==d?e.push(ob):(e.push(pb),d=g),b--,c--):f==h?(e.push(rb),b--,d=h):(e.push(qb),c--,d=i)}else e.push(rb),b--;else e.push(qb),c--;return e.reverse(),e},calcSplices:function(a,b,c,d,e,f){var g=0,h=0,i=Math.min(c-b,f-e);if(0==b&&0==e&&(g=this.sharedPrefix(a,d,i)),c==a.length&&f==d.length&&(h=this.sharedSuffix(a,d,i-g)),b+=g,e+=g,c-=h,f-=h,c-b==0&&f-e==0)return[];if(b==c){for(var j=H(b,[],0);f>e;)j.removed.push(d[e++]);return[j]}if(e==f)return[H(b,[],c-b)];for(var k=this.spliceOperationsFromEditDistances(this.calcEditDistances(a,b,c,d,e,f)),j=void 0,l=[],m=b,n=e,o=0;o<k.length;o++)switch(k[o]){case ob:j&&(l.push(j),j=void 0),m++,n++;break;case pb:j||(j=H(m,[],0)),j.addedCount++,m++,j.removed.push(d[n]),n++;break;case qb:j||(j=H(m,[],0)),j.addedCount++,m++;break;case rb:j||(j=H(m,[],0)),j.removed.push(d[n]),n++}return j&&l.push(j),l},sharedPrefix:function(a,b,c){for(var d=0;c>d;d++)if(!this.equals(a[d],b[d]))return d;return c},sharedSuffix:function(a,b,c){for(var d=a.length,e=b.length,f=0;c>f&&this.equals(a[--d],b[--e]);)f++;return f},calculateSplices:function(a,b){return this.calcSplices(a,0,a.length,b,0,b.length)},equals:function(a,b){return a===b}};var sb=new I;a.Observer=x,a.Observer.runEOM_=bb,a.Observer.observerSentinel_=mb,a.Observer.hasObjectObserve=P,a.ArrayObserver=B,a.ArrayObserver.calculateSplices=function(a,b){return sb.calculateSplices(a,b)},a.ArraySplice=I,a.ObjectObserver=A,a.PathObserver=C,a.CompoundObserver=D,a.Path=l,a.ObserverTransform=F}("undefined"!=typeof global&&global&&"undefined"!=typeof module&&module?global:this||window),function(){"use strict";function a(a){for(;a.parentNode;)a=a.parentNode;return"function"==typeof a.getElementById?a:null}function b(a,b,c){var d=a.bindings_;return d||(d=a.bindings_={}),d[b]&&c[b].close(),d[b]=c}function c(a,b,c){return c}function d(a){return null==a?"":a}function e(a,b){a.data=d(b)}function f(a){return function(b){return e(a,b)}}function g(a,b,c,e){return c?void(e?a.setAttribute(b,""):a.removeAttribute(b)):void a.setAttribute(b,d(e))}function h(a,b,c){return function(d){g(a,b,c,d)}}function i(a){switch(a.type){case"checkbox":return u;case"radio":case"select-multiple":case"select-one":return"change";case"range":if(/Trident|MSIE/.test(navigator.userAgent))return"change";default:return"input"}}function j(a,b,c,e){a[b]=(e||d)(c)}function k(a,b,c){return function(d){return j(a,b,d,c)}}function l(){}function m(a,b,c,d){function e(){c.setValue(a[b]),c.discardChanges(),(d||l)(a),Platform.performMicrotaskCheckpoint()}var f=i(a);return a.addEventListener(f,e),{close:function(){a.removeEventListener(f,e),c.close()},observable_:c}}function n(a){return Boolean(a)}function o(b){if(b.form)return s(b.form.elements,function(a){return a!=b&&"INPUT"==a.tagName&&"radio"==a.type&&a.name==b.name});var c=a(b);if(!c)return[];var d=c.querySelectorAll('input[type="radio"][name="'+b.name+'"]');return s(d,function(a){return a!=b&&!a.form})}function p(a){"INPUT"===a.tagName&&"radio"===a.type&&o(a).forEach(function(a){var b=a.bindings_.checked;b&&b.observable_.setValue(!1)})}function q(a,b){var c,e,f,g=a.parentNode;g instanceof HTMLSelectElement&&g.bindings_&&g.bindings_.value&&(c=g,e=c.bindings_.value,f=c.value),a.value=d(b),c&&c.value!=f&&(e.observable_.setValue(c.value),e.observable_.discardChanges(),Platform.performMicrotaskCheckpoint())}function r(a){return function(b){q(a,b)}}var s=Array.prototype.filter.call.bind(Array.prototype.filter);Node.prototype.bind=function(a,b){console.error("Unhandled binding to Node: ",this,a,b)},Node.prototype.bindFinished=function(){};var t=c;Object.defineProperty(Platform,"enableBindingsReflection",{get:function(){return t===b},set:function(a){return t=a?b:c,a},configurable:!0}),Text.prototype.bind=function(a,b,c){if("textContent"!==a)return Node.prototype.bind.call(this,a,b,c);if(c)return e(this,b);var d=b;return e(this,d.open(f(this))),t(this,a,d)},Element.prototype.bind=function(a,b,c){var d="?"==a[a.length-1];if(d&&(this.removeAttribute(a),a=a.slice(0,-1)),c)return g(this,a,d,b);var e=b;return g(this,a,d,e.open(h(this,a,d))),t(this,a,e)};var u;!function(){var a=document.createElement("div"),b=a.appendChild(document.createElement("input"));b.setAttribute("type","checkbox");var c,d=0;b.addEventListener("click",function(){d++,c=c||"click"}),b.addEventListener("change",function(){d++,c=c||"change"});var e=document.createEvent("MouseEvent");e.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),b.dispatchEvent(e),u=1==d?"change":c}(),HTMLInputElement.prototype.bind=function(a,c,e){if("value"!==a&&"checked"!==a)return HTMLElement.prototype.bind.call(this,a,c,e);this.removeAttribute(a);var f="checked"==a?n:d,g="checked"==a?p:l;if(e)return j(this,a,c,f);var h=c,i=m(this,a,h,g);return j(this,a,h.open(k(this,a,f)),f),b(this,a,i)},HTMLTextAreaElement.prototype.bind=function(a,b,c){if("value"!==a)return HTMLElement.prototype.bind.call(this,a,b,c);if(this.removeAttribute("value"),c)return j(this,"value",b);var e=b,f=m(this,"value",e);return j(this,"value",e.open(k(this,"value",d))),t(this,a,f)},HTMLOptionElement.prototype.bind=function(a,b,c){if("value"!==a)return HTMLElement.prototype.bind.call(this,a,b,c);if(this.removeAttribute("value"),c)return q(this,b);var d=b,e=m(this,"value",d);return q(this,d.open(r(this))),t(this,a,e)},HTMLSelectElement.prototype.bind=function(a,c,d){if("selectedindex"===a&&(a="selectedIndex"),"selectedIndex"!==a&&"value"!==a)return HTMLElement.prototype.bind.call(this,a,c,d);if(this.removeAttribute(a),d)return j(this,a,c);var e=c,f=m(this,a,e);return j(this,a,e.open(k(this,a))),b(this,a,f)}}(this),function(a){"use strict";function b(a){if(!a)throw new Error("Assertion failed")}function c(a){for(var b;b=a.parentNode;)a=b;return a}function d(a,b){if(b){for(var d,e="#"+b;!d&&(a=c(a),a.protoContent_?d=a.protoContent_.querySelector(e):a.getElementById&&(d=a.getElementById(b)),!d&&a.templateCreator_);)a=a.templateCreator_;return d}}function e(a){return"template"==a.tagName&&"http://www.w3.org/2000/svg"==a.namespaceURI}function f(a){return"TEMPLATE"==a.tagName&&"http://www.w3.org/1999/xhtml"==a.namespaceURI}function g(a){return Boolean(L[a.tagName]&&a.hasAttribute("template"))}function h(a){return void 0===a.isTemplate_&&(a.isTemplate_="TEMPLATE"==a.tagName||g(a)),a.isTemplate_}function i(a,b){var c=a.querySelectorAll(N);h(a)&&b(a),G(c,b)}function j(a){function b(a){HTMLTemplateElement.decorate(a)||j(a.content)}i(a,b)}function k(a,b){Object.getOwnPropertyNames(b).forEach(function(c){Object.defineProperty(a,c,Object.getOwnPropertyDescriptor(b,c))})}function l(a){var b=a.ownerDocument;if(!b.defaultView)return b;var c=b.templateContentsOwner_;if(!c){for(c=b.implementation.createHTMLDocument("");c.lastChild;)c.removeChild(c.lastChild);b.templateContentsOwner_=c}return c}function m(a){if(!a.stagingDocument_){var b=a.ownerDocument;if(!b.stagingDocument_){b.stagingDocument_=b.implementation.createHTMLDocument(""),b.stagingDocument_.isStagingDocument=!0;var c=b.stagingDocument_.createElement("base");c.href=document.baseURI,b.stagingDocument_.head.appendChild(c),b.stagingDocument_.stagingDocument_=b.stagingDocument_}a.stagingDocument_=b.stagingDocument_}return a.stagingDocument_}function n(a){var b=a.ownerDocument.createElement("template");a.parentNode.insertBefore(b,a);for(var c=a.attributes,d=c.length;d-->0;){var e=c[d];K[e.name]&&("template"!==e.name&&b.setAttribute(e.name,e.value),a.removeAttribute(e.name))}return b}function o(a){var b=a.ownerDocument.createElement("template");a.parentNode.insertBefore(b,a);for(var c=a.attributes,d=c.length;d-->0;){var e=c[d];b.setAttribute(e.name,e.value),a.removeAttribute(e.name)}return a.parentNode.removeChild(a),b}function p(a,b,c){var d=a.content;if(c)return void d.appendChild(b);for(var e;e=b.firstChild;)d.appendChild(e)}function q(a){P?a.__proto__=HTMLTemplateElement.prototype:k(a,HTMLTemplateElement.prototype)}function r(a){a.setModelFn_||(a.setModelFn_=function(){a.setModelFnScheduled_=!1;
var b=z(a,a.delegate_&&a.delegate_.prepareBinding);w(a,b,a.model_)}),a.setModelFnScheduled_||(a.setModelFnScheduled_=!0,Observer.runEOM_(a.setModelFn_))}function s(a,b,c,d){if(a&&a.length){for(var e,f=a.length,g=0,h=0,i=0,j=!0;f>h;){var g=a.indexOf("{{",h),k=a.indexOf("[[",h),l=!1,m="}}";if(k>=0&&(0>g||g>k)&&(g=k,l=!0,m="]]"),i=0>g?-1:a.indexOf(m,g+2),0>i){if(!e)return;e.push(a.slice(h));break}e=e||[],e.push(a.slice(h,g));var n=a.slice(g+2,i).trim();e.push(l),j=j&&l;var o=d&&d(n,b,c);e.push(null==o?Path.get(n):null),e.push(o),h=i+2}return h===f&&e.push(""),e.hasOnePath=5===e.length,e.isSimplePath=e.hasOnePath&&""==e[0]&&""==e[4],e.onlyOneTime=j,e.combinator=function(a){for(var b=e[0],c=1;c<e.length;c+=4){var d=e.hasOnePath?a:a[(c-1)/4];void 0!==d&&(b+=d),b+=e[c+3]}return b},e}}function t(a,b,c,d){if(b.hasOnePath){var e=b[3],f=e?e(d,c,!0):b[2].getValueFrom(d);return b.isSimplePath?f:b.combinator(f)}for(var g=[],h=1;h<b.length;h+=4){var e=b[h+2];g[(h-1)/4]=e?e(d,c):b[h+1].getValueFrom(d)}return b.combinator(g)}function u(a,b,c,d){var e=b[3],f=e?e(d,c,!1):new PathObserver(d,b[2]);return b.isSimplePath?f:new ObserverTransform(f,b.combinator)}function v(a,b,c,d){if(b.onlyOneTime)return t(a,b,c,d);if(b.hasOnePath)return u(a,b,c,d);for(var e=new CompoundObserver,f=1;f<b.length;f+=4){var g=b[f],h=b[f+2];if(h){var i=h(d,c,g);g?e.addPath(i):e.addObserver(i)}else{var j=b[f+1];g?e.addPath(j.getValueFrom(d)):e.addPath(d,j)}}return new ObserverTransform(e,b.combinator)}function w(a,b,c,d){for(var e=0;e<b.length;e+=2){var f=b[e],g=b[e+1],h=v(f,g,a,c),i=a.bind(f,h,g.onlyOneTime);i&&d&&d.push(i)}if(a.bindFinished(),b.isTemplate){a.model_=c;var j=a.processBindingDirectives_(b);d&&j&&d.push(j)}}function x(a,b,c){var d=a.getAttribute(b);return s(""==d?"{{}}":d,b,a,c)}function y(a,c){b(a);for(var d=[],e=0;e<a.attributes.length;e++){for(var f=a.attributes[e],g=f.name,i=f.value;"_"===g[0];)g=g.substring(1);if(!h(a)||g!==J&&g!==H&&g!==I){var j=s(i,g,a,c);j&&d.push(g,j)}}return h(a)&&(d.isTemplate=!0,d.if=x(a,J,c),d.bind=x(a,H,c),d.repeat=x(a,I,c),!d.if||d.bind||d.repeat||(d.bind=s("{{}}",H,a,c))),d}function z(a,b){if(a.nodeType===Node.ELEMENT_NODE)return y(a,b);if(a.nodeType===Node.TEXT_NODE){var c=s(a.data,"textContent",a,b);if(c)return["textContent",c]}return[]}function A(a,b,c,d,e,f,g){for(var h=b.appendChild(c.importNode(a,!1)),i=0,j=a.firstChild;j;j=j.nextSibling)A(j,h,c,d.children[i++],e,f,g);return d.isTemplate&&(HTMLTemplateElement.decorate(h,a),f&&h.setDelegate_(f)),w(h,d,e,g),h}function B(a,b){var c=z(a,b);c.children={};for(var d=0,e=a.firstChild;e;e=e.nextSibling)c.children[d++]=B(e,b);return c}function C(a){var b=a.id_;return b||(b=a.id_=S++),b}function D(a,b){var c=C(a);if(b){var d=b.bindingMaps[c];return d||(d=b.bindingMaps[c]=B(a,b.prepareBinding)||[]),d}var d=a.bindingMap_;return d||(d=a.bindingMap_=B(a,void 0)||[]),d}function E(a){this.closed=!1,this.templateElement_=a,this.instances=[],this.deps=void 0,this.iteratedValue=[],this.presentValue=void 0,this.arrayObserver=void 0}var F,G=Array.prototype.forEach.call.bind(Array.prototype.forEach);a.Map&&"function"==typeof a.Map.prototype.forEach?F=a.Map:(F=function(){this.keys=[],this.values=[]},F.prototype={set:function(a,b){var c=this.keys.indexOf(a);0>c?(this.keys.push(a),this.values.push(b)):this.values[c]=b},get:function(a){var b=this.keys.indexOf(a);if(!(0>b))return this.values[b]},"delete":function(a){var b=this.keys.indexOf(a);return 0>b?!1:(this.keys.splice(b,1),this.values.splice(b,1),!0)},forEach:function(a,b){for(var c=0;c<this.keys.length;c++)a.call(b||this,this.values[c],this.keys[c],this)}});"function"!=typeof document.contains&&(Document.prototype.contains=function(a){return a===this||a.parentNode===this?!0:this.documentElement.contains(a)});var H="bind",I="repeat",J="if",K={template:!0,repeat:!0,bind:!0,ref:!0},L={THEAD:!0,TBODY:!0,TFOOT:!0,TH:!0,TR:!0,TD:!0,COLGROUP:!0,COL:!0,CAPTION:!0,OPTION:!0,OPTGROUP:!0},M="undefined"!=typeof HTMLTemplateElement;M&&!function(){var a=document.createElement("template"),b=a.content.ownerDocument,c=b.appendChild(b.createElement("html")),d=c.appendChild(b.createElement("head")),e=b.createElement("base");e.href=document.baseURI,d.appendChild(e)}();var N="template, "+Object.keys(L).map(function(a){return a.toLowerCase()+"[template]"}).join(", ");document.addEventListener("DOMContentLoaded",function(){j(document),Platform.performMicrotaskCheckpoint()},!1),M||(a.HTMLTemplateElement=function(){throw TypeError("Illegal constructor")});var O,P="__proto__"in{};"function"==typeof MutationObserver&&(O=new MutationObserver(function(a){for(var b=0;b<a.length;b++)a[b].target.refChanged_()})),HTMLTemplateElement.decorate=function(a,c){if(a.templateIsDecorated_)return!1;var d=a;d.templateIsDecorated_=!0;var h=f(d)&&M,i=h,k=!h,m=!1;if(h||(g(d)?(b(!c),d=n(a),d.templateIsDecorated_=!0,h=M,m=!0):e(d)&&(d=o(a),d.templateIsDecorated_=!0,h=M)),!h){q(d);var r=l(d);d.content_=r.createDocumentFragment()}return c?d.instanceRef_=c:k?p(d,a,m):i&&j(d.content),!0},HTMLTemplateElement.bootstrap=j;var Q=a.HTMLUnknownElement||HTMLElement,R={get:function(){return this.content_},enumerable:!0,configurable:!0};M||(HTMLTemplateElement.prototype=Object.create(Q.prototype),Object.defineProperty(HTMLTemplateElement.prototype,"content",R)),k(HTMLTemplateElement.prototype,{bind:function(a,b,c){if("ref"!=a)return Element.prototype.bind.call(this,a,b,c);var d=this,e=c?b:b.open(function(a){d.setAttribute("ref",a),d.refChanged_()});return this.setAttribute("ref",e),this.refChanged_(),c?void 0:(this.bindings_?this.bindings_.ref=b:this.bindings_={ref:b},b)},processBindingDirectives_:function(a){return this.iterator_&&this.iterator_.closeDeps(),a.if||a.bind||a.repeat?(this.iterator_||(this.iterator_=new E(this)),this.iterator_.updateDependencies(a,this.model_),O&&O.observe(this,{attributes:!0,attributeFilter:["ref"]}),this.iterator_):void(this.iterator_&&(this.iterator_.close(),this.iterator_=void 0))},createInstance:function(a,b,c){b?c=this.newDelegate_(b):c||(c=this.delegate_),this.refContent_||(this.refContent_=this.ref_.content);var d=this.refContent_;if(null===d.firstChild)return T;var e=D(d,c),f=m(this),g=f.createDocumentFragment();g.templateCreator_=this,g.protoContent_=d,g.bindings_=[],g.terminator_=null;for(var h=g.templateInstance_={firstNode:null,lastNode:null,model:a},i=0,j=!1,k=d.firstChild;k;k=k.nextSibling){null===k.nextSibling&&(j=!0);var l=A(k,g,f,e.children[i++],a,c,g.bindings_);l.templateInstance_=h,j&&(g.terminator_=l)}return h.firstNode=g.firstChild,h.lastNode=g.lastChild,g.templateCreator_=void 0,g.protoContent_=void 0,g},get model(){return this.model_},set model(a){this.model_=a,r(this)},get bindingDelegate(){return this.delegate_&&this.delegate_.raw},refChanged_:function(){this.iterator_&&this.refContent_!==this.ref_.content&&(this.refContent_=void 0,this.iterator_.valueChanged(),this.iterator_.updateIteratedValue(this.iterator_.getUpdatedValue()))},clear:function(){this.model_=void 0,this.delegate_=void 0,this.bindings_&&this.bindings_.ref&&this.bindings_.ref.close(),this.refContent_=void 0,this.iterator_&&(this.iterator_.valueChanged(),this.iterator_.close(),this.iterator_=void 0)},setDelegate_:function(a){this.delegate_=a,this.bindingMap_=void 0,this.iterator_&&(this.iterator_.instancePositionChangedFn_=void 0,this.iterator_.instanceModelFn_=void 0)},newDelegate_:function(a){function b(b){var c=a&&a[b];if("function"==typeof c)return function(){return c.apply(a,arguments)}}if(a)return{bindingMaps:{},raw:a,prepareBinding:b("prepareBinding"),prepareInstanceModel:b("prepareInstanceModel"),prepareInstancePositionChanged:b("prepareInstancePositionChanged")}},set bindingDelegate(a){if(this.delegate_)throw Error("Template must be cleared before a new bindingDelegate can be assigned");this.setDelegate_(this.newDelegate_(a))},get ref_(){var a=d(this,this.getAttribute("ref"));if(a||(a=this.instanceRef_),!a)return this;var b=a.ref_;return b?b:a}});var S=1;Object.defineProperty(Node.prototype,"templateInstance",{get:function(){var a=this.templateInstance_;return a?a:this.parentNode?this.parentNode.templateInstance:void 0}});var T=document.createDocumentFragment();T.bindings_=[],T.terminator_=null,E.prototype={closeDeps:function(){var a=this.deps;a&&(a.ifOneTime===!1&&a.ifValue.close(),a.oneTime===!1&&a.value.close())},updateDependencies:function(a,b){this.closeDeps();var c=this.deps={},d=this.templateElement_,e=!0;if(a.if){if(c.hasIf=!0,c.ifOneTime=a.if.onlyOneTime,c.ifValue=v(J,a.if,d,b),e=c.ifValue,c.ifOneTime&&!e)return void this.valueChanged();c.ifOneTime||(e=e.open(this.updateIfValue,this))}a.repeat?(c.repeat=!0,c.oneTime=a.repeat.onlyOneTime,c.value=v(I,a.repeat,d,b)):(c.repeat=!1,c.oneTime=a.bind.onlyOneTime,c.value=v(H,a.bind,d,b));var f=c.value;return c.oneTime||(f=f.open(this.updateIteratedValue,this)),e?void this.updateValue(f):void this.valueChanged()},getUpdatedValue:function(){var a=this.deps.value;return this.deps.oneTime||(a=a.discardChanges()),a},updateIfValue:function(a){return a?void this.updateValue(this.getUpdatedValue()):void this.valueChanged()},updateIteratedValue:function(a){if(this.deps.hasIf){var b=this.deps.ifValue;if(this.deps.ifOneTime||(b=b.discardChanges()),!b)return void this.valueChanged()}this.updateValue(a)},updateValue:function(a){this.deps.repeat||(a=[a]);var b=this.deps.repeat&&!this.deps.oneTime&&Array.isArray(a);this.valueChanged(a,b)},valueChanged:function(a,b){Array.isArray(a)||(a=[]),a!==this.iteratedValue&&(this.unobserve(),this.presentValue=a,b&&(this.arrayObserver=new ArrayObserver(this.presentValue),this.arrayObserver.open(this.handleSplices,this)),this.handleSplices(ArrayObserver.calculateSplices(this.presentValue,this.iteratedValue)))},getLastInstanceNode:function(a){if(-1==a)return this.templateElement_;var b=this.instances[a],c=b.terminator_;if(!c)return this.getLastInstanceNode(a-1);if(c.nodeType!==Node.ELEMENT_NODE||this.templateElement_===c)return c;var d=c.iterator_;return d?d.getLastTemplateNode():c},getLastTemplateNode:function(){return this.getLastInstanceNode(this.instances.length-1)},insertInstanceAt:function(a,b){var c=this.getLastInstanceNode(a-1),d=this.templateElement_.parentNode;this.instances.splice(a,0,b),d.insertBefore(b,c.nextSibling)},extractInstanceAt:function(a){for(var b=this.getLastInstanceNode(a-1),c=this.getLastInstanceNode(a),d=this.templateElement_.parentNode,e=this.instances.splice(a,1)[0];c!==b;){var f=b.nextSibling;f==c&&(c=b),e.appendChild(d.removeChild(f))}return e},getDelegateFn:function(a){return a=a&&a(this.templateElement_),"function"==typeof a?a:null},handleSplices:function(a){if(!this.closed&&a.length){var b=this.templateElement_;if(!b.parentNode)return void this.close();ArrayObserver.applySplices(this.iteratedValue,this.presentValue,a);var c=b.delegate_;void 0===this.instanceModelFn_&&(this.instanceModelFn_=this.getDelegateFn(c&&c.prepareInstanceModel)),void 0===this.instancePositionChangedFn_&&(this.instancePositionChangedFn_=this.getDelegateFn(c&&c.prepareInstancePositionChanged));for(var d=new F,e=0,f=0;f<a.length;f++){for(var g=a[f],h=g.removed,i=0;i<h.length;i++){var j=h[i],k=this.extractInstanceAt(g.index+e);k!==T&&d.set(j,k)}e-=g.addedCount}for(var f=0;f<a.length;f++)for(var g=a[f],l=g.index;l<g.index+g.addedCount;l++){var j=this.iteratedValue[l],k=d.get(j);k?d.delete(j):(this.instanceModelFn_&&(j=this.instanceModelFn_(j)),k=void 0===j?T:b.createInstance(j,void 0,c)),this.insertInstanceAt(l,k)}d.forEach(function(a){this.closeInstanceBindings(a)},this),this.instancePositionChangedFn_&&this.reportInstancesMoved(a)}},reportInstanceMoved:function(a){var b=this.instances[a];b!==T&&this.instancePositionChangedFn_(b.templateInstance_,a)},reportInstancesMoved:function(a){for(var b=0,c=0,d=0;d<a.length;d++){var e=a[d];if(0!=c)for(;b<e.index;)this.reportInstanceMoved(b),b++;else b=e.index;for(;b<e.index+e.addedCount;)this.reportInstanceMoved(b),b++;c+=e.addedCount-e.removed.length}if(0!=c)for(var f=this.instances.length;f>b;)this.reportInstanceMoved(b),b++},closeInstanceBindings:function(a){for(var b=a.bindings_,c=0;c<b.length;c++)b[c].close()},unobserve:function(){this.arrayObserver&&(this.arrayObserver.close(),this.arrayObserver=void 0)},close:function(){if(!this.closed){this.unobserve();for(var a=0;a<this.instances.length;a++)this.closeInstanceBindings(this.instances[a]);this.instances.length=0,this.closeDeps(),this.templateElement_.iterator_=void 0,this.closed=!0}}},HTMLTemplateElement.forAllTemplatesFrom_=i}(this),function(a){function b(a){f.textContent=d++,e.push(a)}function c(){for(;e.length;)e.shift()()}var d=0,e=[],f=document.createTextNode("");new(window.MutationObserver||JsMutationObserver)(c).observe(f,{characterData:!0}),a.endOfMicrotask=b}(Platform),function(a){function b(){e||(e=!0,a.endOfMicrotask(function(){e=!1,logFlags.data&&console.group("Platform.flush()"),a.performMicrotaskCheckpoint(),logFlags.data&&console.groupEnd()}))}var c=document.createElement("style");c.textContent="template {display: none !important;} /* injected by platform.js */";var d=document.querySelector("head");d.insertBefore(c,d.firstChild);var e;if(Observer.hasObjectObserve)b=function(){};else{var f=125;window.addEventListener("WebComponentsReady",function(){b(),a.flushPoll=setInterval(b,f)})}if(window.CustomElements&&!CustomElements.useNative){var g=Document.prototype.importNode;Document.prototype.importNode=function(a,b){var c=g.call(this,a,b);return CustomElements.upgradeAll(c),c}}a.flush=b}(window.Platform),function(a){function b(a,b,d,e){return a.replace(e,function(a,e,f,g){var h=f.replace(/["']/g,"");return h=c(b,h,d),e+"'"+h+"'"+g})}function c(a,b,c){if(b&&"/"===b[0])return b;var e=new URL(b,a);return c?e.href:d(e.href)}function d(a){var b=new URL(document.baseURI),c=new URL(a,b);return c.host===b.host&&c.port===b.port&&c.protocol===b.protocol?e(b,c):a}function e(a,b){for(var c=a.pathname,d=b.pathname,e=c.split("/"),f=d.split("/");e.length&&e[0]===f[0];)e.shift(),f.shift();for(var g=0,h=e.length-1;h>g;g++)f.unshift("..");return f.join("/")+b.search+b.hash}var f={resolveDom:function(a,b){b=b||a.ownerDocument.baseURI,this.resolveAttributes(a,b),this.resolveStyles(a,b);var c=a.querySelectorAll("template");if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)d.content&&this.resolveDom(d.content,b)},resolveTemplate:function(a){this.resolveDom(a.content,a.ownerDocument.baseURI)},resolveStyles:function(a,b){var c=a.querySelectorAll("style");if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)this.resolveStyle(d,b)},resolveStyle:function(a,b){b=b||a.ownerDocument.baseURI,a.textContent=this.resolveCssText(a.textContent,b)},resolveCssText:function(a,c,d){return a=b(a,c,d,g),b(a,c,d,h)},resolveAttributes:function(a,b){a.hasAttributes&&a.hasAttributes()&&this.resolveElementAttributes(a,b);var c=a&&a.querySelectorAll(j);if(c)for(var d,e=0,f=c.length;f>e&&(d=c[e]);e++)this.resolveElementAttributes(d,b)},resolveElementAttributes:function(a,d){d=d||a.ownerDocument.baseURI,i.forEach(function(e){var f,h=a.attributes[e],i=h&&h.value;i&&i.search(k)<0&&(f="style"===e?b(i,d,!1,g):c(d,i),h.value=f)})}},g=/(url\()([^)]*)(\))/g,h=/(@import[\s]+(?!url\())([^;]*)(;)/g,i=["href","src","action","style","url"],j="["+i.join("],[")+"]",k="{{.*}}";a.urlResolver=f}(Polymer),function(a){function b(a){this.cache=Object.create(null),this.map=Object.create(null),this.requests=0,this.regex=a}var c=Platform.endOfMicrotask;b.prototype={extractUrls:function(a,b){for(var c,d,e=[];c=this.regex.exec(a);)d=new URL(c[1],b),e.push({matched:c[0],url:d.href});return e},process:function(a,b,c){var d=this.extractUrls(a,b),e=c.bind(null,this.map);this.fetch(d,e)},fetch:function(a,b){var c=a.length;if(!c)return b();for(var d,e,f,g=function(){0===--c&&b()},h=0;c>h;h++)d=a[h],f=d.url,e=this.cache[f],e||(e=this.xhr(f),e.match=d,this.cache[f]=e),e.wait(g)},handleXhr:function(a){var b=a.match,c=b.url,d=a.response||a.responseText||"";this.map[c]=d,this.fetch(this.extractUrls(d,c),a.resolve)},xhr:function(a){this.requests++;var b=new XMLHttpRequest;return b.open("GET",a,!0),b.send(),b.onerror=b.onload=this.handleXhr.bind(this,b),b.pending=[],b.resolve=function(){for(var a=b.pending,c=0;c<a.length;c++)a[c]();b.pending=null},b.wait=function(a){b.pending?b.pending.push(a):c(a)},b}},a.Loader=b}(Polymer),function(a){function b(){this.loader=new d(this.regex)}var c=a.urlResolver,d=a.Loader;b.prototype={regex:/@import\s+(?:url)?["'\(]*([^'"\)]*)['"\)]*;/g,resolve:function(a,b,c){var d=function(d){c(this.flatten(a,b,d))}.bind(this);this.loader.process(a,b,d)},resolveNode:function(a,b,c){var d=a.textContent,e=function(b){a.textContent=b,c(a)};this.resolve(d,b,e)},flatten:function(a,b,d){for(var e,f,g,h=this.loader.extractUrls(a,b),i=0;i<h.length;i++)e=h[i],f=e.url,g=c.resolveCssText(d[f],f,!0),g=this.flatten(g,b,d),a=a.replace(e.matched,g);return a},loadStyles:function(a,b,c){function d(){f++,f===g&&c&&c()}for(var e,f=0,g=a.length,h=0;g>h&&(e=a[h]);h++)this.resolveNode(e,b,d)}};var e=new b;a.styleResolver=e}(Polymer),function(a){function b(a,b){return a&&b&&Object.getOwnPropertyNames(b).forEach(function(c){var d=Object.getOwnPropertyDescriptor(b,c);d&&(Object.defineProperty(a,c,d),"function"==typeof d.value&&(d.value.nom=c))}),a}function c(a){for(var b=a||{},c=1;c<arguments.length;c++){var e=arguments[c];try{for(var f in e)d(f,e,b)}catch(g){}}return b}function d(a,b,c){var d=e(b,a);Object.defineProperty(c,a,d)}function e(a,b){if(a){var c=Object.getOwnPropertyDescriptor(a,b);return c||e(Object.getPrototypeOf(a),b)}}a.extend=b,a.mixin=c,Platform.mixin=c}(Polymer),function(a){function b(a,b,d){return a?a.stop():a=new c(this),a.go(b,d),a}var c=function(a){this.context=a,this.boundComplete=this.complete.bind(this)};c.prototype={go:function(a,b){this.callback=a;var c;b?(c=setTimeout(this.boundComplete,b),this.handle=function(){clearTimeout(c)}):(c=requestAnimationFrame(this.boundComplete),this.handle=function(){cancelAnimationFrame(c)})},stop:function(){this.handle&&(this.handle(),this.handle=null)},complete:function(){this.handle&&(this.stop(),this.callback.call(this.context))}},a.job=b}(Polymer),function(a){function b(a,b,c){var d="string"==typeof a?document.createElement(a):a.cloneNode(!0);if(d.innerHTML=b,c)for(var e in c)d.setAttribute(e,c[e]);return d}var c={};HTMLElement.register=function(a,b){c[a]=b},HTMLElement.getPrototypeForTag=function(a){var b=a?c[a]:HTMLElement.prototype;return b||Object.getPrototypeOf(document.createElement(a))};var d=Event.prototype.stopPropagation;Event.prototype.stopPropagation=function(){this.cancelBubble=!0,d.apply(this,arguments)};var e=DOMTokenList.prototype.add,f=DOMTokenList.prototype.remove;DOMTokenList.prototype.add=function(){for(var a=0;a<arguments.length;a++)e.call(this,arguments[a])},DOMTokenList.prototype.remove=function(){for(var a=0;a<arguments.length;a++)f.call(this,arguments[a])},DOMTokenList.prototype.toggle=function(a,b){1==arguments.length&&(b=!this.contains(a)),b?this.add(a):this.remove(a)},DOMTokenList.prototype.switch=function(a,b){a&&this.remove(a),b&&this.add(b)};var g=function(){return Array.prototype.slice.call(this)},h=window.NamedNodeMap||window.MozNamedAttrMap||{};NodeList.prototype.array=g,h.prototype.array=g,HTMLCollection.prototype.array=g,a.createDOM=b}(Polymer),function(a){function b(a){var e=b.caller,g=e.nom,h=e._super;h||(g||(g=e.nom=c.call(this,e)),g||console.warn("called super() on a method not installed declaratively (has no .nom property)"),h=d(e,g,f(this)));var i=h[g];return i?(i._super||d(i,g,h),i.apply(this,a||[])):void 0}function c(a){for(var b=this.__proto__;b&&b!==HTMLElement.prototype;){for(var c,d=Object.getOwnPropertyNames(b),e=0,f=d.length;f>e&&(c=d[e]);e++){var g=Object.getOwnPropertyDescriptor(b,c);if("function"==typeof g.value&&g.value===a)return c}b=b.__proto__}}function d(a,b,c){var d=e(c,b,a);return d[b]&&(d[b].nom=b),a._super=d}function e(a,b,c){for(;a;){if(a[b]!==c&&a[b])return a;a=f(a)}return Object}function f(a){return a.__proto__}a.super=b}(Polymer),function(a){function b(a){return a}function c(a,b){var c=typeof b;return b instanceof Date&&(c="date"),d[c](a,b)}var d={string:b,undefined:b,date:function(a){return new Date(Date.parse(a)||Date.now())},"boolean":function(a){return""===a?!0:"false"===a?!1:!!a},number:function(a){var b=parseFloat(a);return 0===b&&(b=parseInt(a)),isNaN(b)?a:b},object:function(a,b){if(null===b)return a;try{return JSON.parse(a.replace(/'/g,'"'))}catch(c){return a}},"function":function(a,b){return b}};a.deserializeValue=c}(Polymer),function(a){var b=a.extend,c={};c.declaration={},c.instance={},c.publish=function(a,c){for(var d in a)b(c,a[d])},a.api=c}(Polymer),function(a){var b={async:function(a,b,c){Platform.flush(),b=b&&b.length?b:[b];var d=function(){(this[a]||a).apply(this,b)}.bind(this),e=c?setTimeout(d,c):requestAnimationFrame(d);return c?e:~e},cancelAsync:function(a){0>a?cancelAnimationFrame(~a):clearTimeout(a)},fire:function(a,b,c,d,e){var f=c||this,b=null===b||void 0===b?{}:b,g=new CustomEvent(a,{bubbles:void 0!==d?d:!0,cancelable:void 0!==e?e:!0,detail:b});return f.dispatchEvent(g),g},asyncFire:function(){this.async("fire",arguments)},classFollows:function(a,b,c){b&&b.classList.remove(c),a&&a.classList.add(c)},injectBoundHTML:function(a,b){var c=document.createElement("template");c.innerHTML=a;var d=this.instanceTemplate(c);return b&&(b.textContent="",b.appendChild(d)),d}},c=function(){},d={};b.asyncMethod=b.async,a.api.instance.utils=b,a.nop=c,a.nob=d}(Polymer),function(a){var b=window.logFlags||{},c="on-",d={EVENT_PREFIX:c,addHostListeners:function(){var a=this.eventDelegates;b.events&&Object.keys(a).length>0&&console.log("[%s] addHostListeners:",this.localName,a);for(var c in a){var d=a[c];PolymerGestures.addEventListener(this,c,this.element.getEventHandler(this,this,d))}},dispatchMethod:function(a,c,d){if(a){b.events&&console.group("[%s] dispatch [%s]",a.localName,c);var e="function"==typeof c?c:a[c];e&&e[d?"apply":"call"](a,d),b.events&&console.groupEnd(),Platform.flush()}}};a.api.instance.events=d,a.addEventListener=function(a,b,c,d){PolymerGestures.addEventListener(wrap(a),b,c,d)},a.removeEventListener=function(a,b,c,d){PolymerGestures.removeEventListener(wrap(a),b,c,d)}}(Polymer),function(a){var b={copyInstanceAttributes:function(){var a=this._instanceAttributes;for(var b in a)this.hasAttribute(b)||this.setAttribute(b,a[b])},takeAttributes:function(){if(this._publishLC)for(var a,b=0,c=this.attributes,d=c.length;(a=c[b])&&d>b;b++)this.attributeToProperty(a.name,a.value)},attributeToProperty:function(b,c){var b=this.propertyForAttribute(b);if(b){if(c&&c.search(a.bindPattern)>=0)return;var d=this[b],c=this.deserializeValue(c,d);c!==d&&(this[b]=c)}},propertyForAttribute:function(a){var b=this._publishLC&&this._publishLC[a];return b},deserializeValue:function(b,c){return a.deserializeValue(b,c)},serializeValue:function(a,b){return"boolean"===b?a?"":void 0:"object"!==b&&"function"!==b&&void 0!==a?a:void 0},reflectPropertyToAttribute:function(a){var b=typeof this[a],c=this.serializeValue(this[a],b);void 0!==c?this.setAttribute(a,c):"boolean"===b&&this.removeAttribute(a)}};a.api.instance.attributes=b}(Polymer),function(a){function b(a,b){return a===b?0!==a||1/a===1/b:f(a)&&f(b)?!0:a!==a&&b!==b}function c(a,b){return void 0===b&&null===a?b:null===b||void 0===b?a:b}var d=window.logFlags||{},e={object:void 0,type:"update",name:void 0,oldValue:void 0},f=Number.isNaN||function(a){return"number"==typeof a&&isNaN(a)},g={createPropertyObserver:function(){var a=this._observeNames;if(a&&a.length){var b=this._propertyObserver=new CompoundObserver(!0);this.registerObserver(b);for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)b.addPath(this,c),this.observeArrayValue(c,this[c],null)}},openPropertyObserver:function(){this._propertyObserver&&this._propertyObserver.open(this.notifyPropertyChanges,this)},notifyPropertyChanges:function(a,b,c){var d,e,f={};for(var g in b)if(d=c[2*g+1],e=this.observe[d]){var h=b[g],i=a[g];this.observeArrayValue(d,i,h),f[e]||(void 0!==h&&null!==h||void 0!==i&&null!==i)&&(f[e]=!0,this.invokeMethod(e,[h,i,arguments]))}},deliverChanges:function(){this._propertyObserver&&this._propertyObserver.deliver()},propertyChanged_:function(a){this.reflect[a]&&this.reflectPropertyToAttribute(a)},observeArrayValue:function(a,b,c){var e=this.observe[a];if(e&&(Array.isArray(c)&&(d.observe&&console.log("[%s] observeArrayValue: unregister observer [%s]",this.localName,a),this.closeNamedObserver(a+"__array")),Array.isArray(b))){d.observe&&console.log("[%s] observeArrayValue: register observer [%s]",this.localName,a,b);var f=new ArrayObserver(b);f.open(function(a){this.invokeMethod(e,[a])},this),this.registerNamedObserver(a+"__array",f)}},emitPropertyChangeRecord:function(a,c,d){if(!b(c,d)&&(this.propertyChanged_(a,c,d),Observer.hasObjectObserve)){var f=this.notifier_;f||(f=this.notifier_=Object.getNotifier(this)),e.object=this,e.name=a,e.oldValue=d,f.notify(e)}},bindToAccessor:function(a,c,d){function e(b,c){j[f]=b;var d=j[h];d&&"function"==typeof d.setValue&&d.setValue(b),j.emitPropertyChangeRecord(a,b,c)}var f=a+"_",g=a+"Observable_",h=a+"ComputedBoundObservable_";this[g]=c;var i=this[f],j=this,k=c.open(e);if(d&&!b(i,k)){var l=d(i,k);b(k,l)||(k=l,c.setValue&&c.setValue(k))}e(k,i);var m={close:function(){c.close(),j[g]=void 0,j[h]=void 0}};return this.registerObserver(m),m},createComputedProperties:function(){if(this._computedNames)for(var a=0;a<this._computedNames.length;a++){var b=this._computedNames[a],c=this.computed[b];try{var d=PolymerExpressions.getExpression(c),e=d.getBinding(this,this.element.syntax);this.bindToAccessor(b,e)}catch(f){console.error("Failed to create computed property",f)}}},bindProperty:function(a,b,d){if(d)return void(this[a]=b);var e=this.element.prototype.computed;if(e&&e[a]){var f=a+"ComputedBoundObservable_";return void(this[f]=b)}return this.bindToAccessor(a,b,c)},invokeMethod:function(a,b){var c=this[a]||a;"function"==typeof c&&c.apply(this,b)},registerObserver:function(a){return this._observers?void this._observers.push(a):void(this._observers=[a])},closeObservers:function(){if(this._observers){for(var a=this._observers,b=0;b<a.length;b++){var c=a[b];c&&"function"==typeof c.close&&c.close()}this._observers=[]}},registerNamedObserver:function(a,b){var c=this._namedObservers||(this._namedObservers={});c[a]=b},closeNamedObserver:function(a){var b=this._namedObservers;return b&&b[a]?(b[a].close(),b[a]=null,!0):void 0},closeNamedObservers:function(){if(this._namedObservers){for(var a in this._namedObservers)this.closeNamedObserver(a);this._namedObservers={}}}};a.api.instance.properties=g}(Polymer),function(a){var b=window.logFlags||0,c={instanceTemplate:function(a){HTMLTemplateElement.decorate(a);for(var b=this.syntax||!a.bindingDelegate&&this.element.syntax,c=a.createInstance(this,b),d=c.bindings_,e=0;e<d.length;e++)this.registerObserver(d[e]);return c},bind:function(a,b,c){var d=this.propertyForAttribute(a);if(d){var e=this.bindProperty(d,b,c);return Platform.enableBindingsReflection&&e&&(e.path=b.path_,this._recordBinding(d,e)),this.reflect[d]&&this.reflectPropertyToAttribute(d),e}return this.mixinSuper(arguments)},bindFinished:function(){this.makeElementReady()},_recordBinding:function(a,b){this.bindings_=this.bindings_||{},this.bindings_[a]=b},asyncUnbindAll:function(){this._unbound||(b.unbind&&console.log("[%s] asyncUnbindAll",this.localName),this._unbindAllJob=this.job(this._unbindAllJob,this.unbindAll,0))},unbindAll:function(){this._unbound||(this.closeObservers(),this.closeNamedObservers(),this._unbound=!0)},cancelUnbindAll:function(){return this._unbound?void(b.unbind&&console.warn("[%s] already unbound, cannot cancel unbindAll",this.localName)):(b.unbind&&console.log("[%s] cancelUnbindAll",this.localName),void(this._unbindAllJob&&(this._unbindAllJob=this._unbindAllJob.stop())))}},d=/\{\{([^{}]*)}}/;a.bindPattern=d,a.api.instance.mdv=c}(Polymer),function(a){function b(a){return a.hasOwnProperty("PolymerBase")}function c(){}var d={PolymerBase:!0,job:function(a,b,c){if("string"!=typeof a)return Polymer.job.call(this,a,b,c);var d="___"+a;this[d]=Polymer.job.call(this,this[d],b,c)},"super":Polymer.super,created:function(){},ready:function(){},createdCallback:function(){this.templateInstance&&this.templateInstance.model&&console.warn("Attributes on "+this.localName+" were data bound prior to Polymer upgrading the element. This may result in incorrect binding types."),this.created(),this.prepareElement(),this.ownerDocument.isStagingDocument||this.makeElementReady()},prepareElement:function(){return this._elementPrepared?void console.warn("Element already prepared",this.localName):(this._elementPrepared=!0,this.shadowRoots={},this.createPropertyObserver(),this.openPropertyObserver(),this.copyInstanceAttributes(),this.takeAttributes(),void this.addHostListeners())},makeElementReady:function(){this._readied||(this._readied=!0,this.createComputedProperties(),this.parseDeclarations(this.__proto__),this.removeAttribute("unresolved"),this.ready())},attachedCallback:function(){this.cancelUnbindAll(),this.attached&&this.attached(),this.enteredView&&this.enteredView(),this.hasBeenAttached||(this.hasBeenAttached=!0,this.domReady&&this.async("domReady"))},detachedCallback:function(){this.preventDispose||this.asyncUnbindAll(),this.detached&&this.detached(),this.leftView&&this.leftView()},enteredViewCallback:function(){this.attachedCallback()},leftViewCallback:function(){this.detachedCallback()},enteredDocumentCallback:function(){this.attachedCallback()},leftDocumentCallback:function(){this.detachedCallback()},parseDeclarations:function(a){a&&a.element&&(this.parseDeclarations(a.__proto__),a.parseDeclaration.call(this,a.element))},parseDeclaration:function(a){var b=this.fetchTemplate(a);if(b){var c=this.shadowFromTemplate(b);this.shadowRoots[a.name]=c}},fetchTemplate:function(a){return a.querySelector("template")},shadowFromTemplate:function(a){if(a){var b=this.createShadowRoot(),c=this.instanceTemplate(a);return b.appendChild(c),this.shadowRootReady(b,a),b}},lightFromTemplate:function(a,b){if(a){this.eventController=this;var c=this.instanceTemplate(a);return b?this.insertBefore(c,b):this.appendChild(c),this.shadowRootReady(this),c}},shadowRootReady:function(a){this.marshalNodeReferences(a)},marshalNodeReferences:function(a){var b=this.$=this.$||{};if(a)for(var c,d=a.querySelectorAll("[id]"),e=0,f=d.length;f>e&&(c=d[e]);e++)b[c.id]=c},attributeChangedCallback:function(a){"class"!==a&&"style"!==a&&this.attributeToProperty(a,this.getAttribute(a)),this.attributeChanged&&this.attributeChanged.apply(this,arguments)},onMutation:function(a,b){var c=new MutationObserver(function(a){b.call(this,c,a),c.disconnect()}.bind(this));c.observe(a,{childList:!0,subtree:!0})}};c.prototype=d,d.constructor=c,a.Base=c,a.isBase=b,a.api.instance.base=d}(Polymer),function(a){function b(a){return a.__proto__}function c(a,b){var c="",d=!1;b&&(c=b.localName,d=b.hasAttribute("is"));var e=Platform.ShadowCSS.makeScopeSelector(c,d);return Platform.ShadowCSS.shimCssText(a,e)}var d=(window.logFlags||{},window.ShadowDOMPolyfill),e="element",f="controller",g={STYLE_SCOPE_ATTRIBUTE:e,installControllerStyles:function(){var a=this.findStyleScope();if(a&&!this.scopeHasNamedStyle(a,this.localName)){for(var c=b(this),d="";c&&c.element;)d+=c.element.cssTextForScope(f),c=b(c);d&&this.installScopeCssText(d,a)}},installScopeStyle:function(a,b,c){var c=c||this.findStyleScope(),b=b||"";if(c&&!this.scopeHasNamedStyle(c,this.localName+b)){var d="";if(a instanceof Array)for(var e,f=0,g=a.length;g>f&&(e=a[f]);f++)d+=e.textContent+"\n\n";else d=a.textContent;this.installScopeCssText(d,c,b)}},installScopeCssText:function(a,b,e){if(b=b||this.findStyleScope(),e=e||"",b){d&&(a=c(a,b.host));var g=this.element.cssTextToScopeStyle(a,f);Polymer.applyStyleToScope(g,b),this.styleCacheForScope(b)[this.localName+e]=!0}},findStyleScope:function(a){for(var b=a||this;b.parentNode;)b=b.parentNode;return b},scopeHasNamedStyle:function(a,b){var c=this.styleCacheForScope(a);
return c[b]},styleCacheForScope:function(a){if(d){var b=a.host?a.host.localName:a.localName;return h[b]||(h[b]={})}return a._scopeStyles=a._scopeStyles||{}}},h={};a.api.instance.styles=g}(Polymer),function(a){function b(a,b){if("string"!=typeof a){var c=b||document._currentScript;if(b=a,a=c&&c.parentNode&&c.parentNode.getAttribute?c.parentNode.getAttribute("name"):"",!a)throw"Element name could not be inferred."}if(f(a))throw"Already registered (Polymer) prototype for element "+a;e(a,b),d(a)}function c(a,b){i[a]=b}function d(a){i[a]&&(i[a].registerWhenReady(),delete i[a])}function e(a,b){return j[a]=b||{}}function f(a){return j[a]}function g(a,b){if("string"!=typeof b)return!1;var c=HTMLElement.getPrototypeForTag(b),d=c&&c.constructor;return d?CustomElements.instanceof?CustomElements.instanceof(a,d):a instanceof d:!1}var h=a.extend,i=(a.api,{}),j={};a.getRegisteredPrototype=f,a.waitingForPrototype=c,a.instanceOfType=g,window.Polymer=b,h(Polymer,a),Platform.consumeDeclarations&&Platform.consumeDeclarations(function(a){if(a)for(var c,d=0,e=a.length;e>d&&(c=a[d]);d++)b.apply(null,c)})}(Polymer),function(a){var b={resolveElementPaths:function(a){Polymer.urlResolver.resolveDom(a)},addResolvePathApi:function(){var a=this.getAttribute("assetpath")||"",b=new URL(a,this.ownerDocument.baseURI);this.prototype.resolvePath=function(a,c){var d=new URL(a,c||b);return d.href}}};a.api.declaration.path=b}(Polymer),function(a){function b(a,b){var c=new URL(a.getAttribute("href"),b).href;return"@import '"+c+"';"}function c(a,b){if(a){b===document&&(b=document.head),i&&(b=document.head);var c=d(a.textContent),e=a.getAttribute(h);e&&c.setAttribute(h,e);var f=b.firstElementChild;if(b===document.head){var g="style["+h+"]",j=document.head.querySelectorAll(g);j.length&&(f=j[j.length-1].nextElementSibling)}b.insertBefore(c,f)}}function d(a,b){b=b||document,b=b.createElement?b:b.ownerDocument;var c=b.createElement("style");return c.textContent=a,c}function e(a){return a&&a.__resource||""}function f(a,b){return q?q.call(a,b):void 0}var g=(window.logFlags||{},a.api.instance.styles),h=g.STYLE_SCOPE_ATTRIBUTE,i=window.ShadowDOMPolyfill,j="style",k="@import",l="link[rel=stylesheet]",m="global",n="polymer-scope",o={loadStyles:function(a){var b=this.fetchTemplate(),c=b&&this.templateContent();if(c){this.convertSheetsToStyles(c);var d=this.findLoadableStyles(c);if(d.length){var e=b.ownerDocument.baseURI;return Polymer.styleResolver.loadStyles(d,e,a)}}a&&a()},convertSheetsToStyles:function(a){for(var c,e,f=a.querySelectorAll(l),g=0,h=f.length;h>g&&(c=f[g]);g++)e=d(b(c,this.ownerDocument.baseURI),this.ownerDocument),this.copySheetAttributes(e,c),c.parentNode.replaceChild(e,c)},copySheetAttributes:function(a,b){for(var c,d=0,e=b.attributes,f=e.length;(c=e[d])&&f>d;d++)"rel"!==c.name&&"href"!==c.name&&a.setAttribute(c.name,c.value)},findLoadableStyles:function(a){var b=[];if(a)for(var c,d=a.querySelectorAll(j),e=0,f=d.length;f>e&&(c=d[e]);e++)c.textContent.match(k)&&b.push(c);return b},installSheets:function(){this.cacheSheets(),this.cacheStyles(),this.installLocalSheets(),this.installGlobalStyles()},cacheSheets:function(){this.sheets=this.findNodes(l),this.sheets.forEach(function(a){a.parentNode&&a.parentNode.removeChild(a)})},cacheStyles:function(){this.styles=this.findNodes(j+"["+n+"]"),this.styles.forEach(function(a){a.parentNode&&a.parentNode.removeChild(a)})},installLocalSheets:function(){var a=this.sheets.filter(function(a){return!a.hasAttribute(n)}),b=this.templateContent();if(b){var c="";if(a.forEach(function(a){c+=e(a)+"\n"}),c){var f=d(c,this.ownerDocument);b.insertBefore(f,b.firstChild)}}},findNodes:function(a,b){var c=this.querySelectorAll(a).array(),d=this.templateContent();if(d){var e=d.querySelectorAll(a).array();c=c.concat(e)}return b?c.filter(b):c},installGlobalStyles:function(){var a=this.styleForScope(m);c(a,document.head)},cssTextForScope:function(a){var b="",c="["+n+"="+a+"]",d=function(a){return f(a,c)},g=this.sheets.filter(d);g.forEach(function(a){b+=e(a)+"\n\n"});var h=this.styles.filter(d);return h.forEach(function(a){b+=a.textContent+"\n\n"}),b},styleForScope:function(a){var b=this.cssTextForScope(a);return this.cssTextToScopeStyle(b,a)},cssTextToScopeStyle:function(a,b){if(a){var c=d(a);return c.setAttribute(h,this.getAttribute("name")+"-"+b),c}}},p=HTMLElement.prototype,q=p.matches||p.matchesSelector||p.webkitMatchesSelector||p.mozMatchesSelector;a.api.declaration.styles=o,a.applyStyleToScope=c}(Polymer),function(a){var b=(window.logFlags||{},a.api.instance.events),c=b.EVENT_PREFIX,d={};["webkitAnimationStart","webkitAnimationEnd","webkitTransitionEnd","DOMFocusOut","DOMFocusIn","DOMMouseScroll"].forEach(function(a){d[a.toLowerCase()]=a});var e={parseHostEvents:function(){var a=this.prototype.eventDelegates;this.addAttributeDelegates(a)},addAttributeDelegates:function(a){for(var b,c=0;b=this.attributes[c];c++)this.hasEventPrefix(b.name)&&(a[this.removeEventPrefix(b.name)]=b.value.replace("{{","").replace("}}","").trim())},hasEventPrefix:function(a){return a&&"o"===a[0]&&"n"===a[1]&&"-"===a[2]},removeEventPrefix:function(a){return a.slice(f)},findController:function(a){for(;a.parentNode;){if(a.eventController)return a.eventController;a=a.parentNode}return a.host},getEventHandler:function(a,b,c){var d=this;return function(e){a&&a.PolymerBase||(a=d.findController(b));var f=[e,e.detail,e.currentTarget];a.dispatchMethod(a,c,f)}},prepareEventBinding:function(a,b){if(this.hasEventPrefix(b)){var c=this.removeEventPrefix(b);c=d[c]||c;var e=this;return function(b,d,f){function g(){return"{{ "+a+" }}"}var h=e.getEventHandler(void 0,d,a);return PolymerGestures.addEventListener(d,c,h),f?void 0:{open:g,discardChanges:g,close:function(){PolymerGestures.removeEventListener(d,c,h)}}}}}},f=c.length;a.api.declaration.events=e}(Polymer),function(a){var b={inferObservers:function(a){var b,c=a.observe;for(var d in a)"Changed"===d.slice(-7)&&(c||(c=a.observe={}),b=d.slice(0,-7),c[b]=c[b]||d)},explodeObservers:function(a){var b=a.observe;if(b){var c={};for(var d in b)for(var e,f=d.split(" "),g=0;e=f[g];g++)c[e]=b[d];a.observe=c}},optimizePropertyMaps:function(a){if(a.observe){var b=a._observeNames=[];for(var c in a.observe)for(var d,e=c.split(" "),f=0;d=e[f];f++)b.push(d)}if(a.publish){var b=a._publishNames=[];for(var c in a.publish)b.push(c)}if(a.computed){var b=a._computedNames=[];for(var c in a.computed)b.push(c)}},publishProperties:function(a,b){var c=a.publish;c&&(this.requireProperties(c,a,b),a._publishLC=this.lowerCaseMap(c))},requireProperties:function(a,b){b.reflect=b.reflect||{};for(var c in a){var d=a[c];d&&void 0!==d.reflect&&(b.reflect[c]=Boolean(d.reflect),d=d.value),void 0!==d&&(b[c]=d)}},lowerCaseMap:function(a){var b={};for(var c in a)b[c.toLowerCase()]=c;return b},createPropertyAccessor:function(a,b){var c=this.prototype,d=a+"_",e=a+"Observable_";c[d]=c[a],Object.defineProperty(c,a,{get:function(){var a=this[e];return a&&a.deliver(),this[d]},set:function(c){if(b)return this[d];var f=this[e];if(f)return void f.setValue(c);var g=this[d];return this[d]=c,this.emitPropertyChangeRecord(a,c,g),c},configurable:!0})},createPropertyAccessors:function(a){var b=a._computedNames;if(b&&b.length)for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)this.createPropertyAccessor(c,!0);var b=a._publishNames;if(b&&b.length)for(var c,d=0,e=b.length;e>d&&(c=b[d]);d++)a.computed&&a.computed[c]||this.createPropertyAccessor(c)}};a.api.declaration.properties=b}(Polymer),function(a){var b="attributes",c=/\s|,/,d={inheritAttributesObjects:function(a){this.inheritObject(a,"publishLC"),this.inheritObject(a,"_instanceAttributes")},publishAttributes:function(a){var d=this.getAttribute(b);if(d)for(var e,f=a.publish||(a.publish={}),g=d.split(c),h=0,i=g.length;i>h;h++)e=g[h].trim(),e&&void 0===f[e]&&(f[e]=void 0)},accumulateInstanceAttributes:function(){for(var a,b=this.prototype._instanceAttributes,c=this.attributes,d=0,e=c.length;e>d&&(a=c[d]);d++)this.isInstanceAttribute(a.name)&&(b[a.name]=a.value)},isInstanceAttribute:function(a){return!this.blackList[a]&&"on-"!==a.slice(0,3)},blackList:{name:1,"extends":1,constructor:1,noscript:1,assetpath:1,"cache-csstext":1}};d.blackList[b]=1,a.api.declaration.attributes=d}(Polymer),function(a){var b=a.api.declaration.events,c=new PolymerExpressions,d=c.prepareBinding;c.prepareBinding=function(a,e,f){return b.prepareEventBinding(a,e,f)||d.call(c,a,e,f)};var e={syntax:c,fetchTemplate:function(){return this.querySelector("template")},templateContent:function(){var a=this.fetchTemplate();return a&&a.content},installBindingDelegate:function(a){a&&(a.bindingDelegate=this.syntax)}};a.api.declaration.mdv=e}(Polymer),function(a){function b(a){if(!Object.__proto__){var b=Object.getPrototypeOf(a);a.__proto__=b,d(b)&&(b.__proto__=Object.getPrototypeOf(b))}}var c=a.api,d=a.isBase,e=a.extend,f=window.ShadowDOMPolyfill,g={register:function(a,b){this.buildPrototype(a,b),this.registerPrototype(a,b),this.publishConstructor()},buildPrototype:function(b,c){var d=a.getRegisteredPrototype(b),e=this.generateBasePrototype(c);this.desugarBeforeChaining(d,e),this.prototype=this.chainPrototypes(d,e),this.desugarAfterChaining(b,c)},desugarBeforeChaining:function(a,b){a.element=this,this.publishAttributes(a,b),this.publishProperties(a,b),this.inferObservers(a),this.explodeObservers(a)},chainPrototypes:function(a,c){this.inheritMetaData(a,c);var d=this.chainObject(a,c);return b(d),d},inheritMetaData:function(a,b){this.inheritObject("observe",a,b),this.inheritObject("publish",a,b),this.inheritObject("reflect",a,b),this.inheritObject("_publishLC",a,b),this.inheritObject("_instanceAttributes",a,b),this.inheritObject("eventDelegates",a,b)},desugarAfterChaining:function(a,b){this.optimizePropertyMaps(this.prototype),this.createPropertyAccessors(this.prototype),this.installBindingDelegate(this.fetchTemplate()),this.installSheets(),this.resolveElementPaths(this),this.accumulateInstanceAttributes(),this.parseHostEvents(),this.addResolvePathApi(),f&&Platform.ShadowCSS.shimStyling(this.templateContent(),a,b),this.prototype.registerCallback&&this.prototype.registerCallback(this)},publishConstructor:function(){var a=this.getAttribute("constructor");a&&(window[a]=this.ctor)},generateBasePrototype:function(a){var b=this.findBasePrototype(a);if(!b){var b=HTMLElement.getPrototypeForTag(a);b=this.ensureBaseApi(b),h[a]=b}return b},findBasePrototype:function(a){return h[a]},ensureBaseApi:function(a){if(a.PolymerBase)return a;var b=Object.create(a);return c.publish(c.instance,b),this.mixinMethod(b,a,c.instance.mdv,"bind"),b},mixinMethod:function(a,b,c,d){var e=function(a){return b[d].apply(this,a)};a[d]=function(){return this.mixinSuper=e,c[d].apply(this,arguments)}},inheritObject:function(a,b,c){var d=b[a]||{};b[a]=this.chainObject(d,c[a])},registerPrototype:function(a,b){var c={prototype:this.prototype},d=this.findTypeExtension(b);d&&(c.extends=d),HTMLElement.register(a,this.prototype),this.ctor=document.registerElement(a,c)},findTypeExtension:function(a){if(a&&a.indexOf("-")<0)return a;var b=this.findBasePrototype(a);return b.element?this.findTypeExtension(b.element.extends):void 0}},h={};g.chainObject=Object.__proto__?function(a,b){return a&&b&&a!==b&&(a.__proto__=b),a}:function(a,b){if(a&&b&&a!==b){var c=Object.create(b);a=e(c,a)}return a},c.declaration.prototype=g}(Polymer),function(a){function b(a){return document.contains(a)?j:i}function c(){return i.length?i[0]:j[0]}function d(a){f.waitToReady=!0,Platform.endOfMicrotask(function(){HTMLImports.whenReady(function(){f.addReadyCallback(a),f.waitToReady=!1,f.check()})})}function e(a){if(void 0===a)return void f.ready();var b=setTimeout(function(){f.ready()},a);Polymer.whenReady(function(){clearTimeout(b)})}var f={wait:function(a){a.__queue||(a.__queue={},g.push(a))},enqueue:function(a,c,d){var e=a.__queue&&!a.__queue.check;return e&&(b(a).push(a),a.__queue.check=c,a.__queue.go=d),0!==this.indexOf(a)},indexOf:function(a){var c=b(a).indexOf(a);return c>=0&&document.contains(a)&&(c+=HTMLImports.useNative||HTMLImports.ready?i.length:1e9),c},go:function(a){var b=this.remove(a);b&&(a.__queue.flushable=!0,this.addToFlushQueue(b),this.check())},remove:function(a){var c=this.indexOf(a);if(0===c)return b(a).shift()},check:function(){var a=this.nextElement();return a&&a.__queue.check.call(a),this.canReady()?(this.ready(),!0):void 0},nextElement:function(){return c()},canReady:function(){return!this.waitToReady&&this.isEmpty()},isEmpty:function(){for(var a,b=0,c=g.length;c>b&&(a=g[b]);b++)if(a.__queue&&!a.__queue.flushable)return;return!0},addToFlushQueue:function(a){h.push(a)},flush:function(){if(!this.flushing){this.flushing=!0;for(var a;h.length;)a=h.shift(),a.__queue.go.call(a),a.__queue=null;this.flushing=!1}},ready:function(){var a=CustomElements.ready;CustomElements.ready=!1,this.flush(),CustomElements.useNative||CustomElements.upgradeDocumentTree(document),CustomElements.ready=a,Platform.flush(),requestAnimationFrame(this.flushReadyCallbacks)},addReadyCallback:function(a){a&&k.push(a)},flushReadyCallbacks:function(){if(k)for(var a;k.length;)(a=k.shift())()},waitingFor:function(){for(var a,b=[],c=0,d=g.length;d>c&&(a=g[c]);c++)a.__queue&&!a.__queue.flushable&&b.push(a);return b},waitToReady:!0},g=[],h=[],i=[],j=[],k=[];a.elements=g,a.waitingFor=f.waitingFor.bind(f),a.forceReady=e,a.queue=f,a.whenReady=a.whenPolymerReady=d}(Polymer),function(a){function b(a){return Boolean(HTMLElement.getPrototypeForTag(a))}function c(a){return a&&a.indexOf("-")>=0}var d=a.extend,e=a.api,f=a.queue,g=a.whenReady,h=a.getRegisteredPrototype,i=a.waitingForPrototype,j=d(Object.create(HTMLElement.prototype),{createdCallback:function(){this.getAttribute("name")&&this.init()},init:function(){this.name=this.getAttribute("name"),this.extends=this.getAttribute("extends"),f.wait(this),this.loadResources(),this.registerWhenReady()},registerWhenReady:function(){this.registered||this.waitingForPrototype(this.name)||this.waitingForQueue()||this.waitingForResources()||f.go(this)},_register:function(){c(this.extends)&&!b(this.extends)&&console.warn("%s is attempting to extend %s, an unregistered element or one that was not registered with Polymer.",this.name,this.extends),this.register(this.name,this.extends),this.registered=!0},waitingForPrototype:function(a){return h(a)?void 0:(i(a,this),this.handleNoScript(a),!0)},handleNoScript:function(a){this.hasAttribute("noscript")&&!this.noscript&&(this.noscript=!0,Polymer(a))},waitingForResources:function(){return this._needsResources},waitingForQueue:function(){return f.enqueue(this,this.registerWhenReady,this._register)},loadResources:function(){this._needsResources=!0,this.loadStyles(function(){this._needsResources=!1,this.registerWhenReady()}.bind(this))}});e.publish(e.declaration,j),g(function(){document.body.removeAttribute("unresolved"),document.dispatchEvent(new CustomEvent("polymer-ready",{bubbles:!0}))}),document.registerElement("polymer-element",{prototype:j})}(Polymer),function(a){function b(a,b){a?(document.head.appendChild(a),d(b)):b&&b()}function c(a,c){if(a&&a.length){for(var d,e,f=document.createDocumentFragment(),g=0,h=a.length;h>g&&(d=a[g]);g++)e=document.createElement("link"),e.rel="import",e.href=d,f.appendChild(e);b(f,c)}else c&&c()}var d=a.whenPolymerReady;a.import=c,a.importElements=b}(Polymer),function(){var a=document.createElement("polymer-element");a.setAttribute("name","auto-binding"),a.setAttribute("extends","template"),a.init(),Polymer("auto-binding",{createdCallback:function(){this.syntax=this.bindingDelegate=this.makeSyntax(),Polymer.whenPolymerReady(function(){this.model=this,this.setAttribute("bind",""),this.async(function(){this.marshalNodeReferences(this.parentNode),this.fire("template-bound")})}.bind(this))},makeSyntax:function(){var a=Object.create(Polymer.api.declaration.events),b=this;a.findController=function(){return b.model};var c=new PolymerExpressions,d=c.prepareBinding;return c.prepareBinding=function(b,e,f){return a.prepareEventBinding(b,e,f)||d.call(c,b,e,f)},c}})}();
//# sourceMappingURL=polymer.js.map;

    Polymer('x-jumbotron', {

    });
  ;

    Polymer('x-link', {

      base: '',

      ready: function () {
        this.addEventListener('click', this.prevent, false);
      },

      sameOrigin: function (href) {
        var origin = location.protocol + '//' + location.hostname;
        if (location.port) origin += ':' + location.port;
        return 0 == href.indexOf(origin);
      },

      prevent: function (event, detail, sender) {
        // sender should be event.target
        var el = event.target;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if (el.pathname == location.pathname && (el.hash || '#' == link)) return;

        // Check for mailto: in the href
        if (link.indexOf("mailto:") > -1) return;

        // check target
        if (el.target) return;

        // x-origin
        if (!this.sameOrigin(el.href)) return;

        // rebuild path
        var path = el.pathname + el.search + (el.hash || '');

        // same page
        var orig = path + el.hash;

        path = path.replace(this.base, '');
        if (this.base && orig == path) return;

        event.preventDefault();
        this.fire('click link', orig);
      }

    });
  ;

    Polymer('x-header', {

      scroll_trap: 100,

      ready: function () {
        this.on_scroll = this.on_scroll.bind(this);
        this.request_tick = this.request_tick.bind(this);
        this.update_scroll = this.update_scroll.bind(this);
        this.on_scroll();
        window.addEventListener('scroll', this.on_scroll, false);
      },

      on_click_button: function (event) {
        this.$.collapse.classList.toggle('in');
      },

      on_scroll: function () {
        this.previousScrollY = this.latestKnownScrollY;
        // IE10 only supports pageYOffset 
        this.latestKnownScrollY = window.scrollY || window.pageYOffset;
        this.request_tick();
      },

      request_tick: function () {
        if (!this.ticking) {
          window.requestAnimationFrame(this.update_scroll);
        }
        this.ticking = true;
      },

      update_scroll: function () {
        this.ticking = false;
        var currentScrollY = this.latestKnownScrollY;
        if (currentScrollY > this.scroll_trap) {
          this.$.navbar.classList.add('scrolled');
        } else {
          this.$.navbar.classList.remove('scrolled');
        }
      }

    });
  ;

    Polymer('part-header', {

      brand: {
        label: 'HackFaber',
        url: '/'
      },

      links: [
        {
          label: 'programma e metodo',
          url: '/program'
        },
        {
          label: 'motivazioni e numeri',
          url: '/faber'
        },
        {
          label: 'storia e team',
          url: '/team'
        }
      ]

    });
  ;

    Polymer('part-footer', {

    });
  ;


    Polymer('core-xhr', {

      /**
       * Sends a HTTP request to the server and returns the XHR object.
       *
       * @method request
       * @param {Object} inOptions
       *    @param {String} inOptions.url The url to which the request is sent.
       *    @param {String} inOptions.method The HTTP method to use, default is GET.
       *    @param {boolean} inOptions.sync By default, all requests are sent asynchronously. To send synchronous requests, set to true.
       *    @param {Object} inOptions.params Data to be sent to the server.
       *    @param {Object} inOptions.body The content for the request body for POST method.
       *    @param {Object} inOptions.headers HTTP request headers.
       *    @param {String} inOptions.responseType The response type. Default is 'text'.
       *    @param {boolean} inOptions.withCredentials Whether or not to send credentials on the request. Default is false.
       *    @param {Object} inOptions.callback Called when request is completed.
       * @returns {Object} XHR object.
       */
      request: function(options) {
        var xhr = new XMLHttpRequest();
        var url = options.url;
        var method = options.method || 'GET';
        var async = !options.sync;
        //
        var params = this.toQueryString(options.params);
        if (params && method == 'GET') {
          url += (url.indexOf('?') > 0 ? '&' : '?') + params;
        }
        var xhrParams = this.isBodyMethod(method) ? (options.body || params) : null;
        //
        xhr.open(method, url, async);
        if (options.responseType) {
          xhr.responseType = options.responseType;
        }
        if (options.withCredentials) {
          xhr.withCredentials = true;
        }
        this.makeReadyStateHandler(xhr, options.callback);
        this.setRequestHeaders(xhr, options.headers);
        xhr.send(xhrParams);
        if (!async) {
          xhr.onreadystatechange(xhr);
        }
        return xhr;
      },
    
      toQueryString: function(params) {
        var r = [];
        for (var n in params) {
          var v = params[n];
          n = encodeURIComponent(n);
          r.push(v == null ? n : (n + '=' + encodeURIComponent(v)));
        }
        return r.join('&');
      },

      isBodyMethod: function(method) {
        return this.bodyMethods[(method || '').toUpperCase()];
      },
      
      bodyMethods: {
        POST: 1,
        PUT: 1,
        DELETE: 1
      },

      makeReadyStateHandler: function(xhr, callback) {
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            callback && callback.call(null, xhr.response, xhr);
          }
        };
      },

      setRequestHeaders: function(xhr, headers) {
        if (headers) {
          for (var name in headers) {
            xhr.setRequestHeader(name, headers[name]);
          }
        }
      }

    });

  ;


  Polymer('core-ajax', {
    /**
     * Fired when a response is received.
     *
     * @event core-response
     */

    /**
     * Fired when an error is received.
     *
     * @event core-error
     */

    /**
     * Fired whenever a response or an error is received.
     *
     * @event core-complete
     */

    /**
     * The URL target of the request.
     *
     * @attribute url
     * @type string
     * @default ''
     */
    url: '',

    /**
     * Specifies what data to store in the `response` property, and
     * to deliver as `event.response` in `response` events.
     *
     * One of:
     *
     *    `text`: uses `XHR.responseText`.
     *
     *    `xml`: uses `XHR.responseXML`.
     *
     *    `json`: uses `XHR.responseText` parsed as JSON.
     *
     *    `arraybuffer`: uses `XHR.response`.
     *
     *    `blob`: uses `XHR.response`.
     *
     *    `document`: uses `XHR.response`.
     *
     * @attribute handleAs
     * @type string
     * @default 'text'
     */
    handleAs: '',

    /**
     * If true, automatically performs an Ajax request when either `url` or `params` changes.
     *
     * @attribute auto
     * @type boolean
     * @default false
     */
    auto: false,

    /**
     * Parameters to send to the specified URL, as JSON.
     *
     * @attribute params
     * @type string (JSON)
     * @default ''
     */
    params: '',

    /**
     * The response for the most recently made request, or null if it hasn't
     * completed yet or the request resulted in error.
     *
     * @attribute response
     * @type Object
     * @default null
     */
    response: null,

    /**
     * The error for the most recently made request, or null if it hasn't
     * completed yet or the request resulted in success.
     *
     * @attribute error
     * @type Object
     * @default null
     */
    error: null,

    /**
     * The HTTP method to use such as 'GET', 'POST', 'PUT', or 'DELETE'.
     * Default is 'GET'.
     *
     * @attribute method
     * @type string
     * @default ''
     */
    method: '',

    /**
     * HTTP request headers to send.
     *
     * Example:
     *
     *     <core-ajax
     *         auto
     *         url="http://somesite.com"
     *         headers='{"X-Requested-With": "XMLHttpRequest"}'
     *         handleAs="json"
     *         on-core-response="{{handleResponse}}"></core-ajax>
     *
     * @attribute headers
     * @type Object
     * @default null
     */
    headers: null,

    /**
     * Optional raw body content to send when method === "POST".
     *
     * Example:
     *
     *     <core-ajax method="POST" auto url="http://somesite.com"
     *         body='{"foo":1, "bar":2}'>
     *     </core-ajax>
     *
     * @attribute body
     * @type Object
     * @default null
     */
    body: null,

    /**
     * Content type to use when sending data.
     *
     * @attribute contentType
     * @type string
     * @default 'application/x-www-form-urlencoded'
     */
    contentType: 'application/x-www-form-urlencoded',

    /**
     * Set the withCredentials flag on the request.
     *
     * @attribute withCredentials
     * @type boolean
     * @default false
     */
    withCredentials: false,

    /**
     * Additional properties to send to core-xhr.
     *
     * Can be set to an object containing default properties
     * to send as arguments to the `core-xhr.request()` method
     * which implements the low-level communication.
     *
     * @property xhrArgs
     * @type Object
     * @default null
     */
    xhrArgs: null,

    ready: function() {
      this.xhr = document.createElement('core-xhr');
    },

    receive: function(response, xhr) {
      if (this.isSuccess(xhr)) {
        this.processResponse(xhr);
      } else {
        this.processError(xhr);
      }
      this.complete(xhr);
    },

    isSuccess: function(xhr) {
      var status = xhr.status || 0;
      return !status || (status >= 200 && status < 300);
    },

    processResponse: function(xhr) {
      var response = this.evalResponse(xhr);
      if (xhr === this.activeRequest) {
        this.response = response;
      }
      this.fire('core-response', {response: response, xhr: xhr});
    },

    processError: function(xhr) {
      var response = xhr.status + ': ' + xhr.responseText;
      if (xhr === this.activeRequest) {
        this.error = response;
      }
      this.fire('core-error', {response: response, xhr: xhr});
    },

    complete: function(xhr) {
      this.fire('core-complete', {response: xhr.status, xhr: xhr});
    },

    evalResponse: function(xhr) {
      return this[(this.handleAs || 'text') + 'Handler'](xhr);
    },

    xmlHandler: function(xhr) {
      return xhr.responseXML;
    },

    textHandler: function(xhr) {
      return xhr.responseText;
    },

    jsonHandler: function(xhr) {
      var r = xhr.responseText;
      try {
        return JSON.parse(r);
      } catch (x) {
        console.warn('core-ajax caught an exception trying to parse response as JSON:');
        console.warn('url:', this.url);
        console.warn(x);
        return r;
      }
    },

    documentHandler: function(xhr) {
      return xhr.response;
    },

    blobHandler: function(xhr) {
      return xhr.response;
    },

    arraybufferHandler: function(xhr) {
      return xhr.response;
    },

    urlChanged: function() {
      if (!this.handleAs) {
        var ext = String(this.url).split('.').pop();
        switch (ext) {
          case 'json':
            this.handleAs = 'json';
            break;
        }
      }
      this.autoGo();
    },

    paramsChanged: function() {
      this.autoGo();
    },

    autoChanged: function() {
      this.autoGo();
    },

    // TODO(sorvell): multiple side-effects could call autoGo
    // during one micro-task, use a job to have only one action
    // occur
    autoGo: function() {
      if (this.auto) {
        this.goJob = this.job(this.goJob, this.go, 0);
      }
    },

    /**
     * Performs an Ajax request to the specified URL.
     *
     * @method go
     */
    go: function() {
      var args = this.xhrArgs || {};
      // TODO(sjmiles): we may want XHR to default to POST if body is set
      args.body = this.body || args.body;
      args.params = this.params || args.params;
      if (args.params && typeof(args.params) == 'string') {
        args.params = JSON.parse(args.params);
      }
      args.headers = this.headers || args.headers || {};
      if (args.headers && typeof(args.headers) == 'string') {
        args.headers = JSON.parse(args.headers);
      }
      var hasContentType = Object.keys(args.headers).some(function (header) {
        return header.toLowerCase() === 'content-type';
      });
      if (!hasContentType && this.contentType) {
        args.headers['Content-Type'] = this.contentType;
      }
      if (this.handleAs === 'arraybuffer' || this.handleAs === 'blob' ||
          this.handleAs === 'document') {
        args.responseType = this.handleAs;
      }
      args.withCredentials = this.withCredentials;
      args.callback = this.receive.bind(this);
      args.url = this.url;
      args.method = this.method;

      this.response = this.error = null;
      this.activeRequest = args.url && this.xhr.request(args);
      return this.activeRequest;
    }

  });

;


    Polymer('core-input', {
      publish: {
        /**
         * Placeholder text that hints to the user what can be entered in
         * the input.
         *
         * @attribute placeholder
         * @type string
         * @default ''
         */
        placeholder: '',
  
        /**
         * If true, this input cannot be focused and the user cannot change
         * its value.
         *
         * @attribute disabled
         * @type boolean
         * @default false
         */
        disabled: false,
  
        /**
         * If true, the user cannot modify the value of the input.
         *
         * @attribute readonly
         * @type boolean
         * @default false
         */
        readonly: false,

        /**
         * If true, this input will automatically gain focus on page load.
         *
         * @attribute autofocus
         * @type boolean
         * @default false
         */
        autofocus: false,

        /**
         * If true, this input accepts multi-line input like a `<textarea>`
         *
         * @attribute multiline
         * @type boolean
         * @default false
         */
        multiline: false,
  
        /**
         * (multiline only) The height of this text input in rows. The input
         * will scroll internally if more input is entered beyond the size
         * of the component. This property is meaningless if multiline is
         * false. You can also set this property to "fit" and size the
         * component with CSS to make the input fit the CSS size.
         *
         * @attribute rows
         * @type number|'fit'
         * @default 'fit'
         */
        rows: 'fit',
  
        /**
         * The current value of this input. Changing inputValue programmatically
         * will cause value to be out of sync. Instead, change value directly
         * or call commit() after changing inputValue.
         *
         * @attribute inputValue
         * @type string
         * @default ''
         */
        inputValue: '',
  
        /**
         * The value of the input committed by the user, either by changing the
         * inputValue and blurring the input, or by hitting the `enter` key.
         *
         * @attribute value
         * @type string
         * @default ''
         */
        value: '',

        /**
         * Set the input type. Not supported for `multiline`.
         *
         * @attribute type
         * @type string
         * @default text
         */
        type: 'text',

        /**
         * If true, the input is invalid if its value is null.
         *
         * @attribute required
         * @type boolean
         * @default false
         */
        required: false,

        /**
         * A regular expression to validate the input value against. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute pattern
         * @type string
         * @default '.*'
         */
        // FIXME(yvonne): The default is set to .* because we can't bind to pattern such
        // that the attribute is unset if pattern is null.
        pattern: '.*',

        /**
         * If set, the input is invalid if the value is less than this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute min
         */
        min: null,

        /**
         * If set, the input is invalid if the value is greater than this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute max
         */
        max: null,

        /**
         * If set, the input is invalid if the value is not `min` plus an integral multiple
         * of this property. See
         * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes
         * for more info. Not supported if `multiline` is true.
         *
         * @attribute step
         */
        step: null,

        /**
         * The maximum length of the input value.
         *
         * @attribute maxlength
         * @type number
         */
        maxlength: null,
  
        /**
         * If this property is true, the text input's inputValue failed validation.
         *
         * @attribute invalid
         * @type boolean
         * @default false
         */
        invalid: false,

        /**
         * If this property is true, validate the input as they are entered.
         *
         * @attribute validateImmediately
         * @type boolean
         * @default true
         */
        validateImmediately: true
      },

      ready: function() {
        this.handleTabindex(this.getAttribute('tabindex'));
      },

      disabledChanged: function() {
        if (this.disabled) {
          this.setAttribute('aria-disabled', true);
        } else {
          this.removeAttribute('aria-disabled');
        }
      },

      invalidChanged: function() {
        this.classList.toggle('invalid', this.invalid);
        this.fire('input-'+ (this.invalid ? 'invalid' : 'valid'), {value: this.inputValue});
      },

      inputValueChanged: function() {
        if (this.validateImmediately) {
          this.updateValidity_();
        }
      },

      valueChanged: function() {
        this.inputValue = this.value;
      },

      requiredChanged: function() {
        if (this.validateImmediately) {
          this.updateValidity_();
        }
      },

      attributeChanged: function(attr, oldVal, curVal) {
        if (attr === 'tabindex') {
          this.handleTabindex(curVal);
        }
      },

      handleTabindex: function(tabindex) {
        if (tabindex > 0) {
          this.$.input.setAttribute('tabindex', -1);
        } else {
          this.$.input.removeAttribute('tabindex');
        }
      },

      /**
       * Commits the inputValue to value.
       *
       * @method commit
       */
      commit: function() {
         this.value = this.inputValue;
      },

      updateValidity_: function() {
        if (this.$.input.willValidate) {
          this.invalid = !this.$.input.validity.valid;
        }
      },

      keypressAction: function(e) {
        // disallow non-numeric input if type = number
        if (this.type !== 'number') {
          return;
        }
        var c = String.fromCharCode(e.charCode);
        if (e.charCode !== 0 && !c.match(/[\d-\.e]/)) {
          e.preventDefault();
        }
      },

      inputChangeAction: function() {
        this.commit();
        if (!window.ShadowDOMPolyfill) {
          // re-fire event that does not bubble across shadow roots
          this.fire('change', null, this);
        }
      },

      focusAction: function(e) {
        if (this.getAttribute('tabindex') > 0) {
          // Forward focus to the inner input if tabindex is set on the element
          // This will not cause an infinite loop because focus will not fire on the <input>
          // again if it's already focused.
          this.$.input.focus();
        }
      },

      inputFocusAction: function(e) {
        if (window.ShadowDOMPolyfill) {
          // re-fire non-bubbling event if polyfill
          this.fire('focus', null, this, false);
        }
      },

      inputBlurAction: function() {
        if (window.ShadowDOMPolyfill) {
          // re-fire non-bubbling event
          this.fire('blur', null, this, false);
        }
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method blur
       */
      blur: function() {
        this.$.input.blur();
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method click
       */
      click: function() {
        this.$.input.click();
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method focus
       */
      focus: function() {
        this.$.input.focus();
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method select
       */
      select: function() {
        this.$.input.select();
      },

      /**
       * Forwards to the internal input / textarea element.
       *
       * @method setSelectionRange
       * @param {number} selectionStart
       * @param {number} selectionEnd
       * @param {String} selectionDirection (optional)
       */
      setSelectionRange: function(selectionStart, selectionEnd, selectionDirection) {
        this.$.input.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
      },

      /**
       * Forwards to the internal input element, not implemented for multiline.
       *
       * @method setRangeText
       * @param {String} replacement
       * @param {number} start (optional)
       * @param {number} end (optional)
       * @param {String} selectMode (optional)
       */
      setRangeText: function(replacement, start, end, selectMode) {
        if (!this.multiline) {
          this.$.input.setRangeText(replacement, start, end, selectMode);
        }
      },

      /**
       * Forwards to the internal input, not implemented for multiline.
       *
       * @method stepDown
       * @param {number} n (optional)
       */
      stepDown: function(n) {
        if (!this.multiline) {
          this.$.input.stepDown(n);
        }
      },

      /**
       * Forwards to the internal input, not implemented for multiline.
       *
       * @method stepUp
       * @param {number} n (optional)
       */
      stepUp: function(n) {
        if (!this.multiline) {
          this.$.input.stepUp(n);
        }
      },

      get willValidate() {
        return this.$.input.willValidate;
      },

      get validity() {
        return this.$.input.validity;
      },

      get validationMessage() {
        return this.$.input.validationMessage;
      },

      /**
       * Forwards to the internal input / textarea element and updates state.
       *
       * @method checkValidity
       * @return {boolean}
       */
      checkValidity: function() {
        var r = this.$.input.checkValidity();
        this.updateValidity_();
        return r;
      },

      /**
       * Forwards to the internal input / textarea element and updates state.
       *
       * @method setCustomValidity
       * @param {String} message
       */
      setCustomValidity: function(message) {
        this.$.input.setCustomValidity(message);
        this.updateValidity_();
      }

    });
  ;

    Polymer('x-email', {
      
      type: 'email',

      dirty: false,

      send: function () {
        if (this.dirty) { return; }

        var request = this.$.request;
        var data = {
          email: this.value,
          sender: this.sender
        };

        if (this.validity.valid && this.value !== '') {
          request.params = JSON.stringify(data);
          request.go();
        } else {
          this.dirty = true;
          this.style.color = 'coral';
          this.value = "Inserisci una email valida!"
        }
      },

      inputFocusAction: function (event) {
        this.super();
        if (!this.dirty) { return; }

        this.value = '';
        this.style.color = 'white';
        this.dirty = false;
      },

      on_response: function (event) {
        this.style.color = '#2ecc71';
        this.value = "Abbiamo registrato la tua email, grazie!"
        this.disabled = true;
      },

      on_error: function () {
        this.dirty = true;
        this.style.color = 'coral';
        this.value = "Qualcosa è andato storto, prova di nuovo"
      }

    });
  ;

    Polymer('part-email', {

      on_keypress: function (event) {
        var email = this.$.email;
        if (event.keyCode === 13) {
          email.$.input.blur();
          email.send();
        }
      },

      on_click: function (event) {
        this.$.email.send();
      }

    });
  ;

    Polymer('form-contact', {

      dirty: false,

      email_label: 'Email',

      result: '',

      on_keypress: function (event) {
        if (event.keyCode === 13) {
          this.$.send.click();
        }
      },

      on_click: function (event) {
        event.preventDefault();
        event.stopPropagation();

         if (this.dirty) { return; }

        var $ = this.$;
        var request = $.request;
        var email = $.email.value;
        var fullname = $.fullname.value;
        var message = $.message.value;
        var phone = $.phone.value;
        var sender = $.sender.value;
        var data = {
          email: email,
          phone: phone,
          fullname: fullname,
          message: message,
          sender: sender
        };

        if (this.$.email.validity.valid && email !== '') {
          request.params = JSON.stringify(data);
          request.go();
        } else {
          this.dirty = true;
          this.email_label = "Inserisci un indirizzo email valido!";
          $.email_label.style.color = 'coral';
        }

        return null;
      },

      on_focus_email: function (event) {
        if (!this.dirty) { return; }
        this.on_focus();

        this.email_label = 'Email';
        this.dirty = false;
        this.$.email_label.style.color = 'black';
      },

      on_response: function (event) {
        this.result = 'ok';
        this.$.send.setAttribute('disabled', '');
      },

      on_error: function (event) {
        this.result = 'error';
      },

      on_focus: function (event) {
        if (!this.result === 'ok') { return; }
        this.result = '';
      }

    });
  ;

    Polymer('page-home', {

    });
  ;

    Polymer('page-policy', {

    });
  ;

    Polymer('page-contact', {

    });
  ;

    Polymer('page-glossary', {

      order: function (list) {
        return list.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        });
      },

      list: [
        {
          name: 'javascript',
          label: 'JavaScript',
          description: 'JavaScript è il linguaggio di programmazione del Web.',
          links: [
            'https://developer.mozilla.org/en/docs/Web/JavaScript',
            'http://en.wikipedia.org/wiki/JavaScript'
          ]
        },
        {
          name: 'html5',
          label: 'HTML5',
          description: "L'HTML (HyperText Markup Language, in italiano linguaggio a marcatori per ipertesti), è il linguaggio usato per la formattazione di documenti ipertestuali disponibili nel World Wide Web sotto forma di pagine web. L'HTML5 è l'ultima versione del linguaggio, diventato Standard del W3C (Word Wide Web Consorsium).",
          links: [
            'https://developer.mozilla.org/en-US/docs/Web/HTML',
            'http://en.wikipedia.org/wiki/HTML'
          ]
        },
        {
          name: 'css3',
          label: 'CSS3',
          description: "Il CSS (Cascading Style Sheets, in italiano fogli di stile) è un linguaggio usato per definire la formattazione e lo stile (colori, dimensioni, posizioni, carattere, ...) di documenti HTML. Le regole per comporre il CSS sono contenute in un insieme di direttive (Recommendations) emanate a partire dal 1996 dal W3C.",
          links: [
            'https://developer.mozilla.org/en-US/docs/Web/CSS',
            'http://en.wikipedia.org/wiki/Cascading_Style_Sheets'
          ]
        },
        {
          name: 'github',
          label: 'GitHub',
          description: "GitHub è un servizio web di hosting per lo sviluppo di progetti software che usa il sistema di controllo di versione Git. GitHub offre diversi piani per repository privati sia a pagamento, sia gratuiti, molto utilizzati per lo sviluppo di progetti open-source. Dal maggio 2011, GitHub è il più popolare repository di progetti open source.",
          links: [
            'https://github.com/'
          ]
        },
        {
          name: 'npm',
          label: 'NPM',
          description: "NPM è il gestore di pacchetti per la piattaforma node JavaScript. Mette i moduli in modo che node possa trovare, e gestisce i conflitti di dipendenza in modo intelligente. È estremamente configurabile per supportare un'ampia varietà di casi di utilizzo. Più comunemente, viene utilizzato per pubblicare, scoprire, installare e sviluppare programmi di nodo.",
          links: [
            'https://www.npmjs.org/'
          ]
        },
        {
          name: 'bower',
          label: 'Bower',
          description: "Bower è un famoso package manager by Twitter e il suo funzionamento è simile al npm di node.js. Permette di risolvere il problema delle librerie che utilizziamo in modo ripetuto nei nostri progetti (es. jquery). Con Bower è possibile scaricare le librerie, aggiornarle o rimuoverle direttamente da linea di comando, senza bisogno di andare di volta in volta a scaricare le nuove versioni dai rispettivi siti. Bower inoltre crea un file Json che memorizza le dipendenze della nostra webapp, evitandoci cosi di doverle caricare e scaricare nella nostra repository di Git: sarà sufficiente lanciare da linea di comando “bower install” per ritrovarcele al loro posto.",
          links: [
            'http://bower.io/'
          ]
        },
        {
          name: 'duo',
          label: 'Duo',
          description: "Duo, come Bower, è un package manager per frontend, ispirato da Component, Browserify e Go.",
          links: [
            'http://duojs.org/'
          ]
        },
        {
          name: 'yeoman',
          label: 'Yeoman',
          description: "Con la moltitudine di strumenti che abbiamo oggigiorno a disposizione per creare applicazioni web, non è sempre facile immaginare come farli funzionare a dovere insieme. Yeoman si pone l’obbiettivo di risolvere questo problema per noi, incorporando al suo interno tre importanti tools: Yo, Bower e Grunt. Essi, interagendo tra loro in modo a noi quasi del tutto trasparente, ci permettono di creare velocemente applicazioni web moderne. Yo unisce Bower e Grunt e fornisce un set di script per creare impalcature (scaffolding) per webapp, con lo scopo di includere autonomamente le varie best practices attualmente in uso. E’ quindi possibile creare con un comando, ad esempio lo scaffolding di una webapp per AngularJS, oppure più semplicemente un HTML5 Boilerplate con Bootstrap.",
          links: [
            'http://yeoman.io/',
            'http://en.wikipedia.org/wiki/Yeoman_(computing)'
          ]
        },
        {
          name: 'gulp',
          label: 'Gulp',
          description: "Gulp, come Grunt, è un task manager.",
          links: [
            'http://gulpjs.com/'
          ]
        },
        {
          name: 'grunt',
          label: 'Grunt',
          description: "Grunt è un task runner. Permette di configurare operazioni di routine (come la minificazione e la concatenazione di file) e di eseguirle in cascata in maniera automatica. Tra le varie funzioni di Grunt ricordiamo inoltre quella di preprocessare i nostri file scritti in less oppure sass.",
          links: [
            'http://gruntjs.com/'
          ]
        },
        {
          name: 'jquery',
          label: 'jQuery',
          description: "jQuery è una libreria di funzioni Javascript, per le applicazioni web, che si propone come obiettivo quello di semplificare la programmazione lato client delle pagine HTML. È un software liberamente distribuibile e gratuito, come previsto dalla licenza MIT. La sintassi di jQuery è studiata per semplificare la navigazione dei documenti, la selezione degli elementi DOM, creare animazioni, gestire eventi e implementare funzionalità AJAX.",
          links: [
            'http://jquery.com/',
            'http://en.wikipedia.org/wiki/JQuery'
          ]
        },
        {
          name: 'angularjs',
          label: 'Angular.js',
          description: "AngularJS è un framework open-source, manutenuto da Google, che permette lo sviluppo di single-page applications. Il suo obiettivo è di estendere le applicazioni Web con il paradigma MVC (Model View Controller), per rendere rapidi sia lo sviluppo che il test.",
          links: [
            'https://angularjs.org/',
            'http://en.wikipedia.org/wiki/AngularJS'
          ]
        },
        {
          name: 'polymerjs',
          label: 'Polymer.js',
          description: "I Web Components inaugurano una nuova era per lo sviluppo Web basato su elementi personalizzati, incapsulati e interoperabili che estendono il linguaggio HTML stesso. Costruito in cima a questi nuovi standard, Polymer.js rende più facile e veloce creare qualsiasi cosa, da un pulsante a una completa applicazione Web, su desktop, mobile e non solo.",
          links: [
            'https://www.polymer-project.org/',
            'http://webcomponents.org/'
          ]
        },
        {
          name: 'bootstrap',
          label: 'Bootstrap',
          description: "Bootstrap è il più popolare framework CSS per lo sviluppo di progetti Web responsive e mobile.",
          links: [
            'http://getbootstrap.com/'
          ]
        },
        {
          name: "d3js",
          label: 'D3.js',
          description: "D3.js (o semplicemente D3) è una libreria JavaScript che utilizza i dati per guidare la creazione e il controllo di forme grafiche dinamiche e interattive nel browser. Si tratta di uno strumento per la visualizzazione dei dati in formato W3C-compliant, avvalendosi degli standard W3C SVG (Scalable Vector Graphics), JavaScript, HTML5, e CSS3 (Cascading Style Sheets level 3). A differenza di molte altre librerie, D3 permette un grande controllo sul risultato visivo finale.",
          links: [
            'http://d3js.org/',
            'http://en.wikipedia.org/wiki/D3.js'
          ]
        },
        {
          name: "nodejs",
          label: 'Node.js',
          description: "Node.js è un ambiente di runtime open source e cross-platform per le applicazioni server-side e di networking. Le applicazioni Node.js sono scritte in JavaScript e possono essere eseguite entro il runtime Node.js su OS X, Microsoft Windows, Linux e FreeBSD. Node.js offre un'architettura event-driven e una non-blocking I/O API in grado di ottimizzare il throughput e la scalabilità di un'applicazione. Queste tecnologie sono comunemente usati per applicazioni in tempo reale. Node.js utilizza il motore di Google V8 JavaScript per eseguire codice, e una grande percentuale dei moduli di base sono scritti in JavaScript. Node.js contiene una libreria built-in per consentire alle applicazioni di agire come un server Web senza software come Apache HTTP Server o IIS. Node.js sta guadagnando l'adozione a piattaforma server-side ed è utilizzato da grandissime società come Groupon, SAP, LinkedIn, Microsoft, Yahoo!, Walmart, Rakuten e PayPal.",
          links: [
            'http://nodejs.org/',
            'http://en.wikipedia.org/wiki/Node.js'
          ]
        },
        {
          name: "expressjs",
          label: 'Express.js',
          description: "Express.js è un framework per applicazioni Web Node.js, progettata per la costruzione di una singola pagina, più pagine e applicazioni Web ibride.",
          links: [
            'http://expressjs.com/'
          ]
        },
        {
          name: "strongloop",
          label: "StrongLoop",
          description: "StrongLoop Suite è un prodotto software basato su Node.js che include tre componenti: un Backend-as-a-Service open-source privato, chiamato Loopback; una seconda componente che prevede operazioni e il monitoraggio delle prestazioni in tempo reale in una console, chiamato StrongOps; e un pacchetto Node.js, per operazioni avanzate di debug, il clustering e il supporto per i registri NPM privati, chiamato StrongNode.",
          links: [
            'http://strongloop.com/',
            'http://en.wikipedia.org/wiki/Strongloop'
          ]
        },
        {
          name: "mongodb",
          label: "MongoDB",
          description: "MongoDB (da \"humongous\") è un database document-oriented cross-platform. Classificato come un database NoSQL, MongoDB evita la tradizionale struttura del database relazionale basato su tabelle in favore di documenti JSON-like con schemi dinamici (MongoDB chiama il formato BSON), rendendo l'integrazione dei dati in alcuni tipi di applicazioni più semplice e veloce. Rilasciato sotto una combinazione della licenza GNU Affero General Public License e la Licenza Apache, MongoDB è un software gratuito e open-source.",
          links: [
            'http://www.mongodb.org/',
            'http://en.wikipedia.org/wiki/MongoDB'
          ]
        },
        {
          name: "redis",
          label: "Redis",
          description: "Redis è un server di dati strutturati, open-source, in rete, in memoria, e memorizza le chiavi con durata opzionale. Lo sviluppo di Redis è stato sponsorizzato da Software Pivotal dal maggio 2013; prima di questo, è stato sponsorizzato da VMware. Secondo la classifica mensile per DB-Engines.com, Redis è il database key-value più popolare. Il nome Redis significa REmote dizionario Server.",
          links: [
            'http://redis.io/',
            'http://en.wikipedia.org/wiki/Redis'
          ]
        },
        {
          name: "socketio",
          label: "Socket.io",
          description: "Socket.IO è una libreria JavaScript per le applicazioni Web real-time. Esso consente in tempo reale, la comunicazione bidirezionale tra client e server web. Ha due parti: una libreria lato client che viene eseguita nel browser e una libreria lato server per Node.js. Entrambi i componenti hanno una API quasi identica. Come Node.js, è event-driven. Socket.IO utilizza principalmente il protocollo WebSocket, ma se necessario può ricadere su altri metodi, come ad esempio Adobe Flash, JSONP polling, e AJAX polling, fornendo la stessa interfaccia. Anche se può essere utilizzato semplicemente come un involucro per WebSocket, fornisce molte più funzioni, tra cui la trasmissione di prese multiple, memorizzazione di dati associati a ciascun cliente, e I/O asincrono. Può essere installato con il NPM (i moduli dei pacchetti dei nodi) strumento.",
          links: [
            'http://socket.io/',
            'http://en.wikipedia.org/wiki/Socket.IO'
          ]
        }
      ]

    });
  ;

    Polymer('page-faber', {

    });
  ;

    Polymer('page-program', {

      data: {
        base: [
          { name: 'js', label: 'JavaScript' },
          { name: 'html5', label: 'HTML5' },
          { name: 'css3', label: 'CSS3' }
        ],
        tools: [
          // { name: 'bash', label: 'Bash' },
          // { name: 'git', label: 'Git' },
          { name: 'github', label: 'GitHub' },
          { name: 'npm', label: 'npm' },
          { name: 'bower', label: 'Bower' },
          { name: 'duo', label: 'DUO' },
          { name: 'yeoman', label: 'Yeoman' },
          { name: 'gulp', label: 'Gulp' },
          { name: 'grunt', label: 'Grunt' }
        ],
        frontend: [
          { name: 'jquery', label: 'jQuery' },
          { name: 'angular', label: 'Angular.js' },
          { name: 'polymer', label: 'Polymer.js' },
          { name: 'bootstrap', label: 'Bootstrap' },
          // { name: 'raphael', label: 'Raphael.js' },
          { name: 'd3', label: 'D3.js' }
        ],
        backend: [
          { name: 'nodejs', label: 'Node.js' },
          { name: 'express', label: 'Express.js' },
          { name: 'strongloop', label: 'StrongLoop' },
          { name: 'mongodb', label: 'MongoDB' },
          { name: 'redis', label: 'Redis' },
          { name: 'socketio', label: 'Socket.io' }
        ],
      }

    });
  ;

    Polymer('page-team', {

    });
  ;

    Polymer('page-unsubscribe', {

      result: '',

      on_response: function () {
        this.result = 'ok';
      },

      on_error: function () {
        this.result = 'error';
      }
    });
  ;
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.page=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
  /* globals require, module */

/**
   * Module dependencies.
   */

  var pathtoRegexp = _dereq_('path-to-regexp');

  /**
   * Module exports.
   */

  module.exports = page;

  /**
   * To work properly with the URL
   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
   */

  var location = window.history.location || window.location;

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
  * HashBang option
  */

  var hashbang = false;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' === typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' === typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      'string' === typeof fn
        ? page.redirect(path, fn)
        : page.show(path, fn);
    // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path){
    if (0 === arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options){
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) window.addEventListener('click', onclick, false);
    if (true === options.hashbang) hashbang = true;
    if (!dispatch) return;
    var url = (hashbang && location.hash.indexOf('#!') === 0)
      ? location.hash.substr(2) + location.search
      : location.pathname + location.search + location.hash;
    page.replace(url, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    running = false;
    removeEventListener('click', onclick, false);
    removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch){
    var ctx = new Context(path, state);
    if (false !== ctx.handled) ctx.pushState();
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} from
   * @param {String} to
   * @api public
   */
  page.redirect = function(from, to) {
    page(from, function (e) {
      setTimeout(function() {
        page.replace(to);
      });
    });
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */

  page.replace = function(path, state, init, dispatch){
    var ctx = new Context(path, state);
    ctx.init = init;
    ctx.save(); // save before dispatching, which may redirect
    if (false !== dispatch) page.dispatch(ctx);
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx){
    var i = 0;

    function next() {
      var fn = page.callbacks[i++];
      if (!fn) return unhandled(ctx);
      fn(ctx, next);
    }

    next();
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (ctx.handled) return;
    var current = location.pathname + location.search;
    if (current === ctx.canonicalPath) return;
    page.stop();
    ctx.handled = false;
    location.href = ctx.canonicalPath;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + path;
    var i = path.indexOf('?');

    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';

    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i
      ? path.slice(i + 1)
      : '';
    this.pathname = ~i
      ? path.slice(0, i)
      : path;
    this.params = [];

    // fragment
    this.hash = '';
    if (!~this.path.indexOf('#')) return;
    var parts = this.path.split('#');
    this.path = parts[0];
    this.hash = parts[1] || '';
    this.querystring = this.querystring.split('#')[0];
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function(){
    history.pushState(this.state
      , this.title
      , hashbang && this.canonicalPath !== '/'
        ? '#!' + this.canonicalPath
        : this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state
      , this.title
      , hashbang && this.canonicalPath !== '/'
        ? '#!' + this.canonicalPath
        : this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = (path === '*') ? '(.*)' : path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(this.path,
      this.keys = [],
      options.sensitive,
      options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn){
    var self = this;
    return function(ctx, next){
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    };
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys,
        qsIndex = path.indexOf('?'),
        pathname = ~qsIndex
          ? path.slice(0, qsIndex)
          : path,
        m = this.regexp.exec(decodeURIComponent(pathname));

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' === typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Handle "populate" events.
   */

  function onpopstate(e) {
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    }
  }

  /**
   * Handle "click" events.
   */

  function onclick(e) {
    if (1 != which(e)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    var el = e.target;
    while (el && 'A' != el.nodeName) el = el.parentNode;
    if (!el || 'A' != el.nodeName) return;

    // ensure non-hash for the same path
    var link = el.getAttribute('href');
    if (el.pathname === location.pathname && (el.hash || '#' === link)) return;

    // Check for mailto: in the href
    if (link && link.indexOf("mailto:") > -1) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(el.href)) return;

    // rebuild path
    var path = el.pathname + el.search + (el.hash || '');

    // same page
    var orig = path + el.hash;

    path = path.replace(base, '');
    if (base && orig === path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null === e.which
      ? e.button
      : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return (href && (0 === href.indexOf(origin)));
  }

  page.sameOrigin = sameOrigin;

},{"path-to-regexp":2}],2:[function(_dereq_,module,exports){
/**
 * Expose `pathtoRegexp`.
 */
module.exports = pathtoRegexp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match already escaped characters that would otherwise incorrectly appear
  // in future matches. This allows the user to escape special characters that
  // shouldn't be transformed.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
  // Match regexp special characters that should always be escaped.
  '([.+*?=^!:${}()[\\]|\\/])'
].join('|'), 'g');

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {String} group
 * @return {String}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {RegExp} re
 * @param  {Array}  keys
 * @return {RegExp}
 */
var attachKeys = function (re, keys) {
  re.keys = keys;

  return re;
};

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array should be passed in, which will contain the placeholder key
 * names. For example `/user/:id` will then contain `["id"]`.
 *
 * @param  {(String|RegExp|Array)} path
 * @param  {Array}                 keys
 * @param  {Object}                options
 * @return {RegExp}
 */
function pathtoRegexp (path, keys, options) {
  if (keys && !Array.isArray(keys)) {
    options = keys;
    keys = null;
  }

  keys = keys || [];
  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var flags = options.sensitive ? '' : 'i';
  var index = 0;

  if (path instanceof RegExp) {
    // Match all capturing groups of a regexp.
    var groups = path.source.match(/\((?!\?)/g) || [];

    // Map all the matches to their numeric keys and push into the keys.
    keys.push.apply(keys, groups.map(function (match, index) {
      return {
        name:      index,
        delimiter: null,
        optional:  false,
        repeat:    false
      };
    }));

    // Return the source back to the user.
    return attachKeys(path, keys);
  }

  if (Array.isArray(path)) {
    // Map array parts into regexps and return their source. We also pass
    // the same keys and options instance into every generation to get
    // consistent matching groups before we join the sources together.
    path = path.map(function (value) {
      return pathtoRegexp(value, keys, options).source;
    });

    // Generate a new regexp instance by joining all the parts together.
    return attachKeys(new RegExp('(?:' + path.join('|') + ')', flags), keys);
  }

  // Alter the path string into a usable regexp.
  path = path.replace(PATH_REGEXP, function (match, escaped, prefix, key, capture, group, suffix, escape) {
    // Avoiding re-escaping escaped characters.
    if (escaped) {
      return escaped;
    }

    // Escape regexp special characters.
    if (escape) {
      return '\\' + escape;
    }

    var repeat   = suffix === '+' || suffix === '*';
    var optional = suffix === '?' || suffix === '*';

    keys.push({
      name:      key || index++,
      delimiter: prefix || '/',
      optional:  optional,
      repeat:    repeat
    });

    // Escape the prefix character.
    prefix = prefix ? '\\' + prefix : '';

    // Match using the custom capturing group, or fallback to capturing
    // everything up to the next slash (or next period if the param was
    // prefixed with a period).
    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

    // Allow parameters to be repeated more than once.
    if (repeat) {
      capture = capture + '(?:' + prefix + capture + ')*';
    }

    // Allow a parameter to be optional.
    if (optional) {
      return '(?:' + prefix + '(' + capture + '))?';
    }

    // Basic parameter support.
    return prefix + '(' + capture + ')';
  });

  // Check whether the path ends in a slash as it alters some match behaviour.
  var endsWithSlash = path[path.length - 1] === '/';

  // In non-strict mode we allow an optional trailing slash in the match. If
  // the path to match already ended with a slash, we need to remove it for
  // consistency. The slash is only valid at the very end of a path match, not
  // anywhere in the middle. This is important for non-ending mode, otherwise
  // "/test/" will match "/test//route".
  if (!strict) {
    path = (endsWithSlash ? path.slice(0, -2) : path) + '(?:\\/(?=$))?';
  }

  // In non-ending mode, we need prompt the capturing groups to match as much
  // as possible by using a positive lookahead for the end or next path segment.
  if (!end) {
    path += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return attachKeys(new RegExp('^' + path + (end ? '$' : ''), flags), keys);
};

},{}]},{},[1])
(1)
});;
// google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-56515755-1', 'auto');


// app boot
window.logFlags = window.logFlags || {};
var host_re = /^[www\.]?hackfaber\.com/;
var hostname = location.hostname;
var host_query = host_re.exec(hostname);
var env = host_query && host_query[0] === 'hackfaber.com' ? 'production' : 'develop';
var production = function () { return env === 'production'; };

var app = document.getElementById('app');

var open = function (page_name, details) {
  return function (context) {
    var params = context.params;
    var property;
    var element = document.createElement(page_name);
    for (property in params) {
      if (isNaN(property)) {
        element.setAttribute(property, params[property]);
      }
    }
    context.element = element;
    while (app.firstChild) app.removeChild(app.firstChild);
    app.appendChild(element);
    element.details = details;
    scroll(0,0);
  };
};

var onchange = function (event) {
  var url = event.detail;
  page.show(url);
  if (production()) {
    ga('send', 'pageview', url);
  }
};

app.addEventListener('click link', onchange);

var start = function () {
  page('/', open('page-home'));
  page('/policy', open('page-policy'));
  page('/contact', open('page-contact'));
  page('/glossary', open('page-glossary'));
  page('/faber', open('page-faber'));
  page('/home', open('page-home'));
  page('/program', open('page-program'));
  page('/team', open('page-team'));
  page('/unsubscribe/:code', open('page-unsubscribe'));
  page('*', open('page-home'));
  page();

  console.log('Welcome to HackFaber!');
};
  
start();
