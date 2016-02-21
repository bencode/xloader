'use strict';


const log = require('./log');


/* global window, document */


const rCss = /\.css(\?|$)/;


exports.postLoadScript = null;


exports.load = function(url, options) {
  const type = rCss.test(url) ? 'css' : 'script';
  return exports[type](url, options);
};


let currentlyAddingScript;

exports.script = function(url, options) {
  options = options || {};

  const node = doc.createElement('script');
  const removeNode = !log.isEnabled('debug');

  onLoadAssets(node, url, removeNode, options, function() {
    if (exports.postLoadScript) {
      exports.postLoadScript(url, options);
      exports.postLoadScript = null;
    }
  });

  node.async = 'async';
  if (options.namespace) {
    node.setAttribute('data-namespace', options.namespace);
  }
  node.src = url;

  if (options.charset) {
    node.charset = options.charset;
  }

  currentlyAddingScript = node;
  append(node);
  currentlyAddingScript = null;
};
//~ script


const rWebKit = /.*webkit\/?(\d+)\..*/;
const rMobile = /mobile/;

const UA = window.navigator.userAgent.toLowerCase();
const webkitVersion = rWebKit.exec(UA);
const isOldWebKit = webkitVersion ? webkitVersion[1] * 1 < 536 : false;
const isPollCSS = isOldWebKit || (!webkitVersion && rMobile.test(UA));


exports.css = function(url, options) {
  options = options || {};

  const node = doc.createElement('link');

  node.rel = 'stylesheet';
  node.href = url;

  if (options.charset) {
    node.charset = options.charset;
  }

  if (!('onload' in node) || isPollCSS) {
    setTimeout(function() {
      poll(node, options);
    }, 1);
  } else {
    onLoadAssets(node, url, false, options);
  }

  append(node);
};
//~ css


const rLoadSheetError = /security|denied/i;
function poll(node, options) {
  let flag = false;

  setTimeout(function() {
    if (!flag) {
      flag = true;
      options.error && options.error(new Error('poll request css timeout'));
    }
  }, options.timeout || 10000);

  const fn = function() {
    let isLoaded = false;
    try {
      isLoaded = !!node.sheet;
    } catch (e) {
      isLoaded = rLoadSheetError.test(e.message);
    }

    if (!flag) {
      if (isLoaded) {
        flag = true;
        options.success && options.success();
      } else {
        setTimeout(fn, 20);
      }
    }
  };

  fn();
}


const rReadyStates = /loaded|complete|undefined/;

/* eslint max-params: [2, 5] */
function onLoadAssets(node, url, removeNode, options, fn) {
  node.onload = node.onreadystatechange = function(event) {
    event = event || window.event || {};
    if (event.type === 'load' || rReadyStates.test('' + node.readyState)) {
      node.onload = node.onreadystatechange = node.onerror = null;
      removeNode && head.removeChild(node);
      fn && fn();
      options.success && options.success();
    }
  };

  node.onerror = function() {
    node.onload = node.onreadystatechange = node.onerror = null;
    const e = new Error('load assets error: ' + url);
    options.error && options.error(e);
  };
}


const doc = document;
const head = doc.head ||
    doc.getElementsByTagName('head')[0] ||
    doc.documentElement;
const baseElement = doc.getElementsByTagName('base')[0];

function append(node) {
  baseElement ? head.insertBefore(node, baseElement) :
      head.appendChild(node);
}


// from seajs
let interactiveScript;

exports.getCurrentScript = function() {
  if (currentlyAddingScript) {
    return currentlyAddingScript;
  }

  // For IE6-9 browsers, the script onload event may not fire right
  // after the script is evaluated. Kris Zyp found that it
  // could query the script nodes and the one that is in "interactive"
  // mode indicates the current script
  // ref: http://goo.gl/JHfFW
  if (interactiveScript && interactiveScript.readyState === 'interactive') {
    return interactiveScript;
  }

  const scripts = head.getElementsByTagName('script');

  for (let i = scripts.length - 1; i >= 0; i--) {
    const script = scripts[i];
    if (script.readyState === 'interactive') {
      interactiveScript = script;
      return interactiveScript;
    }
  }
};
