/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable()
export class ElementHelperService {
  constructor() {}

  ignoreElement = el => {
    if (el instanceof $) {
      el = el[0];
    }
    while (el) {
      el = el.parentNode;
    }
    return false;
  };

  elementLocation(el): string {
    if (el == null) {
      console.log('Got null element');
    }

    if (el instanceof $) {
      // a jQuery element
      el = el[0];
    }
    if (el[0] && el.attr && el[0].nodeType == 1) {
      // Or a jQuery element not made by us
      el = el[0];
    }
    if (el.id) {
      return '#' + el.id;
    }
    if (el.tagName == 'BODY') {
      return 'body';
    }
    if (el.tagName == 'HEAD') {
      return 'head';
    }
    if (el === document) {
      return 'document';
    }
    var parent = el.parentNode;
    if (!parent || parent == el) {
      console.warn('elementLocation(', el, ') has null parent');
      throw new Error('No locatable parent found');
    }
    var parentLocation = this.elementLocation(parent);
    var children = parent.childNodes;
    var _len = children.length;
    var index = 0;
    for (var i = 0; i < _len; i++) {
      if (children[i] == el) {
        break;
      }
      if (children[i].nodeType == document.ELEMENT_NODE) {
        if (children[i].className.indexOf('togetherjs') != -1) {
          // Don't count our UI
          continue;
        }
        // Don't count text or comments
        index++;
      }
    }
    return parentLocation + ':nth-child(' + (index + 1) + ')';
  }

  findElement = (loc, container) => {
    container = container || document;
    var el, rest;
    if (loc === 'body') {
      return document.body;
    } else if (loc === 'head') {
      return document.head;
    } else if (loc === 'document') {
      return document;
    } else if (loc.indexOf('body') === 0) {
      el = document.body;
      return this.findElement(loc.substr('body'.length), el);
    } else if (loc.indexOf('head') === 0) {
      el = document.head;
      return this.findElement(loc.substr('head'.length), el);
    } else if (loc.indexOf('#') === 0) {
      var id;
      loc = loc.substr(1);
      if (loc.indexOf(':') === -1) {
        id = loc;
        rest = '';
      } else {
        id = loc.substr(0, loc.indexOf(':'));
        rest = loc.substr(loc.indexOf(':'));
      }
      el = document.getElementById(id);

      if (rest) {
        return this.findElement(rest, el);
      } else {
        return el;
      }
    } else if (loc.indexOf(':nth-child(') === 0) {
      loc = loc.substr(':nth-child('.length);
      if (loc.indexOf(')') == -1) {
        throw 'Invalid location, missing ): ' + loc;
      }
      var num = loc.substr(0, loc.indexOf(')'));
      num = parseInt(num, 10);
      var count = num;
      loc = loc.substr(loc.indexOf(')') + 1);
      var children = container.childNodes;
      el = null;
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType == document.ELEMENT_NODE) {
          if (child.className.indexOf('togetherjs') != -1) {
            continue;
          }
          count--;
          if (count === 0) {
            // this is the element
            el = child;
            break;
          }
        }
      }
      if (!el) {
        console.log('cannot find element');
      }
      if (loc) {
        return this.findElement(loc, el);
      } else {
        return el;
      }
    } else {
      console.log('Error');
    }
  };

  elementByPixel = height => {
    /* Returns {location: "...", offset: pixels}
  
             To get the pixel position back, you'd do:
               $(location).offset().top + offset
           */
    function search(start, height) {
      var last = null;
      var children = start.children();
      children.each(function() {
        var el = $(this);
        if (
          el.hasClass('togetherjs') ||
          el.css('position') == 'fixed' ||
          !el.is(':visible')
        ) {
          return;
        }
        if (el.offset().top > height) {
          return false;
        }
        last = el;
      });
      if (!children.length || !last) {
        // There are no children, or only inapplicable children
        return {
          location: this.elementLocation(start[0]),
          offset: height - start.offset().top,
          absoluteTop: height,
          documentHeight: $(document).height()
        };
      }
      return search(last, height);
    }
    return search($(document.body), height);
  };

  pixelForPosition = position => {
    /* Inverse of elementFinder.elementByPixel */
    if (position.location == 'body') {
      return position.offset;
    }
    var el;
    try {
      el = this.findElement(position.location, null);
    } catch (e) {
      if (position.absoluteTop) {
        // We don't trust absoluteTop to be quite right locally, so we adjust
        // for the total document height differences:
        var percent = position.absoluteTop / position.documentHeight;
        return $(document).height() * percent;
      }
      throw e;
    }
    var top = $(el).offset().top;
    // FIXME: maybe here we should test for sanity, like if an element is
    // hidden.  We can use position.absoluteTop to get a sense of where the
    // element roughly should be.  If the sanity check failed we'd use
    // absoluteTop
    return top + position.offset;
  };
}
